import { KitResult } from "./kit"

export type KitResultWithCAD = KitResult & {
    priceCAD: number;
}