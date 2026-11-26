import { redis } from "@/lib/redis/redis";
import { KitResult } from "@/types/kit";
import { KitResultWithCAD } from "@/types/kitWithCAD";

import { scrapeFuwa } from "./fuwa";
import { scrapePanda } from "./panda";
import { scrapePlanet } from "./gundamPlanet";
import { scrapeTorchlight } from "./torchlight";

import { getRate } from "@/utils/currency";
import { fuzzySearch } from "@/utils/fuzzySearch";
import { extractGrade } from "@/utils/extractGrade";

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export async function gundamSearch(
  query: string
): Promise<KitResultWithCAD[]> {
  console.log("SEARCHING GUNPLA");

  const cacheKey = `search:${normalizeQuery(query)}`;

  const cached = await redis.get<KitResultWithCAD[]>(cacheKey);

  if (cached) {
    return cached;
  }

  console.log("REDIS CACHE MISS:", query);

  // scrape
  const rawResults = await Promise.allSettled([
    scrapeFuwa(query),
    scrapePlanet(query),
    scrapePanda(query),
    scrapeTorchlight(query),
  ]);

  // flatten + normalize grades
  const merged: KitResult[] = rawResults
    .filter(
      (r): r is PromiseFulfilledResult<KitResult[]> =>
        r.status === "fulfilled"
    )
    .flatMap((r) =>
      r.value.map((item) => ({
        ...item,
        grade: item.grade ?? extractGrade(item.name),
      }))
    );

  // fuzzy search
  const ranked = fuzzySearch(merged, query);

  // convert currencies
  const currencies = [...new Set(ranked.map((item) => item.currency))];

  const rateEntries = await Promise.all(
    currencies.map(async (cur) => [cur, await getRate(cur)])
  );

  const rates = Object.fromEntries(rateEntries) as Record<string, number>;

  const normalized: KitResultWithCAD[] = ranked.map((item) => ({
    ...item,
    priceCAD: Number(
      (item.price * (rates[item.currency] ?? 1)).toFixed(2)
    ),
  }));

  await redis.set(cacheKey, normalized, { ex: 900 });

  return normalized;
}