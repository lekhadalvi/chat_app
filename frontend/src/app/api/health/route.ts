import { NextResponse } from "next/server";

// Dedicated Health Check API for Cron Jobs (Not used anywhere else in the app)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "frontend-gateway",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
