// client/src/context/ConversationContext.jsx
// NEW CONTEXT: Central state for conversations, active chat, unread counts,
// online users, and typing indicators across all conversation types.

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";
import { getMyConversations } from "../api/conversations";
import { getInvitations } from "../api/invitations";

// ─────────────────────────────────────────────────────────────────────────────
// Initial state shape
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  conversations: [],          // all user conversations
  activeConversation: null,   // currently open conversation object
  messages: [],               // messages for the active conversation
  unreadCounts: {},           // { conversationId: number }
  onlineUsers: {},            // { conversationId: Set of userIds }
  typingUsers: {},            // { conversationId: [username] }
  invitations: [],            // pending invitations
  loading: false,
  error: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────
function conversationReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload, loading: false };

    case "ADD_CONVERSATION":
      // Prepend new conversation; avoid duplicates
      return {
        ...state,
        conversations: [
          action.payload,
          ...state.conversations.filter((c) => c._id !== action.payload._id),
        ],
      };

    case "SET_ACTIVE_CONVERSATION":
      return {
        ...state,
        activeConversation: action.payload,
        messages: [],          // clear messages when switching
        // Clear unread for this conversation
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload?._id]: 0,
        },
      };

    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "APPEND_MESSAGE": {
      const msg = action.payload;
      // Avoid duplicates
      if (state.messages.some((m) => m._id === msg._id)) return state;
      return { ...state, messages: [...state.messages, msg] };
    }

    case "UPDATE_LAST_MESSAGE": {
      const { conversationId, lastMessage } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c._id === conversationId ? { ...c, lastMessage } : c
        ),
      };
    }

    case "INCREMENT_UNREAD": {
      const { conversationId } = action.payload;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
        },
      };
    }

    case "CLEAR_UNREAD":
      return {
        ...state,
        unreadCounts: { ...state.unreadCounts, [action.payload]: 0 },
      };

    case "SET_USER_ONLINE": {
      const { conversationId, userId } = action.payload;
      const prev = state.onlineUsers[conversationId]
        ? new Set(state.onlineUsers[conversationId])
        : new Set();
      prev.add(userId);
      return {
        ...state,
        onlineUsers: { ...state.onlineUsers, [conversationId]: [...prev] },
      };
    }

    case "SET_USER_OFFLINE": {
      const { conversationId, userId } = action.payload;
      const prev = state.onlineUsers[conversationId]
        ? new Set(state.onlineUsers[conversationId])
        : new Set();
      prev.delete(userId);
      return {
        ...state,
        onlineUsers: { ...state.onlineUsers, [conversationId]: [...prev] },
      };
    }

    case "SET_TYPING": {
      const { conversationId, username, isTyping } = action.payload;
      const prev = new Set(state.typingUsers[conversationId] || []);
      if (isTyping) prev.add(username);
      else prev.delete(username);
      return {
        ...state,
        typingUsers: { ...state.typingUsers, [conversationId]: [...prev] },
      };
    }

    case "SET_INVITATIONS":
      return { ...state, invitations: action.payload };

    case "REMOVE_INVITATION":
      return {
        ...state,
        invitations: state.invitations.filter((i) => i._id !== action.payload),
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
export const ConversationContext = createContext(null);

export function ConversationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  // Ref to track active conversation for socket event handlers
  const activeConvRef = useRef(null);
  activeConvRef.current = state.activeConversation;

  // ── Load conversations and invitations on login ──────────────────────────
  useEffect(() => {
    if (!user?.token) return;

    const load = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const [convsRes, invRes] = await Promise.all([
          getMyConversations(user.token),
          getInvitations(user.token),
        ]);
        dispatch({ type: "SET_CONVERSATIONS", payload: convsRes.data });
        dispatch({ type: "SET_INVITATIONS", payload: invRes.data });
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load conversations" });
      }
    };

    load();
  }, [user?.token]);

  // ── Socket event listeners ────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !user?.token) return;

    // New message received in any conversation
    const onNewMessage = (msg) => {
      const activeId = activeConvRef.current?._id;

      if (msg.conversationId === activeId) {
        // Active conversation — append and mark read
        dispatch({ type: "APPEND_MESSAGE", payload: msg });
        socket.emit("messageRead", {
          token: user.token,
          conversationId: msg.conversationId,
          messageIds: [msg._id],
        });
      } else {
        // Background conversation — increment unread badge
        dispatch({ type: "INCREMENT_UNREAD", payload: { conversationId: msg.conversationId } });
      }

      // Update lastMessage preview in sidebar
      dispatch({
        type: "UPDATE_LAST_MESSAGE",
        payload: {
          conversationId: msg.conversationId,
          lastMessage: {
            content: msg.content,
            senderId: msg.senderId,
            createdAt: msg.createdAt,
          },
        },
      });
    };

    // History loaded after joining a conversation
    const onHistory = (messages) => {
      dispatch({ type: "SET_MESSAGES", payload: messages });
    };

    // User came online in this conversation
    const onUserOnline = ({ userId, conversationId }) => {
      if (conversationId) {
        dispatch({ type: "SET_USER_ONLINE", payload: { conversationId, userId } });
      }
    };

    // User went offline
    const onUserOffline = ({ userId }) => {
      const activeId = activeConvRef.current?._id;
      if (activeId) {
        dispatch({ type: "SET_USER_OFFLINE", payload: { conversationId: activeId, userId } });
      }
    };

    // Typing indicator (conversation-scoped)
    const onTyping = ({ username, isTyping, conversationId }) => {
      const targetId = conversationId || activeConvRef.current?._id;
      if (targetId) {
        dispatch({ type: "SET_TYPING", payload: { conversationId: targetId, username, isTyping } });
      }
    };

    socket.on("newMessage", onNewMessage);
    socket.on("conversationHistory", onHistory);
    socket.on("userOnline", onUserOnline);
    socket.on("userOffline", onUserOffline);
    socket.on("typing", onTyping);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("conversationHistory", onHistory);
      socket.off("userOnline", onUserOnline);
      socket.off("userOffline", onUserOffline);
      socket.off("typing", onTyping);
    };
  }, [socket, user?.token]);

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Set the active conversation and emit joinConversation */
  const openConversation = useCallback(
    (conversation) => {
      // Leave previous conversation
      if (activeConvRef.current && socket && user?.token) {
        socket.emit("leaveConversation", {
          token: user.token,
          conversationId: activeConvRef.current._id,
        });
      }

      dispatch({ type: "SET_ACTIVE_CONVERSATION", payload: conversation });

      // Join new conversation
      if (conversation && socket && user?.token) {
        socket.emit("joinConversation", {
          token: user.token,
          conversationId: conversation._id,
        });
      }
    },
    [socket, user?.token]
  );

  /** Send a message in the active conversation */
  const sendMessage = useCallback(
    ({ conversationId, content, replyTo }) => {
      if (!socket || !user?.token || !content?.trim()) return;
      socket.emit("sendMessage", {
        token: user.token,
        conversationId,
        content,
        replyTo,
      });
    },
    [socket, user?.token]
  );

  /** Emit typing indicator for a conversation */
  const emitTyping = useCallback(
    (conversationId, isTyping) => {
      if (!socket || !user?.token) return;
      socket.emit("typing", {
        token: user.token,
        conversationId,
        username: user.username,
        isTyping,
      });
    },
    [socket, user?.token, user?.username]
  );

  /** Add a conversation after creating DM/group */
  const addConversation = useCallback((conv) => {
    dispatch({ type: "ADD_CONVERSATION", payload: conv });
  }, []);

  /** Remove an invitation after accept/reject */
  const removeInvitation = useCallback((invitationId) => {
    dispatch({ type: "REMOVE_INVITATION", payload: invitationId });
  }, []);

  const value = {
    ...state,
    openConversation,
    sendMessage,
    emitTyping,
    addConversation,
    removeInvitation,
    dispatch,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

/** Custom hook */
export const useConversation = () => useContext(ConversationContext);
