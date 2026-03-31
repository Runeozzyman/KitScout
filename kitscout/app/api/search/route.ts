import { scrapeFuwa } from "@/lib/scrapers/sites/fuwa";
import { scrapePanda } from "@/lib/scrapers/sites/panda";
import { scrapeSearch } from "@/lib/scrapers/sites/searchScrape";

const testQuery = `Gundam Epyon`;

export async function GET() {
  try {
    const results = await scrapeSearch(testQuery);

    return Response.json({ results });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}