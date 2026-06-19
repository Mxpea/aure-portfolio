import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return NextResponse.json(
      { error: "no_token", message: "GITHUB_TOKEN not set" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      "https://api.github.com/users/Mxpea/repos?per_page=30&sort=updated&direction=desc",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `github_${res.status}`, message: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "fetch_failed", message: String(e) },
      { status: 500 }
    );
  }
}
