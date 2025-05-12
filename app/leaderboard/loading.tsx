export default function LeaderboardLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full h-20 bg-gray-800 animate-pulse rounded-lg mb-8"></div>

      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-gray-800 animate-pulse rounded-lg h-16"></div>
        ))}
      </div>
    </div>
  )
}
