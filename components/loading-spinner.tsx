"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className="text-center space-y-4">
        <div
          className={cn(
            "animate-spin rounded-full border-4 border-secondary border-t-primary mx-auto",
            sizeClasses[size],
            className,
          )}
        />
        <div className="text-primary font-medium">{size === "sm" ? "Cargando..." : "Cargando personajes..."}</div>
      </div>
    </div>
  )
}
