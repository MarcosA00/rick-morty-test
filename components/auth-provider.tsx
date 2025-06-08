"use client"



import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: string | null
  login: (username: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(savedUser)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  // Función para iniciar sesión
  const login = (username: string) => {
    localStorage.setItem("user", username)
    setUser(username)
    setIsAuthenticated(true)
  }

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
