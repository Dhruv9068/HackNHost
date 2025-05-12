export default function EventsLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full h-40 bg-gray-800 animate-pulse rounded-lg mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-800 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    </div>
  )
}
