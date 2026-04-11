import axios from "axios";
import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";

export async function scrapePlanet(query: string): Promise<KitResult[]> {
  const url = `https://www.gundamplanet.com/search?q=${encodeURIComponent(query)}`;

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(html);
  const results: KitResult[] = [];

  $("li.grid__item").each((_, el) => {
    const container = $(el);

    const linkEl = container.find("a[href*='/products/']").first();
    const link = linkEl.attr("href");
    const name = container
        .find("a.card-title-link")
        .first()
        .text()
        .trim();

    if (!link || !name) return;

    const fullLink = `https://www.gundamplanet.com${link}`;

    const image =
      container.find("img").attr("src") ||
      container.find("img").attr("data-src") ||
      "";

    const priceText =
      container.find(".price-item--sale").first().text().trim() ||
      container.find(".price-item--regular").first().text().trim();

    const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

    if (isNaN(price)) return;

    results.push({
      name,
      price,
      currency: "USD",
      link: fullLink,
      image,
      source: "Gundam Planet",
    });
  });

  const uniqueResults = Array.from(
    new Map(results.map(item => [item.link, item])).values()
  );

  return uniqueResults;
}