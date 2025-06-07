"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface Filters {
  name: string
  status: string
  species: string
}

interface SearchFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onSearch: () => void
  onClear: () => void
  loading: boolean
}

export function SearchFilters({ filters, onFiltersChange, onSearch, onClear, loading }: SearchFiltersProps) {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = filters.name || filters.status || filters.species

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Nombre</label>
            <Input
              placeholder="Buscar por nombre..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              className="border-primary/30 focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Estado</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="alive">Vivo</SelectItem>
                <SelectItem value="dead">Muerto</SelectItem>
                <SelectItem value="unknown">Desconocido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Especie</label>
            <Select value={filters.species} onValueChange={(value) => handleFilterChange("species", value)}>
              <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Todas las especies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especies</SelectItem>
                <SelectItem value="Human">Humano</SelectItem>
                <SelectItem value="Alien">Alien</SelectItem>
                <SelectItem value="Humanoid">Humanoide</SelectItem>
                <SelectItem value="unknown">Desconocido</SelectItem>
                <SelectItem value="Poopybutthole">Poopybutthole</SelectItem>
                <SelectItem value="Mythological Creature">Criatura Mitológica</SelectItem>
                <SelectItem value="Animal">Animal</SelectItem>
                <SelectItem value="Robot">Robot</SelectItem>
                <SelectItem value="Cronenberg">Cronenberg</SelectItem>
                <SelectItem value="Disease">Enfermedad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium invisible">Acciones</label>
            <div className="flex gap-2">
              <Button onClick={onSearch} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              {hasActiveFilters && (
                <Button
                  onClick={onClear}
                  variant="outline"
                  disabled={loading}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
