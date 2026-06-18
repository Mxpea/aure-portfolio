import { NextResponse } from "next/server";
import { cachedFetch } from "@/lib/cache";

export async function GET() {
  try {
    const data = await cachedFetch(
      "https://api.github.com/users/Mxpea/repos?per_page=30&sort=updated&direction=desc",
      3600000 // 1 hour
    );
    return NextResponse.json(data);
  } catch (e) {
    console.error("GitHub repos error:", e);
    return NextResponse.json([], { status: 500 });
  }
}
