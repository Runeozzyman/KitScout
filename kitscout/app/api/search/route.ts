import { scrapeFuwa } from "@/lib/scrapers/gundam/fuwa";
import { scrapePanda } from "@/lib/scrapers/gundam/panda";
import { scrapeSearch } from "@/lib/scrapers/gundam/gundamSearch";
import { useSearchParams } from "react-router-dom";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    

    if (!query) {
      return Response.json(
        { error: "Missing query" },
        { status: 400 }
      );
    }

    const results = await scrapeSearch(query);

    return Response.json(results);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}