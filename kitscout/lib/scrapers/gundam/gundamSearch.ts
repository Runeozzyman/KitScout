import { redis } from "@/lib/redis/redis";
import { KitResult } from "@/types/kit";
import { KitResultWithCAD } from "@/types/kitWithCAD";

import { scrapeFuwa } from "./fuwa";
import { scrapePanda } from "./panda";
import { scrapePlanet } from "./gundamPlanet";
import { scrapeTorchlight } from "./torchlight";

import { getRate } from "@/utils/currency";
import { fuzzySearch } from "@/utils/fuzzySearch";

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export async function gundamSearch(
  query: string,
  min?: number,
  max?: number,
  sort?: string
): Promise<KitResultWithCAD[]> {

  console.log("SEARCHING GUNPLA");

  const cacheKey = `search:${normalizeQuery(query)}:${min || ""}:${max || ""}:${sort || ""}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("REDIS CACHE HIT:", query);
    return JSON.parse(cached) as KitResultWithCAD[];
  }

  console.log("REDIS CACHE MISS:", query);

  //scraping
  const rawResults = await Promise.allSettled([
    scrapeFuwa(query),
    scrapePlanet(query),
    scrapePanda(query),
    scrapeTorchlight(query),
  ]);

  //flatten results
  const merged: KitResult[] = rawResults
    .filter(
      (r): r is PromiseFulfilledResult<KitResult[]> =>
        r.status === "fulfilled"
    )
    .flatMap((r) => r.value);

  //fuzzy search
  const ranked = fuzzySearch(merged, query);

  //convert currencies
  const currencies = [...new Set(ranked.map((item) => item.currency))];

  const rateEntries = await Promise.all(
    currencies.map(async (cur) => [cur, await getRate(cur)])
  );

  const rates = Object.fromEntries(rateEntries) as Record<string, number>;

  //normalize all results to include CAD
  const normalized: KitResultWithCAD[] = ranked.map((item) => ({
    ...item,
    priceCAD: Number(
      (item.price * (rates[item.currency] ?? 1)).toFixed(2)
    ),
  }));

  //optional filters
  let filtered = normalized;

  if (min !== undefined) {
    filtered = filtered.filter((item) => item.priceCAD >= min);
  }

  if (max !== undefined) {
    filtered = filtered.filter((item) => item.priceCAD <= max);
  }

  if (sort === "asc") {
    filtered.sort((a, b) => a.priceCAD - b.priceCAD);
  } else if (sort === "desc") {
    filtered.sort((a, b) => b.priceCAD - a.priceCAD);
  }

  await redis.set(cacheKey, JSON.stringify(filtered), "EX", 3600);

  return filtered;
}