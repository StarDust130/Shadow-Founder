import mongoose, { Schema, type Document } from "mongoose";

export interface IBuild extends Document {
  userId: string;
  analysisId: string;
  ideaTitle: string;
  techStack: string[];
  files: {
    path: string;
    content: string;
    lang: string;
    lines: number;
  }[];
  status: "GENERATING" | "READY" | "ERROR";
  createdAt: Date;
  updatedAt: Date;
}

const BuildSchema = new Schema<IBuild>(
  {
    userId: { type: String, required: true, index: true },
    analysisId: { type: String, required: true },
    ideaTitle: { type: String, default: "" },
    techStack: [String],
    files: [
      {
        path: String,
        content: String,
        lang: String,
        lines: Number,
      },
    ],
    status: {
      type: String,
      enum: ["GENERATING", "READY", "ERROR"],
      default: "GENERATING",
    },
  },
  { timestamps: true },
);

export const Build =
  mongoose.models.Build || mongoose.model<IBuild>("Build", BuildSchema);
