import { scrapeFuwa } from "@/lib/scrapers/sites/fuwa";
import { scrapePanda } from "@/lib/scrapers/sites/panda";

export async function GET() {
  try {
    const results = await scrapePanda();

    return Response.json({ results });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}