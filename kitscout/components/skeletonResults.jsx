export default function SkeletonResult() {
  return (
    <div className="w-full border p-3 rounded-lg flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center animate-pulse">
      
      <div className="w-20 h-20 bg-gray-300 rounded p-1 flex-shrink-0" />

      <div className="flex flex-col flex-1 w-full gap-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-24" />
        </div>

        <div className="h-3 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
  );
}