import { NextResponse } from "next/server";
import { fetchTopLanguages } from "@/lib/github-server";

export async function GET() {
  try {
    const data = await fetchTopLanguages();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "fetch_failed", message: String(e) },
      { status: 500 }
    );
  }
}
