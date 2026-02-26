import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;
const API_SECRET = process.env.API_SECRET!;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  try {
    const res = await fetch(
      `${API_URL}api/companies/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(id)}/application-form`,
      {
        headers: { Authorization: `Bearer ${API_SECRET}` },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
