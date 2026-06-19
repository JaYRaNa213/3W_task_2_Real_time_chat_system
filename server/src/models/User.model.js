// server/src/models/User.model.js
// UPDATED: Added avatar, lastSeen, blockedUsers for profile + privacy features
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username:     { type: String, unique: true, required: true, trim: true },
    password:     { type: String, required: true }, // bcrypt hash — do not expose

    // --- New fields (all optional; existing documents get defaults) ---
    avatar:       { type: String, default: "" },          // URL or base64
    lastSeen:     { type: Date,   default: null },         // updated on disconnect
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // blocked list
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
