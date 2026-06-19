// client/src/api/conversations.js
// API helpers for all conversation endpoints

import http from "./http";

/**
 * Get all conversations the current user is in.
 * Requires Authorization header (set by http interceptor or caller).
 */
export const getMyConversations = (token) =>
  http.get("/api/conversations", {
    headers: { Authorization: `Bearer ${token}` },
  });

/** Start or get an existing DM with targetUserId */
export const startDM = (token, targetUserId) =>
  http.post(
    "/api/conversations/dm",
    { targetUserId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Create a new group conversation */
export const createGroup = (token, { name, description, participantIds }) =>
  http.post(
    "/api/conversations/group",
    { name, description, participantIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Create a new public community */
export const createCommunity = (token, { name, description }) =>
  http.post(
    "/api/conversations/community",
    { name, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** List all public communities */
export const getCommunities = (token) =>
  http.get("/api/conversations/communities", {
    headers: { Authorization: `Bearer ${token}` },
  });

/** Join a public community */
export const joinCommunity = (token, conversationId) =>
  http.post(
    `/api/conversations/${conversationId}/join`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Get message history for a conversation */
export const getConversationMessages = (token, conversationId, params = {}) =>
  http.get(`/api/conversations/${conversationId}/messages`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

/** Update group name / description / avatar */
export const updateConversation = (token, conversationId, data) =>
  http.patch(`/api/conversations/${conversationId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

/** Add or remove a member from a group */
export const updateMembers = (token, conversationId, { action, memberId }) =>
  http.patch(
    `/api/conversations/${conversationId}/members`,
    { action, memberId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Delete a conversation */
export const deleteConversation = (token, conversationId) =>
  http.delete(`/api/conversations/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/** Toggle conversation pin */
export const togglePin = (token, conversationId) =>
  http.post(
    `/api/conversations/${conversationId}/pin`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Toggle conversation mute */
export const toggleMute = (token, conversationId) =>
  http.post(
    `/api/conversations/${conversationId}/mute`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
