import React from "react"

export function Button({ children, className = "", variant, ...props }) {
  const baseClass = "px-4 py-2 rounded font-semibold"
  const variantClass = variant === "outline" ? "border border-gray-500" : "bg-blue-600 text-white"
  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
