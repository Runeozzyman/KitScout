import axios from "axios";
//import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";
import { scrapeFuwa } from "./fuwa";
import { scrapePanda } from "./panda";
import { scrapePlanet } from "./gundamPlanet";
import { getRate } from "@/utils/currency";

export async function scrapeSearch(query: string): Promise<(KitResult & { priceCAD: number })[]> {
    
    const results = await Promise.allSettled([
        scrapeFuwa(query),
        scrapePanda(query),
        scrapePlanet(query)
    ]);
    
    const merged = results
        .filter((r): r is PromiseFulfilledResult<KitResult[]> => r.status === "fulfilled")
        .flatMap(r => r.value);

    const currencies = [...new Set(merged.map(item => item.currency))];

    const rateEntries = await Promise.all(
        currencies.map(async (cur) => [cur, await getRate(cur)])
    );

    const rates = Object.fromEntries(rateEntries) as Record<string, number>;

    const normalized = merged.map(item => ({
        ...item,
        priceCAD: Number((item.price * (rates[item.currency] ?? 1)).toFixed(2))
    }));

    normalized.sort((a, b) => a.priceCAD - b.priceCAD);

    return normalized;
}