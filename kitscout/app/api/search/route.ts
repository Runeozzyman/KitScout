import { gundamSearch } from "@/lib/scrapers/gundam/gundamSearch";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  const MAX_QUERY_LENGTH = 80;

  try {
    const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";

    if (!query) {
      return Response.json(
        { error: "Missing query" },
        { status: 400 }
      );
    }

    if (query.length > MAX_QUERY_LENGTH){
      return Response.json(
        {error: `Query must be ${MAX_QUERY_LENGTH} characters or fewer.`},
        {status: 400}
      );
    }

    const results = await gundamSearch(query);

    return Response.json(results);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}