import crypto from "crypto";
import { Reader } from "@maxmind/geoip2-node";
import { UAParser } from "ua-parser-js";
import path from "path";

export interface DeviceInfo {
  type: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Initialize MaxMind reader (you'll need to download the GeoLite2 database)
// let geoReader: Reader | null = null;

// async function initializeGeoReader() {
//   if (!geoReader) {
//     try {
//       // You'll need to download GeoLite2-City.mmdb from MaxMind
//       const dbPath = path.join(process.cwd(), "data", "GeoLite2-City.mmdb");
//       console.log("+======================== mmdb path", dbPath)
//       geoReader = await Reader.open(dbPath);
//     } catch (error) {
//       console.warn("GeoIP database not available:", error);
//     }
//   }
//   return geoReader;
// }

export function generateDeviceFingerprint(
  userAgent: string,
  ipAddress: string,
  acceptLanguage?: string,
  acceptEncoding?: string
): string {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const fingerprintData = {
    browser: result.browser.name || "unknown",
    browserVersion: result.browser.version || "unknown",
    os: result.os.name || "unknown",
    osVersion: result.os.version || "unknown",
    device: result.device.type || "desktop",
    ipAddress: ipAddress.split(".").slice(0, 3).join("."), // Partial IP for privacy
    language: acceptLanguage || "unknown",
    encoding: acceptEncoding || "unknown",
  };

  const fingerprintString = JSON.stringify(fingerprintData);
  return crypto.createHash("sha256").update(fingerprintString).digest("hex");
}

export function parseUserAgent(userAgent: string): DeviceInfo {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || "desktop";

  return {
    type: deviceType,
    browser: result.browser.name || "Unknown",
    browserVersion: result.browser.version || "Unknown",
    os: result.os.name || "Unknown",
    osVersion: result.os.version || "Unknown",
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: !deviceType || deviceType === "desktop",
  };
}

export async function getLocationFromIP(
  ipAddress: string
): Promise<LocationInfo> {
  // Skip location detection for local/private IPs
  if (isPrivateIP(ipAddress)) {
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
    };
  }

  try {
    return await getLocationFromAPI(ipAddress);
    // const reader = await initializeGeoReader();
    // if (!reader) {
    // }

    // const response = reader.city(ipAddress);

    // return {
    //   country: response.country?.names?.en || "Unknown",
    //   region: response.subdivisions?.[0]?.names?.en || "Unknown",
    //   city: response.city?.names?.en || "Unknown",
    //   timezone: response.location?.timeZone || undefined,
    //   coordinates:
    //     response.location?.latitude && response.location?.longitude
    //       ? {
    //           lat: response.location.latitude,
    //           lng: response.location.longitude,
    //         }
    //       : undefined,
    // };
  } catch (error) {
    console.warn("MaxMind GeoIP lookup failed, falling back to API:", error);
    return await getLocationFromAPI(ipAddress);
  }
}

// Fallback to API-based geolocation
async function getLocationFromAPI(ipAddress: string): Promise<LocationInfo> {
  try {
    // Option 1: ipapi.co (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      headers: {
        "User-Agent": "Portfolio Analytics/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.reason || "API Error");
    }

    return {
      country: data.country_name || "Unknown",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
      timezone: data.timezone || undefined,
      coordinates:
        data.latitude && data.longitude
          ? {
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude),
            }
          : undefined,
    };
  } catch (error) {
    console.warn("API geolocation failed:", error);
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
    };
  }
}

export function isPrivateIP(ip: string): boolean {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/,
    /^localhost$/i,
  ];

  return privateRanges.some((range) => range.test(ip));
}

export function getRealIP(req: any): string {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.headers["cf-connecting-ip"] || // Cloudflare
    req.headers["x-client-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "127.0.0.1"
  );
}

export function parseUTMParameters(url: string) {
  try {
    const urlObj = new URL(url);
    return {
      source: urlObj.searchParams.get("utm_source"),
      medium: urlObj.searchParams.get("utm_medium"),
      campaign: urlObj.searchParams.get("utm_campaign"),
      term: urlObj.searchParams.get("utm_term"),
      content: urlObj.searchParams.get("utm_content"),
    };
  } catch (error) {
    return {
      source: null,
      medium: null,
      campaign: null,
      term: null,
      content: null,
    };
  }
}

export function generateVisitorId(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function generateSessionId(): string {
  return crypto.randomBytes(20).toString("hex");
}

// Additional utility functions
export function anonymizeIP(ip: string): string {
  if (ip.includes(":")) {
    // IPv6 - keep first 4 groups
    const parts = ip.split(":");
    return parts.slice(0, 4).join(":") + "::";
  } else {
    // IPv4 - keep first 3 octets
    const parts = ip.split(".");
    return parts.slice(0, 3).join(".") + ".0";
  }
}

export function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /facebook/i,
    /twitter/i,
    /linkedin/i,
    /whatsapp/i,
    /telegram/i,
    /googlebot/i,
    /bingbot/i,
    /slackbot/i,
    /discordbot/i,
  ];

  return botPatterns.some((pattern) => pattern.test(userAgent));
}
