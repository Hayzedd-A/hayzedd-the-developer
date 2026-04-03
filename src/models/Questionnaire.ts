import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionnaire extends Document {
  serviceType: string[];
  stage: string;
  designAssets: string;
  platforms: string[];
  technologies: string[];
  keyFeatures: string[];
  expectedUsers: string;
  budget: string;
  timeline: string;
  ongoingSupport: string;
  helpWith: string[];
  projectDescription: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const QuestionnaireSchema = new Schema<IQuestionnaire>({
  serviceType: { type: [String], default: [] },
  stage: { type: String, default: "" },
  designAssets: { type: String, default: "" },
  platforms: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
  keyFeatures: { type: [String], default: [] },
  expectedUsers: { type: String, default: "" },
  budget: { type: String, default: "" },
  timeline: { type: String, default: "" },
  ongoingSupport: { type: String, default: "" },
  helpWith: { type: [String], default: [] },
  projectDescription: { type: String, default: "" },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const Questionnaire =
  mongoose.models.Questionnaire ||
  mongoose.model<IQuestionnaire>("Questionnaire", QuestionnaireSchema);
