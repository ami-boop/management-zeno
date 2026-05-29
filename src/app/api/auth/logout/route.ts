import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('sessionCookie')

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Service Error" },
      { status: 500 }
    );
  }
}