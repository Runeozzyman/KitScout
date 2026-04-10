import { gundamSearch } from "@/lib/scrapers/gundam/gundamSearch";
import { scrapeModels } from "@/lib/scrapers/models/modelSearch";
import { scrapeWarhammer } from "@/lib/scrapers/warhammer/warhammerSearch";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    const type = req.nextUrl.searchParams.get("type");

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

    let results;

    if (type === "Gunpla") {
        results = await gundamSearch(query, min, max, sort);
    } else if (type === "Models") {
        results = await scrapeModels(query);
    } else {
        results = await scrapeWarhammer(query, min, max, sort)
    }

    return Response.json(results);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}