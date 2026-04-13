import { gundamSearch } from "@/lib/scrapers/gundam/gundamSearch";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    const minParam = req.nextUrl.searchParams.get("min");
    const maxParam = req.nextUrl.searchParams.get("max");
    const sort = req.nextUrl.searchParams.get("sort") || undefined;

    const min = minParam ? Number(minParam) : undefined;
    const max = maxParam ? Number(maxParam) : undefined;

    if (!query) {
      return Response.json(
        { error: "Missing query" },
        { status: 400 }
      );
    }

    const results = await gundamSearch(query, min, max, sort);
    
    return Response.json(results);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}