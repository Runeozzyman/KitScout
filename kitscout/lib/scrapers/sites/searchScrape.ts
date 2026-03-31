import axios from "axios";
//import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";
import { scrapeFuwa } from "./fuwa";
import { scrapePanda } from "./panda";
import { scrapePlanet } from "./gundamPlanet";

export async function scrapeSearch(query: string): Promise<KitResult[]> {
    
    //compiled scraper function that scrapes each individual website
    const results = await Promise.all([
        scrapeFuwa(query),
        scrapePanda(query),
        scrapePlanet(query)
    ]);
    
    const merged = results.flat();
    
    return merged;
}