import { NextResponse } from "next/server";
import { fetchContributions } from "@/lib/github-server";

export async function GET() {
  try {
    const data = await fetchContributions();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "fetch_failed", message: String(e) },
      { status: 500 }
    );
  }
}
