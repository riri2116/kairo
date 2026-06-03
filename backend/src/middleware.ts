import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { auth } from "@/auth";

const PUBLIC_ROUTES = new Set([
  "/api/health",
  "/api/auth/register",
  "/api/auth/token",
]);

const PUBLIC_PREFIXES = [
  "/api/auth/",   // NextAuth internal routes
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function jwtSecret() {
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
}

async function hasBearerToken(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    return typeof payload.sub === "string" && payload.sub.length > 0;
  } catch {
    return false;
  }
}

export default auth(async (req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/")) return NextResponse.next();
  if (isPublic(pathname)) return NextResponse.next();

  // 1 — NextAuth session cookie
  const session = (req as { auth?: { user?: { id?: string } } }).auth;
  if (session?.user?.id) return NextResponse.next();

  // 2 — Bearer JWT
  if (await hasBearerToken(req)) return NextResponse.next();

  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
});

export const config = {
  matcher: ["/api/:path*"],
};
