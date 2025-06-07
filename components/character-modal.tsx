"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Character {
  id: number
  name: string
  status: string
  species: string
  gender: string
  origin: {
    name: string
  }
  image: string
  episode: string[]
}

interface Episode {
  id: number
  name: string
  episode: string
}

interface CharacterModalProps {
  character: Character | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CharacterModal({ character, open, onOpenChange }: CharacterModalProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [episodeError, setEpisodeError] = useState<string | null>(null)

  // Cargar episodios cuando se abra el modal
  useEffect(() => {
    if (character && open) {
      fetchEpisodes(character.episode)
    }
  }, [character, open])

  // Función para obtener información de los episodios
  const fetchEpisodes = async (episodeUrls: string[]) => {
    setLoadingEpisodes(true)
    setEpisodeError(null)
    try {
      // Tomar solo los primeros 5 episodios para no sobrecargar la interfaz
      const episodeIds = episodeUrls
        .slice(0, 5)
        .map((url) => url.split("/").pop())
        .join(",")
      const response = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds}`)

      if (!response.ok) {
        throw new Error("No se pudieron cargar los episodios")
      }

      const data = await response.json()

      // La API devuelve un objeto si es un solo episodio, o un array si son varios
      const episodeArray = Array.isArray(data) ? data : [data]
      setEpisodes(episodeArray)
    } catch (error) {
      console.error("Error al obtener episodios:", error)
      setEpisodeError("Error al cargar los episodios")
      setEpisodes([])
    } finally {
      setLoadingEpisodes(false)
    }
  }

  // Obtener color según el estado del personaje
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "bg-green-500"
      case "dead":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Traducir estado del personaje
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "Vivo"
      case "dead":
        return "Muerto"
      default:
        return "Desconocido"
    }
  }

  // Traducir género del personaje
  const getGenderText = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "Masculino"
      case "female":
        return "Femenino"
      case "genderless":
        return "Sin género"
      default:
        return "Desconocido"
    }
  }

  // Obtener color de fondo según la especie
  const getSpeciesColor = (species: string) => {
    switch (species.toLowerCase()) {
      case "human":
        return "from-blue-50 to-blue-100"
      case "alien":
        return "from-green-50 to-green-100"
      case "humanoid":
        return "from-purple-50 to-purple-100"
      case "unknown":
        return "from-gray-50 to-gray-100"
      case "poopybutthole":
        return "from-yellow-50 to-yellow-100"
      case "mythological creature":
        return "from-red-50 to-red-100"
      case "animal":
        return "from-orange-50 to-orange-100"
      case "robot":
        return "from-slate-50 to-slate-100"
      case "cronenberg":
        return "from-pink-50 to-pink-100"
      case "disease":
        return "from-lime-50 to-lime-100"
      default:
        return "from-indigo-50 to-indigo-100"
    }
  }

  if (!character) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br ${getSpeciesColor(character.species)}`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{character.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={character.image || "/placeholder.svg"}
                alt={character.name}
                className="w-full md:w-64 h-64 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <h3 className="font-semibold text-lg mb-2">Información General</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado:</span>
                    <Badge className={`${getStatusColor(character.status)} text-white`}>
                      {getStatusText(character.status)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Especie:</span> {character.species}
                  </div>
                  <div>
                    <span className="font-medium">Género:</span> {getGenderText(character.gender)}
                  </div>
                  <div>
                    <span className="font-medium">Origen:</span> {character.origin.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3">Episodios ({character.episode.length} total)</h3>
            {loadingEpisodes ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : episodeError ? (
              <div className="text-center py-4 text-red-600">{episodeError}</div>
            ) : (
              <div className="space-y-2">
                {episodes.map((episode) => (
                  <div key={episode.id} className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="font-medium">{episode.name}</div>
                    <div className="text-sm text-gray-600">{episode.episode}</div>
                  </div>
                ))}
                {character.episode.length > 5 && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    ... y {character.episode.length - 5} episodios más
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
