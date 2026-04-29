//defines the shape of the object returned by scrapers
import { GunplaGrade } from "./grades";

export interface KitResult{
    name: string;
    grade?: GunplaGrade;
    price: number;
    currency: string;
    link: string;
    image?: string;
    source: string;
}