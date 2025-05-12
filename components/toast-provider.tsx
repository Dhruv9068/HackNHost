"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { Toaster } from "@/components/ui/toaster"

// Create a context for the toast
const ToastContext = createContext<{
  showToast: (title: string, description: string, variant?: "default" | "destructive" | "success") => void
}>({
  showToast: () => {},
})

// Export a hook to use the toast context
export const useToastContext = () => useContext(ToastContext)

// Toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; description: string; variant?: string }>>([])

  // Function to show a toast
  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" = "default",
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts([...toasts, { id, title, description, variant }])

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }, 5000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}
