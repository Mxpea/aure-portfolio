import { NextResponse } from "next/server";
import { cachedFetch } from "@/lib/cache";

export async function GET() {
  try {
    const data = await cachedFetch(
      "https://api.github.com/users/Mxpea",
      3600000
    );
    return NextResponse.json(data);
  } catch (e) {
    console.error("GitHub user error:", e);
    return NextResponse.json(null, { status: 500 });
  }
}
