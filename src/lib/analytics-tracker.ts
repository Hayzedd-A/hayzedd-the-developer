interface AnalyticsConfig {
  apiEndpoint?: string;
  trackPageViews?: boolean;
  trackEvents?: boolean;
  trackClicks?: boolean;
  trackScrolling?: boolean;
  trackFormSubmissions?: boolean;
  debug?: boolean;
}

interface SessionData {
  sessionId: string;
  visitorId: string;
  isReturningVisitor: boolean;
}

class AnalyticsTracker {
  private config: AnalyticsConfig;
  private sessionData: SessionData | null = null;
  private currentPage: string = "";
  private pageStartTime: number = 0;
  private isInitialized: boolean = false;
  private eventQueue: any[] = [];

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      apiEndpoint: "/api/analytics",
      trackPageViews: true,
      trackEvents: true,
      trackClicks: true,
      trackScrolling: true,
      trackFormSubmissions: true,
      debug: false,
      ...config,
    };
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize session
      await this.initializeSession();

      // Set up automatic tracking
      if (this.config.trackPageViews) {
        this.trackPageView();
      }

      if (this.config.trackClicks) {
        this.setupClickTracking();
      }

      if (this.config.trackScrolling) {
        this.setupScrollTracking();
      }

      if (this.config.trackFormSubmissions) {
        this.setupFormTracking();
      }

      // Track page visibility changes
      this.setupVisibilityTracking();

      // Process queued events
      this.processEventQueue();

      this.isInitialized = true;
      this.log("Analytics tracker initialized");
    } catch (error) {
      console.error("Failed to initialize analytics tracker:", error);
    }
  }

  private async initializeSession(): Promise<void> {
    try {
      const sessionData = {
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
        },
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer,
        currentUrl: window.location.href,
      };

      const response = await fetch(`${this.config.apiEndpoint}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        this.sessionData = await response.json();
        this.log("Session initialized:", this.sessionData);
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
    }
  }

  trackPageView(page?: string, title?: string): void {
    if (!this.sessionData) {
      this.eventQueue.push({ type: "pageview", page, title });
      return;
    }

    // Record duration of previous page
    if (this.currentPage && this.pageStartTime) {
      const duration = Date.now() - this.pageStartTime;
      this.sendPageView(this.currentPage, document.title, undefined, duration);
    }

    // Start tracking new page
    this.currentPage = page || window.location.pathname;
    this.pageStartTime = Date.now();

    this.sendPageView(this.currentPage, title || document.title);
  }

  private async sendPageView(
    page: string,
    title: string,
    referrer?: string,
    duration?: number
  ): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/pageview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.sessionData?.sessionId,
          visitorId: this.sessionData?.visitorId,
          page,
          title,
          referrer: referrer || document.referrer,
          duration,
        }),
      });

      this.log("Page view tracked:", { page, title, duration });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }

  trackEvent(
    eventType: string,
    eventCategory: string,
    eventAction: string,
    eventLabel?: string,
    eventValue?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.sessionData) {
      this.eventQueue.push({
        type: "event",
        eventType,
        eventCategory,
        eventAction,
        eventLabel,
        eventValue,
        metadata,
      });
      return;
    }

    this.sendEvent(
      eventType,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      metadata
    );
  }

  private async sendEvent(
    eventType: string,
    eventCategory: string,
    eventAction: string,
    eventLabel?: string,
    eventValue?: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.sessionData?.sessionId,
          visitorId: this.sessionData?.visitorId,
          eventType,
          eventCategory,
          eventAction,
          eventLabel,
          eventValue,
          page: this.currentPage || window.location.pathname,
          metadata,
        }),
      });

      this.log("Event tracked:", {
        eventType,
        eventCategory,
        eventAction,
        eventLabel,
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }

  private setupClickTracking(): void {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();

      let eventLabel =
        target.textContent?.trim() || target.getAttribute("aria-label") || "";
      let eventCategory = "click";
      const metadata: Record<string, any> = {
        tagName,
        className: target.className,
        id: target.id,
      };

      // Special handling for different elements
      if (tagName === "a") {
        eventCategory = "link";
        eventLabel = target.getAttribute("href") || eventLabel;
        metadata.href = target.getAttribute("href");
        metadata.external =
          target.getAttribute("href")?.startsWith("http") &&
          !target.getAttribute("href")?.includes(window.location.hostname);
      } else if (tagName === "button") {
        eventCategory = "button";
        metadata.type = target.getAttribute("type");
      } else if (target.closest("form")) {
        eventCategory = "form-element";
        metadata.formId = target.closest("form")?.id;
      }

      this.trackEvent(
        "interaction",
        eventCategory,
        "click",
        eventLabel,
        undefined,
        metadata
      );
    });
  }

  private setupScrollTracking(): void {
    let maxScroll = 0;
    let scrollTimeout: NodeJS.Timeout;

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Track scroll milestones
        const milestones = [25, 50, 75, 90, 100];
        const milestone = milestones.find(
          (m) => scrollPercent >= m && maxScroll - scrollPercent < m
        );

        if (milestone) {
          this.trackEvent(
            "engagement",
            "scroll",
            "milestone",
            `${milestone}%`,
            milestone
          );
        }
      }
    };

    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScroll, 250);
    });
  }

  private setupFormTracking(): void {
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      const formId = form.id || form.className || "unnamed-form";

      this.trackEvent("interaction", "form", "submit", formId, undefined, {
        formId: form.id,
        formClass: form.className,
        formMethod: form.method,
        formAction: form.action,
      });
    });

    // Track form field interactions
    document.addEventListener("focus", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        const form = target.closest("form");
        this.trackEvent(
          "interaction",
          "form-field",
          "focus",
          target.getAttribute("name") || target.id,
          undefined,
          {
            fieldType:
              target.getAttribute("type") || target.tagName.toLowerCase(),
            formId: form?.id,
            fieldName: target.getAttribute("name"),
          }
        );
      }
    });
  }

  private setupVisibilityTracking(): void {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Page became hidden - track current page duration
        if (this.currentPage && this.pageStartTime) {
          const duration = Date.now() - this.pageStartTime;
          this.sendPageView(
            this.currentPage,
            document.title,
            undefined,
            duration
          );
        }
        this.trackEvent("engagement", "page", "hidden");
      } else {
        // Page became visible
        this.pageStartTime = Date.now();
        this.trackEvent("engagement", "page", "visible");
      }
    });

    // Track page unload
    window.addEventListener("beforeunload", () => {
      if (this.currentPage && this.pageStartTime) {
        const duration = Date.now() - this.pageStartTime;
        // Use sendBeacon for reliable delivery during page unload
        navigator.sendBeacon(
          `${this.config.apiEndpoint}/pageview`,
          JSON.stringify({
            sessionId: this.sessionData?.sessionId,
            visitorId: this.sessionData?.visitorId,
            page: this.currentPage,
            title: document.title || "Adebayo Azeez - Full Stack Developer",
            duration,
          })
        );
      }
    });
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();

      if (event.type === "pageview") {
        this.trackPageView(event.page, event.title);
      } else if (event.type === "event") {
        this.trackEvent(
          event.eventType,
          event.eventCategory,
          event.eventAction,
          event.eventLabel,
          event.eventValue,
          event.metadata
        );
      }
    }
  }

  // Public methods for manual tracking
  trackDownload(filename: string, url: string): void {
    this.trackEvent("interaction", "download", "click", filename, undefined, {
      url,
    });
  }

  trackOutboundLink(url: string, label?: string): void {
    this.trackEvent(
      "interaction",
      "outbound-link",
      "click",
      label || url,
      undefined,
      { url }
    );
  }

  trackSearch(query: string, results?: number): void {
    this.trackEvent("interaction", "search", "query", query, results);
  }

  trackVideoPlay(videoTitle: string, duration?: number): void {
    this.trackEvent("media", "video", "play", videoTitle, duration);
  }

  trackVideoComplete(videoTitle: string, duration?: number): void {
    this.trackEvent("media", "video", "complete", videoTitle, duration);
  }

  trackError(errorMessage: string, errorType?: string): void {
    this.trackEvent("error", errorType || "javascript", "error", errorMessage);
  }

  trackTiming(
    category: string,
    variable: string,
    time: number,
    label?: string
  ): void {
    this.trackEvent("timing", category, variable, label, time);
  }

  // Utility methods
  getSessionData(): SessionData | null {
    return this.sessionData;
  }

  isReturningVisitor(): boolean {
    return this.sessionData?.isReturningVisitor || false;
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log("[Analytics]", ...args);
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsTracker({
  debug: process.env.NODE_ENV === "development",
});

// Auto-initialize when DOM is ready
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => analytics.init());
  } else {
    analytics.init();
  }
}

export default AnalyticsTracker;

