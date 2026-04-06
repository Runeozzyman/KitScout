import { scrapeTorchlight } from "./torchlight";
import { scrapeBRG } from "./battleReadyGames";
import { redis } from "@/lib/redis/redis";
import { KitResult } from "@/types/kit";
import { getRate } from "@/utils/currency";

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export async function scrapeWarhammer(
  query: string,
  min?: number,
  max?: number,
  sort?: string
): Promise<(KitResult & { priceCAD: number })[]> {

  const cacheKey = `search:${normalizeQuery(query)}:${min || ""}:${max || ""}:${sort || ""}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("REDIS CACHE HIT: ", query);
    return JSON.parse(cached);
  }

  console.log("REDIS CACHE MISS: ", query);

  const results = await Promise.allSettled([
    scrapeTorchlight(query),
    scrapeBRG(query)
  ]);

  const merged = results
    .filter((r): r is PromiseFulfilledResult<KitResult[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const currencies = [...new Set(merged.map((item) => item.currency))];

  const rateEntries = await Promise.all(
    currencies.map(async (cur) => [cur, await getRate(cur)])
  );

  const rates = Object.fromEntries(rateEntries) as Record<string, number>;

  const normalized = merged.map((item) => ({
    ...item,
    priceCAD: Number(
      (item.price * (rates[item.currency] ?? 1)).toFixed(2)
    ),
  }));

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
  } else {
    filtered.sort((a, b) => a.priceCAD - b.priceCAD);
  }

  await redis.set(
    cacheKey,
    JSON.stringify(filtered),
    "EX",
    3600
  );

  return filtered;
}