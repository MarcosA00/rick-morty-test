"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CharacterCard } from "@/components/character-card"
import { CharacterModal } from "@/components/character-modal"
import { Pagination } from "@/components/pagination"
import { SearchFilters } from "@/components/search-filters"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorView } from "@/components/error-view"
import { useAuth } from "@/components/auth-provider"

interface Character {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
  image: string
  episode: string[]
  url: string
  created: string
}

interface ApiResponse {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
  }
  results: Character[]
}

interface Filters {
  name: string
  status: string
  species: string
}

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    name: "",
    status: "",
    species: "",
  })

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
  }, [isAuthenticated, router])

  // Reiniciar a la primera página cuando cambien los filtros
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage(1)
    }
  }, [filters, isAuthenticated])

  // Obtener personajes cuando cambie la página
  useEffect(() => {
    if (isAuthenticated) {
      fetchCharacters(currentPage)
    }
  }, [currentPage, isAuthenticated])

  // Construir URL de la API con filtros aplicados
  const buildApiUrl = (page: number) => {
    const baseUrl = `https://rickandmortyapi.com/api/character?page=${page}`
    const params = new URLSearchParams()

    if (filters.name) params.append("name", filters.name)
    if (filters.status) params.append("status", filters.status)
    if (filters.species) params.append("species", filters.species)

    const queryString = params.toString()
    return queryString ? `${baseUrl}&${queryString}` : baseUrl
  }

  // Función para obtener personajes de la API
  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      const url = buildApiUrl(page)
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No se encontraron personajes con los filtros aplicados")
        }
        throw new Error(`Error ${response.status}: No se pudieron cargar los personajes`)
      }

      const data: ApiResponse = await response.json()
      setCharacters(data.results)
      setTotalPages(data.info.pages)
    } catch (error) {
      console.error("Error al obtener personajes:", error)
      setError(error instanceof Error ? error.message : "Error desconocido al cargar los personajes")
      setCharacters([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  // Manejar búsqueda con filtros
  const handleSearch = () => {
    setCurrentPage(1)
    fetchCharacters(1)
  }

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({ name: "", status: "", species: "" })
    setCurrentPage(1)
    fetchCharacters(1)
  }

  // Abrir modal con detalles del personaje
  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character)
    setModalOpen(true)
  }

  // Cerrar sesión y redirigir al login
  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Reintentar cargar personajes
  const handleRetry = () => {
    fetchCharacters(currentPage)
  }

  // No mostrar nada si no está autenticado
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-secondary p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Personajes de Rick y Morty</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Cerrar Sesión
          </Button>
        </div>

        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClearFilters}
          loading={loading}
        />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorView message={error} onRetry={handleRetry} />
        ) : characters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600 mb-4">No se encontraron personajes</div>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onClick={() => handleCharacterClick(character)}
                />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        <CharacterModal character={selectedCharacter} open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </div>
  )
}
