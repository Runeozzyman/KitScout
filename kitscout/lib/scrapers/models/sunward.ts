import axios from "axios";
import { KitResult } from "@/types/kit";

export async function scrapeSunward(query: string): Promise<KitResult[]> {
    
    //this is the JSON endpoint
    const url = `https://www.sunwardhobbies.ca/search-results/?q=${encodeURIComponent(query)}`;

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
        const link = p.url.startsWith("http") ? p.url : `https://www.sunwardhobbies.ca${p.url}`;
        const image = p.image || p.featured_image?.url;
        const source = "Sunward Hobbies";

        if (!name || !link || isNaN(price)) continue;

        results.push({ name, price, currency, link, image, source });
    }

    const uniqueResults = Array.from(
        new Map(results.map(item => [item.link, item])).values()
    );

    return uniqueResults;
}