import mongoose, { Schema, type Document } from "mongoose";

export interface IAnalysis extends Document {
  userId: string;
  idea: string;
  appName: string;
  target: string;
  problem: string;
  revenue: string;
  competitors: string;
  category: string;
  score: number;
  verdict: "VIABLE" | "RISKY" | "NOT VIABLE" | "CONDITIONAL PASS";
  verdictColor: string;
  summary: string;
  metrics: {
    label: string;
    value: string;
    trend: "up" | "down" | "neutral";
    detail: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  followUpMessages: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: { type: String, required: true, index: true },
    idea: { type: String, required: true },
    appName: { type: String, default: "" },
    target: { type: String, required: true },
    problem: { type: String, required: true },
    revenue: { type: String, default: "" },
    competitors: { type: String, default: "" },
    category: { type: String, default: "Other" },
    score: { type: Number, default: 0 },
    verdict: {
      type: String,
      enum: ["VIABLE", "RISKY", "NOT VIABLE", "CONDITIONAL PASS"],
      default: "RISKY",
    },
    verdictColor: { type: String, default: "#FF8A3D" },
    summary: { type: String, default: "" },
    metrics: [
      {
        label: String,
        value: String,
        trend: { type: String, default: "up" },
        detail: String,
      },
    ],
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    followUpMessages: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const Analysis =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>("Analysis", AnalysisSchema);
