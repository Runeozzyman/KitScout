import axios from "axios";
//import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";
import { scrapeFuwa } from "./fuwa";
import { scrapePanda } from "./panda";

export async function scrapeSearch(query: string): Promise<KitResult[]> {
    
    const results = await Promise.all([
        scrapeFuwa(query),
        scrapePanda(query)
    ]);
    
    const merged = results.flat();
    
    return merged;
}