import mongoose, { Schema, Document } from "mongoose";

export interface IPageView extends Document {
  sessionId: string;
  visitorId: string;
  page: string;
  title: string;
  referrer?: string;
  timestamp: Date;
  duration?: number;
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
}

const PageViewSchema = new Schema<IPageView>({
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  page: { type: String, required: true },
  title: { type: String, required: true },
  referrer: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
  duration: { type: Number },
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
});

// Add indexes for better query performance
PageViewSchema.index({ timestamp: -1 });
PageViewSchema.index({ visitorId: 1, timestamp: -1 });
VisitorSessionSchema.index({ lastActivity: -1 });
VisitorSessionSchema.index({ firstVisit: -1 });
EventSchema.index({ timestamp: -1 });
EventSchema.index({ eventType: 1, timestamp: -1 });

export const PageView =
  mongoose.models.PageView ||
  mongoose.model<IPageView>("PageView", PageViewSchema);
export const VisitorSession =
  mongoose.models.VisitorSession ||
  mongoose.model<IVisitorSession>("VisitorSession", VisitorSessionSchema);
export const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
