import mongoose from "mongoose";

const { Schema } = mongoose;

const AccountSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    accessTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);

