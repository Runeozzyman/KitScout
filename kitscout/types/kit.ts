//defines the shape of the object returned by scrapers
export interface KitResult{
    name: string;
    price: number;
    currency: string;
    link: string;
    image?: string;
    source: string;
}