import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

async function handleProxy(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const { path } = await paramsPromise;
  const pathStr = path.join("/");
  
  // Route dynamically to the correct backend microservice URL from environment variables
  const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:5000";
  const chatServiceUrl = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || "http://localhost:5002";
  
  const baseServiceUrl = path[0] === "chat" ? chatServiceUrl : userServiceUrl;
  const targetUrl = `${baseServiceUrl}/api/v1/${pathStr}${req.nextUrl.search}`;
  
  const headers = new Headers();
  req.headers.forEach((val, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, val);
    }
  });

  const body = req.method !== "GET" && req.method !== "HEAD" 
    ? await req.text() 
    : undefined;

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const resBody = await backendRes.text();
    
    const clientHeaders = new Headers();
    backendRes.headers.forEach((val, key) => {
      // Avoid forwarding content-encoding (like gzip) to let Next.js handle compression
      if (key.toLowerCase() !== "content-encoding") {
        clientHeaders.set(key, val);
      }
    });

    return new NextResponse(resBody, {
      status: backendRes.status,
      headers: clientHeaders,
    });
  } catch (err) {
    console.error("Proxy connection error to URL:", targetUrl, err);
    return NextResponse.json({ message: "Proxy connection error to backend" }, { status: 502 });
  }
}
