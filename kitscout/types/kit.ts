
//defines the shape of the object returned by scrapers
export interface KitResult{
    name: string;
    price: number;
    link: string;
    image?: string;
    source: string;
}