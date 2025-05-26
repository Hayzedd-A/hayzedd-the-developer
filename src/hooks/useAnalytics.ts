import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics-tracker";

export const useAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view when pathname changes
    analytics.trackPageView(pathname);
  }, [pathname]);

  const trackEvent = useCallback(
    (
      eventType: string,
      eventCategory: string,
      eventAction: string,
      eventLabel?: string,
      eventValue?: number,
      metadata?: Record<string, any>
    ) => {
      analytics.trackEvent(
        eventType,
        eventCategory,
        eventAction,
        eventLabel,
        eventValue,
        metadata
      );
    },
    []
  );

  const trackClick = useCallback(
    (elementName: string, metadata?: Record<string, any>) => {
      analytics.trackEvent(
        "interaction",
        "click",
        "manual",
        elementName,
        undefined,
        metadata
      );
    },
    []
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean = true) => {
      analytics.trackEvent(
        "interaction",
        "form",
        success ? "submit-success" : "submit-error",
        formName
      );
    },
    []
  );

  const trackDownload = useCallback((filename: string, url: string) => {
    analytics.trackDownload(filename, url);
  }, []);

  const trackOutboundLink = useCallback((url: string, label?: string) => {
    analytics.trackOutboundLink(url, label);
  }, []);

  const trackSearch = useCallback((query: string, results?: number) => {
    analytics.trackSearch(query, results);
  }, []);

  const trackError = useCallback((errorMessage: string, errorType?: string) => {
    analytics.trackError(errorMessage, errorType);
  }, []);

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackOutboundLink,
    trackSearch,
    trackError,
    getSessionData: () => analytics.getSessionData(),
    isReturningVisitor: () => analytics.isReturningVisitor(),
  };
};
