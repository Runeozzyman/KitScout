import { scrapeFuwa } from "@/lib/scrapers/sites/fuwa";

export async function GET() {
  try {
    const results = await scrapeFuwa();

    return Response.json({ results });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}