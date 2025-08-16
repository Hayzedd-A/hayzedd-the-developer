import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { VisitorSession } from '@/models/Analytics';
import {
  generateDeviceFingerprint,
  parseUserAgent,
  getLocationFromIP,
  getRealIP,
  parseUTMParameters,
  generateVisitorId,
  generateSessionId,
} from '@/lib/analytics-utils';
import { ipAddress as vercelIP, geolocation as vercelGeo } from '@vercel/functions';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { screen, language, timezone, referrer, currentUrl } = body;

    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const ipAddress = getRealIP(request);
    // console.log({ ipAddress });
    // console.log({ geo: vercelGeo(request), ip: vercelIP(request) });

    // Generate device fingerprint
    const deviceFingerprint = generateDeviceFingerprint(
      userAgent,
      ipAddress,
      acceptLanguage,
      acceptEncoding
    );

    // Check if visitor exists
    const existingSession = await VisitorSession.findOne({
      deviceFingerprint,
      lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, // 30 minutes
    }).sort({ lastActivity: -1 });

    let visitorId: string;
    let sessionId: string;
    let isReturningVisitor = false;
    const rawLocation = vercelGeo(request)
    const location = {
      ...rawLocation,
      coordinates: {
        lat: rawLocation?.latitude,
        lng: rawLocation?.longitude,
      },
    };
    if (existingSession) {
      console.log('its an existing visitor');
      // Update existing session
      visitorId = existingSession.visitorId;
      sessionId = existingSession.sessionId;
      isReturningVisitor = true;

      existingSession.location = location;
      existingSession.lastActivity = new Date();
      await existingSession.save();
      console.log(existingSession.location);
    } else {
      console.log('its a new visitor');
      // Check if this device has visited before (returning visitor)
      const previousVisitor = await VisitorSession.findOne({
        deviceFingerprint,
      });
      isReturningVisitor = !!previousVisitor;

      visitorId = previousVisitor?.visitorId || generateVisitorId();
      sessionId = generateSessionId();

      // Parse device info and location
      const deviceInfo = parseUserAgent(userAgent);
      const locationInfo = await getLocationFromIP(ipAddress);
      const utmParams = currentUrl ? parseUTMParameters(currentUrl) : {};
      console.log({ locationInfo });
      // Create new session
      const newSession = new VisitorSession({
        sessionId,
        visitorId,
        deviceFingerprint,
        ipAddress,
        userAgent,
        location,
        device: deviceInfo,
        screen,
        language: language || acceptLanguage?.split(',')[0] || 'en',
        timezone: timezone || 'UTC',
        isReturningVisitor,
        ...utmParams,
      });

      await newSession.save();
    }

    return NextResponse.json({
      success: true,
      sessionId,
      visitorId,
      isReturningVisitor,
    });
  } catch (error) {
    console.error('Analytics session error:', error);
    return NextResponse.json({ error: 'Failed to create/update session' }, { status: 500 });
  }
}
