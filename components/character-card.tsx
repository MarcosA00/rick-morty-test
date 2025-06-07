"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Character {
  id: number
  name: string
  status: string
  species: string
  image: string
}

interface CharacterCardProps {
  character: Character
  onClick: () => void
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
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

  // Obtener color de fondo según la especie
  const getSpeciesColor = (species: string) => {
    switch (species.toLowerCase()) {
      case "human":
        return "from-blue-100 to-blue-200 border-blue-300"
      case "alien":
        return "from-green-100 to-green-200 border-green-300"
      case "humanoid":
        return "from-purple-100 to-purple-200 border-purple-300"
      case "unknown":
        return "from-gray-100 to-gray-200 border-gray-300"
      case "poopybutthole":
        return "from-yellow-100 to-yellow-200 border-yellow-300"
      case "mythological creature":
        return "from-red-100 to-red-200 border-red-300"
      case "animal":
        return "from-orange-100 to-orange-200 border-orange-300"
      case "robot":
        return "from-slate-100 to-slate-200 border-slate-300"
      case "cronenberg":
        return "from-pink-100 to-pink-200 border-pink-300"
      case "disease":
        return "from-lime-100 to-lime-200 border-lime-300"
      default:
        return "from-indigo-100 to-indigo-200 border-indigo-300"
    }
  }

  return (
    <Card
      className={`hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br ${getSpeciesColor(character.species)} border-2`}
    >
      <CardContent className="p-4">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg">
          <img
            src={character.image || "/placeholder.svg"}
            alt={character.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onClick={onClick}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{character.name}</h3>
          <p className="text-sm text-gray-700 font-medium">{character.species}</p>
          <Badge className={`${getStatusColor(character.status)} text-white`}>{getStatusText(character.status)}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
