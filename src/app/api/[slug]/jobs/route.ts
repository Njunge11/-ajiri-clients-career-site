import { NextRequest, NextResponse } from "next/server";
import { fetchJobs } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const sp = req.nextUrl.searchParams;

  const data = await fetchJobs(slug, {
    search: sp.get("search") ?? undefined,
    department: sp.get("department") ?? undefined,
    workType: sp.get("workType") ?? undefined,
    location: sp.get("location") ?? undefined,
    page: sp.get("page") ? Number(sp.get("page")) : undefined,
  });

  return NextResponse.json(data);
}
