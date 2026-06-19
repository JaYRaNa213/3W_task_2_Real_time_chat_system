// server/src/middleware/verifyConversationAccess.js
// NEW MIDDLEWARE: Access control gate for conversation routes
// Rule: public → allow; else → verify participant; else → 403
// Never trust the frontend — always verify server-side.

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Conversation from "../models/Conversation.model.js";

/**
 * verifyConversationAccess
 * Requires:
 *   - Authorization: Bearer <token> header
 *   - :conversationId param or req.body.conversationId
 *
 * Attaches req.user and req.conversation on success.
 */
export async function verifyConversationAccess(req, res, next) {
  try {
    // ── 1. Authenticate JWT ──────────────────────────────────────────────
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: no token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Unauthorized: invalid token" });
    }
    req.user = decoded;

    // ── 2. Validate conversationId ───────────────────────────────────────
    const conversationId =
      req.params.conversationId || req.body.conversationId;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    // ── 3. Load conversation ─────────────────────────────────────────────
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // ── 4. Access check ──────────────────────────────────────────────────
    const isPublic = conversation.visibility === "public";
    const isMember = conversation.participants.some(
      (p) => p.toString() === decoded.id
    );

    if (!isPublic && !isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    // ── 5. Attach to request for downstream handlers ─────────────────────
    req.conversation = conversation;
    next();
  } catch (err) {
    console.error("[verifyConversationAccess] error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
