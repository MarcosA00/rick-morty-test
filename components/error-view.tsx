"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorViewProps {
  message: string
  onRetry?: () => void
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md border-2 border-red-200 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Ups! Algo salió mal</h3>
            <p className="text-gray-600">{message}</p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} className="w-full bg-primary hover:bg-primary/90">
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
