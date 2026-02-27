import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;
const API_SECRET = process.env.API_SECRET!;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  const body = await req.formData();

  try {
    const res = await fetch(
      `${API_URL}api/companies/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(id)}/apply`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${API_SECRET}` },
        body,
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
