import axios from "axios";
import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";

export async function scrapePanda(query: string): Promise<KitResult[]> {
    
    //this is the JSON endpoint
    const url = `https://pandahobby.ca/search/suggest.json?q=${encodeURIComponent(query)}`;

    const {data} = await axios.get(url,{
        headers:{
            "User-Agent":"Mozilla/5.0",
        }, timeout: 10000,
    });

    const results: KitResult[] = [];
    const products = data?.resources?.results?.products ?? [];

     for (const p of products) {
        const name = p.title;
        const price = parseFloat(p.price_max ?? p.price);
        const currency = "CAD";
        const link = p.url.startsWith("http") ? p.url : `https://pandahobby.ca${p.url}`;
        const source = "Panda Hobby";

        if (!name || !link || isNaN(price)) continue;

        results.push({ name, price, currency, link, source });
    }

    const uniqueResults = Array.from(
        new Map(results.map(item => [item.link, item])).values()
    );

    return uniqueResults;
}