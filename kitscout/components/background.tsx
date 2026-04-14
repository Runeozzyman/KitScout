export default function HomeBackground(){
return(
<div className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src="/background.jpg"
        alt="background"
        className="w-full h-full object-cover object-center blur-md scale-105"
      />

      <div className="absolute inset-0 bg-black/40" />
    </div>
)}