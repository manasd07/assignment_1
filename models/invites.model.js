import mongoose from "mongoose";
const Schema = mongoose.Schema;

const inviteSchema = new Schema(
  {
    invitedBy: {
      type: String,
      required: true,
    },
    invitedTo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Invite = mongoose.model("invites", inviteSchema);
module.exports = Invite;
