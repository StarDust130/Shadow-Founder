import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  plan: "free" | "pro";
  buildsUsed: number;
  maxBuilds: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    firstName: { type: String, default: "Builder" },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    buildsUsed: { type: Number, default: 0 },
    maxBuilds: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
