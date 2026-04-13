import axios from "axios";
import { redis } from "@/lib/redis/redis";
import { KitResult } from "@/types/kit";
import { KitResultWithCAD } from "@/types/kitWithCAD";

import { scrapeFuwa } from "./fuwa";
import { scrapePanda } from "./panda";
import { scrapePlanet } from "./gundamPlanet";
import { scrapeTorchlight } from "./torchlight";

import { getRate } from "@/utils/currency";

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
): Promise<(KitResultWithCAD)[]> {

  console.log("SEARCHING GUNPLA");

  const cacheKey = `search:${normalizeQuery(query)}:${min || ""}:${max || ""}:${sort || ""}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("REDIS CACHE HIT: ", query);
    return JSON.parse(cached) as KitResultWithCAD[];
  }

  console.log("REDIS CACHE MISS: ", query);

  const results = await Promise.allSettled([
    scrapeFuwa(query),
    scrapePlanet(query),
    scrapePanda(query),
    scrapeTorchlight(query),
  ]);

  const merged = results
    .filter((r): r is PromiseFulfilledResult<KitResult[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const currencies = [...new Set(merged.map((item) => item.currency))];

  const rateEntries = await Promise.all(
    currencies.map(async (cur) => [cur, await getRate(cur)])
  );

  const rates = Object.fromEntries(rateEntries) as Record<string, number>;

  const normalized: KitResultWithCAD[] = merged.map((item) => ({
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