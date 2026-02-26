import { NextRequest, NextResponse } from "next/server";
import { fetchFacets } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const data = await fetchFacets(slug);
  return NextResponse.json(data);
}
