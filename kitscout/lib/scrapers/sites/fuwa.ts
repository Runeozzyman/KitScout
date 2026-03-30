import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://fuwafuwaland.ca";

//note: this defines the shape of object returned by result
export interface KitResult {
    name: string;
    price: number;
    link: string;
    image?: string;
    source: string;
}

//note: fn. returns a promise that resolves to KitResult object
export async function scrapeFuwa(): Promise<KitResult[]>{

    const url = "https://fuwafuwaland.ca";

    const {data} = await axios.get(url, {
        headers:{
            "User-Agent": "Mozilla/5.0",
        }, timeout: 10000,
    });

    const $ = cheerio.load(data)
    const results: KitResult[] = []; //explain

    $(".card, .product-card, .grid-item").each((_, el) => {

    const name = $(el).find("h3").first().text().trim();
    const priceText = $(el).find(":contains('$')").first().text().trim();
    const priceMatch = priceText.match(/\d+\.\d{2}/);
    const price = priceMatch ? parseFloat(priceMatch[0]) : null;
    const link = $(el).find("a").attr("href");

    if (!name || !price || !link) return;

    results.push({
        name,
        price,
        link: link.startsWith("http")
        ? link
        : `https://fuwafuwaland.ca${link}`,
        source: "FuwaFuwa",
        });
    });
    
    const uniqueResults = Array.from(
        new Map(results.map(item => [item.link, item])).values()
    );

    return uniqueResults;
}