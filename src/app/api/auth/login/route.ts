import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    // 🔐 1. Verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(token);

    console.log(decoded)

    // 👤 user info (можешь использовать дальше)
    const uid = decoded.uid;
    const role = (decoded as any).role;

    console.log(role)

    if (role != 'admin') return NextResponse.json({ error: 'Access Denied' }, {status: 401})

    // 🍪 2. Create session cookie (5 days)
    const managementSessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: 60 * 60 * 24 * 5 * 1000,
    });

    const cookieStore = await cookies()

    // 🍪 3. Set HttpOnly cookie
    cookieStore.set("managementSessionCookie", managementSessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      ok: true,
      uid,
      role,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}