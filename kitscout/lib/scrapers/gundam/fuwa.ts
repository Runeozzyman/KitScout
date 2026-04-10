import axios from "axios";
import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";

//THIS IS A TEMPLATE SCRAPER -> COPY FUNCTIONALITY FOR ALL SCRAPERS
//BUT CHANGE HTML SPECIFICS TO MATCH EACH SITE

export async function scrapeFuwa(query: string): Promise<KitResult[]> {
  const url = `https://fuwafuwaland.ca/search?q=${encodeURIComponent(query)}`;

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(html);
  const results: KitResult[] = [];

  //iterate product card
  $(".grid__item, .card").each((_, el) => {
    const container = $(el);

    //link
    const linkEl = container.find("a[href*='/products/']").first();
    const link = linkEl.attr("href");
    if (!link) return;

    const fullLink = link.startsWith("http")
      ? link
      : `https://fuwafuwaland.ca${link}`;

    //name
    const name =
      container.find("h3, .card__heading").first().text().trim() ||
      linkEl.text().trim();

    //img
    const image =
      container.find("img").attr("src") ||
      container.find("img").attr("data-src") ||
      "";

    //price)
    const priceText =
      container.find(".price-item--sale").first().text().trim() ||
      container.find(".price-item--regular").first().text().trim();

    const price = parseFloat(
      priceText.replace(/[^\d.]/g, "")
    );

    const currency = "CAD";
    const source = "Fuwa Fuwa Land";

    if (!name || !fullLink || isNaN(price)) return;

    results.push({
      name,
      price,
      currency,
      link: fullLink,
      image,
      source,
    });
  });

  const uniqueResults = Array.from(
    new Map(results.map(item => [item.link, item])).values()
  );

  return uniqueResults;
}