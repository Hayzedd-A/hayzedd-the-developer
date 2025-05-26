import mongoose, { Schema, Document } from "mongoose";

export interface IPageView extends Document {
  sessionId: string;
  visitorId: string;
  page: string;
  title: string;
  referrer?: string;
  timestamp: Date;
  duration?: number;
  scrollDepth?: number;
  userAgent?: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  device?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface IVisitorSession extends Document {
  sessionId: string;
  visitorId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  location: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  device: {
    type: string;
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  screen: {
    width?: number;
    height?: number;
    colorDepth?: number;
  };
  language: string;
  timezone: string;
  firstVisit: Date;
  lastActivity: Date;
  pageViews: number;
  totalDuration: number;
  isReturningVisitor: boolean;
  source?: string;
  medium?: string;
  campaign?: string;
  exitPage?: string;
  bounced?: boolean;
}

export interface IEvent extends Document {
  sessionId: string;
  visitorId: string;
  eventType: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  page: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  userAgent?: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export interface IFormSubmission extends Document {
  sessionId: string;
  visitorId: string;
  formId: string;
  formName: string;
  success: boolean;
  fields?: string[];
  // errors?: string[];
  completionTime?: number;
  page: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export interface IErrorEvent extends Document {
  sessionId: string;
  visitorId: string;
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  page?: string;
  userAction?: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export interface IPerformanceMetric extends Document {
  sessionId: string;
  visitorId: string;
  metricType: "web-vitals" | "navigation" | "resource" | "custom";
  metricName: string;
  value: number;
  page?: string;
  timestamp: Date;
  additionalData?: Record<string, any>;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
}

const PageViewSchema = new Schema<IPageView>({
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  page: { type: String, required: true },
  title: { type: String, required: true },
  referrer: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
  duration: { type: Number },
  scrollDepth: { type: Number },
  userAgent: { type: String },
  ip: { type: String },
  country: { type: String },
  region: { type: String },
  city: { type: String },
  timezone: { type: String },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  device: { type: String },
  browser: { type: String },
  browserVersion: { type: String },
  os: { type: String },
  osVersion: { type: String },
  isMobile: { type: Boolean },
  isTablet: { type: Boolean },
  isDesktop: { type: Boolean },
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String },
  utmTerm: { type: String },
  utmContent: { type: String },
});

const VisitorSessionSchema = new Schema<IVisitorSession>({
  sessionId: { type: String, required: true, unique: true, index: true },
  visitorId: { type: String, required: true, index: true },
  deviceFingerprint: { type: String, required: true, index: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  device: {
    type: { type: String, required: true },
    browser: { type: String, required: true },
    browserVersion: String,
    os: { type: String, required: true },
    osVersion: String,
    isMobile: { type: Boolean, default: false },
    isTablet: { type: Boolean, default: false },
    isDesktop: { type: Boolean, default: true },
  },
  screen: {
    width: Number,
    height: Number,
    colorDepth: Number,
  },
  language: { type: String, required: true },
  timezone: { type: String, required: true },
  firstVisit: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  pageViews: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
  isReturningVisitor: { type: Boolean, default: false },
  source: String,
  medium: String,
  campaign: String,
  exitPage: String,
  bounced: { type: Boolean, default: false },
});

const EventSchema = new Schema<IEvent>({
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  eventType: { type: String, required: true, index: true },
  eventCategory: { type: String, required: true },
  eventAction: { type: String, required: true },
  eventLabel: String,
  eventValue: Number,
  page: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: { type: Schema.Types.Mixed },
  userAgent: String,
  ip: String,
  country: String,
  region: String,
  city: String,
  device: String,
  browser: String,
  os: String,
});

const FormSubmissionSchema = new Schema<IFormSubmission>({
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  formId: { type: String, required: true },
  formName: { type: String, required: true },
  success: { type: Boolean, required: true },
  fields: [String],
  // errors: [String],
  completionTime: Number,
  page: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  userAgent: String,
  ip: String,
  country: String,
  region: String,
  city: String,
  device: String,
  browser: String,
  os: String,
});

const ErrorEventSchema = new Schema<IErrorEvent>({
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  errorType: { type: String, required: true },
  errorMessage: { type: String, required: true },
  errorStack: String,
  page: String,
  userAction: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  timestamp: { type: Date, default: Date.now, index: true },
  userAgent: String,
  ip: String,
  country: String,
  region: String,
  city: String,
  device: String,
  browser: String,
  os: String,
});

const PerformanceMetricSchema = new Schema<IPerformanceMetric>({
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  metricType: {
    type: String,
    enum: ["web-vitals", "navigation", "resource", "custom"],
    required: true,
  },
  metricName: { type: String, required: true },
  value: { type: Number, required: true },
  page: String,
  timestamp: { type: Date, default: Date.now, index: true },
  additionalData: { type: Schema.Types.Mixed },
  userAgent: String,
  device: String,
  browser: String,
  os: String,
});

// Add indexes for better query performance
PageViewSchema.index({ timestamp: -1 });
PageViewSchema.index({ visitorId: 1, timestamp: -1 });
PageViewSchema.index({ sessionId: 1, timestamp: -1 });
VisitorSessionSchema.index({ lastActivity: -1 });
VisitorSessionSchema.index({ firstVisit: -1 });
EventSchema.index({ timestamp: -1 });
EventSchema.index({ eventType: 1, timestamp: -1 });
EventSchema.index({ visitorId: 1, timestamp: -1 });
FormSubmissionSchema.index({ timestamp: -1 });
FormSubmissionSchema.index({ visitorId: 1, timestamp: -1 });
ErrorEventSchema.index({ timestamp: -1 });
ErrorEventSchema.index({ visitorId: 1, timestamp: -1 });
PerformanceMetricSchema.index({ timestamp: -1 });
PerformanceMetricSchema.index({ visitorId: 1, timestamp: -1 });

export const PageView =
  mongoose.models.PageView ||
  mongoose.model<IPageView>("PageView", PageViewSchema);
export const VisitorSession =
  mongoose.models.VisitorSession ||
  mongoose.model<IVisitorSession>("VisitorSession", VisitorSessionSchema);
export const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export const FormSubmission =
  mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema);
export const ErrorEvent =
  mongoose.models.ErrorEvent ||
  mongoose.model<IErrorEvent>("ErrorEvent", ErrorEventSchema);
export const PerformanceMetric =
  mongoose.models.PerformanceMetric ||
  mongoose.model<IPerformanceMetric>(
    "PerformanceMetric",
    PerformanceMetricSchema
  );
