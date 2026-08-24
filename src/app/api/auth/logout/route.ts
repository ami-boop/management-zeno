import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('sessionCookie')

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Service Error" },
      { status: 500 }
    );
  }
}