import { useRouter } from "next/navigation";

export default function Header(){

    const router = useRouter();

return(

    <div className="w-full  bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-center p-6">
            <button
                onClick={() => router.push("/")}
                className="text-lg sm:text-xl font-bold tracking-tight hover:cursor-pointer"
            >
            
            <img 
                src="/logo.svg" 
                className="h-15"  
            />
            </button>
        </div>
    </div>  

    )
}