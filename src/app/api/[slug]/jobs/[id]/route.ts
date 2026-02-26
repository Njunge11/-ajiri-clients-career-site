import { NextRequest, NextResponse } from "next/server";
import { fetchJob } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  const data = await fetchJob(slug, id);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}
