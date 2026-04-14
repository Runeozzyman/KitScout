import { KitResult } from "@/types/kit";
import { KitResultWithCAD } from "@/types/kitWithCAD";
import Fuse from "fuse.js";

export function fuzzySearch(results: KitResult[], query:string){
    const fuse = new Fuse(results,{
        keys: ["name", "source"],
        threshold: 0.4,
        ignoreLocation: true,
    });

    const res = fuse.search(query);

    return res.map(r => r.item);
}