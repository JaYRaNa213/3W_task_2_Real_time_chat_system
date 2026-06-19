// client/src/api/invitations.js
// API helpers for invitation lifecycle

import http from "./http";

/** Get all pending invitations for the logged-in user */
export const getInvitations = (token) =>
  http.get("/api/invitations", {
    headers: { Authorization: `Bearer ${token}` },
  });

/** Send an invitation to a user for a group/community */
export const sendInvitation = (token, { conversationId, receiverId, message }) =>
  http.post(
    "/api/invitations/send",
    { conversationId, receiverId, message },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Accept a pending invitation */
export const acceptInvitation = (token, invitationId) =>
  http.post(
    "/api/invitations/accept",
    { invitationId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Reject a pending invitation */
export const rejectInvitation = (token, invitationId) =>
  http.post(
    "/api/invitations/reject",
    { invitationId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
