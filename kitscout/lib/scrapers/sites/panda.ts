import axios from "axios";
import * as cheerio from "cheerio";
import { KitResult } from "@/types/kit";

export async function scrapePanda(): Promise<KitResult[]> {
    
    const url = "https://pandahobby.ca";

    const {data} = await axios.get(url,{
        headers:{
            "User-Agent":"Mozilla/5.0",
        }, timeout: 10000,
    });

    const $ = cheerio.load(data)
    console.log("HTML length:", data.length);
    console.log("productitem count:", $(".productitem").length);

    const results: KitResult[] = [];

    $(".productitem").each((_, el) => {

        const name = $(el).find(".productitem--title").text().trim();
        let priceText = $(el)
            .find(".productitem_price, .current_price, .money")
            .first()
            .text()
            .trim();

        const price = parseFloat(
            priceText.replace(/[^0-9.]/g, "")
        );
        const link = $(el).find("a").attr("href");
        const source = "Panda Hobby";

        if(!name || !price || !link) return;

       results.push({
        name,
        price,
        link: link.startsWith("http") ? link : `https://pandahobby.ca${link}`,
        source: "Panda Hobby",
      });
    });

    const uniqueResults = Array.from(
        new Map(results.map(item => [item.link, item])).values()
    );

    return uniqueResults;

}