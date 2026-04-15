"use client";

import { useAuth } from "@/lib/auth/authProvider";
import { CiStar } from "react-icons/ci";

//TODO: Add functions for wishlisting item

export default function WishlistBadge(){

    const {user, isLoggedIn, loading} = useAuth();

return(

<span 
    className="flex flex-row bg-yellow-300 color-black-200 
                    rounded hover:bg-yellow-400 p-2 w-max
                    hover:cursor-pointer"
    onClick={()=>{

    }}                
    >


    <CiStar size={18}/>
</span>


)

}