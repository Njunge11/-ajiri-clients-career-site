import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;
const API_SECRET = process.env.API_SECRET!;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  const body = await req.json();

  try {
    const res = await fetch(
      `${API_URL}api/companies/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(id)}/upload-url`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to get upload URL" },
      { status: 500 },
    );
  }
}
