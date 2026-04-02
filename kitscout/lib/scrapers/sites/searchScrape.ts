import axios from "axios";
import { redis } from "@/lib/redis/redis";
import { KitResult } from "@/types/kit";
import { scrapeFuwa } from "./fuwa";
import { scrapePanda } from "./panda";
import { scrapePlanet } from "./gundamPlanet";
import { getRate } from "@/utils/currency";

function normalizeQuery(query: string){
    return query
     .toLowerCase()
     .trim()
     .replace(/\s+/g, " ");
}

export async function scrapeSearch(
  query: string
): Promise<(KitResult & { priceCAD: number })[]> {

  const cacheKey = `search:${normalizeQuery(query)}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("REDIS CACHE HIT: ", query);
    return JSON.parse(cached);
  }

  console.log("REDIS CACHE MISS: ",query);

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
    priceCAD: Number(
      (item.price * (rates[item.currency] ?? 1)).toFixed(2)
    )
  }));

  normalized.sort((a, b) => a.priceCAD - b.priceCAD);

  await redis.set(
    cacheKey,
    JSON.stringify(normalized),
    "EX",
    3600
  );

  return normalized;
}