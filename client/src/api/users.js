// client/src/api/users.js
// API helpers for user search, profile, and block management

import http from "./http";

/** Search users by username (partial match) */
export const searchUsers = (token, query) =>
  http.get("/api/users/search", {
    params: { q: query },
    headers: { Authorization: `Bearer ${token}` },
  });

/** Get current user's profile */
export const getMyProfile = (token) =>
  http.get("/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

/** Update current user's avatar */
export const updateProfile = (token, { avatar }) =>
  http.patch(
    "/api/users/profile",
    { avatar },
    { headers: { Authorization: `Bearer ${token}` } }
  );

/** Toggle block/unblock a user */
export const toggleBlock = (token, targetId) =>
  http.patch(
    `/api/users/block/${targetId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
