import axios from "axios";
//import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";

//note: fn. returns a promise that resolves to KitResult object
export async function scrapePlanet(query: string): Promise<KitResult[]>{

    //this is the JSON endpoint
    const url = `https://www.gundamplanet.com/search/suggest.json?q=${encodeURIComponent(query)}`;

    const {data} = await axios.get(url, {
        headers:{
            "User-Agent": "Mozilla/5.0",
        }, timeout: 10000,
    });

    const results: KitResult[] = []; 
    const products = data?.resources?.results?.products ?? [];

    for (const p of products) {
        const name = p.title;
        const price = parseFloat(p.price_max ?? p.price);
        const currency = "USD";
        const link = p.url.startsWith("http") ? p.url : `https://www.gundamplanet.com${p.url}`;
        const image = p.image || p.featured_image?.url;
        const source = "Gundam Planet";

        if (!name || !link || isNaN(price)) continue;

        results.push({ name, price, currency, link, image, source });
    }

    const uniqueResults = Array.from(
        new Map(results.map(item => [item.link, item])).values()
    );

    return uniqueResults;
}