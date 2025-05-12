"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 200)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          <span className="text-purple-500">Hack</span>
          <span className="text-white">N</span>
          <span className="text-purple-500">Host</span>
        </h1>
        <span className="absolute -right-4 top-0 h-full w-[4px] animate-blink bg-purple-500"></span>
      </div>

      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mt-4 text-gray-400">{progress < 100 ? "Loading..." : "Ready!"}</p>
    </div>
  )
}
