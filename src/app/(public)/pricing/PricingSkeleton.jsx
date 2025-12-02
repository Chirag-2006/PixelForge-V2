/* FULL PAGE SKELETON */
export default function FullSkeleton() {
  return (
    <div className="w-full max-w-5xl animate-pulse">
      {/* Title Skeleton */}
      <div className="mx-auto h-8 w-64 bg-gray-700 rounded mb-4"></div>
      <div className="mx-auto h-4 w-80 bg-gray-700 rounded mb-10"></div>

      {/* Two Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
        {[1, 2].map((x) => (
          <div
            key={x}
            className="bg-[#111527] border border-gray-700 rounded-xl p-6 h-[380px]"
          >
            <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
            <div className="h-10 w-24 bg-gray-700 rounded mb-6"></div>

            <div className="space-y-3">
              <div className="h-3 w-40 bg-gray-700 rounded"></div>
              <div className="h-3 w-36 bg-gray-700 rounded"></div>
              <div className="h-3 w-48 bg-gray-700 rounded"></div>
              <div className="h-3 w-28 bg-gray-700 rounded"></div>
              <div className="h-3 w-32 bg-gray-700 rounded"></div>
            </div>

            <div className="h-10 w-full bg-gray-700 rounded mt-8"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
