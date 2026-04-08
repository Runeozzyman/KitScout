import { KitResultWithCAD } from "@/types/kitWithCAD";
import ResultCard from "./resultCard";

type Props = {
    data: KitResultWithCAD[];
}

export default function ResultList( {data} : Props){

return(
<div className="w-full max-w-5xl grid gap-4 animate-fade-in">
    {data.map((item) => (
    <ResultCard key={item.link} item={item} />
    ))}
</div>
);
}