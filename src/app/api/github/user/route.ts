import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "no_token" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.github.com/users/Mxpea", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `github_${res.status}` }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
}
