"use client";

import { CiStar } from "react-icons/ci";

export default function WishlistBadge(){
return(

<span className="flex flex-row bg-yellow-300 color-black-200 
                 rounded hover:bg-yellow-400 p-2 w-max
                 hover:cursor-pointer">
    <CiStar size={18}/>
</span>


)

}