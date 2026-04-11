import axios from "axios";
import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";

export async function scrapePanda(query: string): Promise<KitResult[]> {
  const url = `https://pandahobby.ca/search?view=snize&q=${encodeURIComponent(query)}`;

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(html);
  const results: KitResult[] = [];

  $("li.snize-product").each((_, el) => {
    const container = $(el);

    // 🔗 Link
    const linkEl = container.find("a[href*='/products/']").first();
    const link = linkEl.attr("href");
    if (!link) return;

    const fullLink = link.startsWith("http")
      ? link
      : `https://pandahobby.ca${link}`;

    // 🏷️ Name
    const name = container
      .find(".snize-title")
      .first()
      .text()
      .trim();

    // 💰 Price
    const priceText = container
      .find(".snize-price")
      .first()
      .text()
      .trim();

    const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

    // 🖼️ Image
    const image =
      container.find("img").attr("src") ||
      container.find("img").attr("data-src") ||
      "";

    if (!name || !fullLink || isNaN(price)) return;

    results.push({
      name,
      price,
      currency: "CAD",
      link: fullLink,
      image,
      source: "Panda Hobby",
    });
  });

  // ✅ Deduplicate
  const uniqueResults = Array.from(
    new Map(results.map(item => [item.link, item])).values()
  );

  return uniqueResults;
}