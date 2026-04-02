import { scrapeFuwa } from "@/lib/scrapers/gundam/fuwa";
import { scrapePanda } from "@/lib/scrapers/gundam/panda";
import { gundamSearch } from "@/lib/scrapers/gundam/gundamSearch";
import { scrapeModels } from "@/lib/scrapers/models/modelSearch";
import { useSearchParams } from "react-router-dom";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    
    const query = req.nextUrl.searchParams.get("q");
    const type = req.nextUrl.searchParams.get("type");
    
    if (!query) {
      return Response.json(
        { error: "Missing query" },
        { status: 400 }
      );
    }

    let results;

    if(type==="Gundams"){
      results = await gundamSearch(query);
    }
    else if(type==="Models"){
      results = await scrapeModels(query);
    }
    else{
      //Warhammer scraper
      return;
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