import axios from "axios";
import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";

export async function scrapePanda(query: string): Promise<KitResult[]> {
  const url = `https://pandahobby.ca/search?q=${encodeURIComponent(query)}`;

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(html);
  const results: KitResult[] = [];

  $(".productitem").each((_, el) => {
    const container = $(el);

    const linkEl = container
      .find(".productitem--title a")
      .first();

    const link = linkEl.attr("href");

    if (!link) return;

    const fullLink = link.startsWith("http")
      ? link
      : `https://pandahobby.ca${link}`;

    const name = linkEl.text().trim();

    const priceText = container
      .find(".price__current--min .money")
      .first()
      .text()
      .trim();

    const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

    let image =
      container.find("img").attr("src") ||
      container.find("img").attr("data-src") ||
      container.find("img").attr("data-original") ||
      "";

    if (image.startsWith("//")) {
      image = "https:" + image;
    }

    const classList = container.attr("class") || "";

    let inStock: boolean | null = null;

    if (classList.includes("snize-product-out-of-stock")) {
      inStock = false;
    } else if (classList.includes("snize-product-in-stock")) {
      inStock = true;
    } else {
      inStock = true;
    }

    if (!name || !fullLink || isNaN(price)) {
      console.log("SKIPPED:", { name, priceText });
      return;
    }

    results.push({
      name,
      price,
      currency: "CAD",
      link: fullLink,
      image,
      source: "Panda Hobby",
    });
  });

  return Array.from(
    new Map(results.map((item) => [item.link, item])).values()
  );
}