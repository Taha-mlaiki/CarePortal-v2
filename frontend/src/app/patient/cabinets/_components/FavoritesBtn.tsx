"use client"

import { useState, useEffect } from "react"
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
// import { toast } from "@/hooks/use-toast"

type FavoriteButtonProps = {
  cabinetId: number
  cabinetName?: string
  initialIsFavorite?: boolean
  variant?: "icon" | "button"
  className?: string
}

export default function FavoriteButton({
  cabinetId,
  initialIsFavorite = false,
  variant = "icon",
  className = ""
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isAnimating, setIsAnimating] = useState(false)

  // Load favorite status from localStorage on component mount
  useEffect(() => {
    const favoriteCabinets = JSON.parse(localStorage.getItem("favoriteCabinets") || "[]")
    setIsFavorite(favoriteCabinets.includes(cabinetId))
  }, [cabinetId])

  const toggleFavorite = () => {
    // Get current favorites from localStorage
    const favoriteCabinets = JSON.parse(localStorage.getItem("favoriteCabinets") || "[]")
    
    // Update favorites list
    let updatedFavorites
    if (isFavorite) {
      updatedFavorites = favoriteCabinets.filter((id: number) => id !== cabinetId)
    } else {
      updatedFavorites = [...favoriteCabinets, cabinetId]

    }
    
    // Save to localStorage
    localStorage.setItem("favoriteCabinets", JSON.stringify(updatedFavorites))
    
    // Update state and trigger animation
    setIsFavorite(!isFavorite)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  if (variant === "button") {
    return (
      <Button
        variant={isFavorite ? "default" : "outline"}
        className={`gap-2 ${isFavorite ? "bg-red-500 hover:bg-red-600" : ""} ${className}`}
        onClick={toggleFavorite}
      >
        <Heart
          className={`h-4 w-4 ${isAnimating ? "scale-125 transition-transform" : ""} ${
            isFavorite ? "fill-white" : ""
          }`}
        />
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-9 w-9 rounded-full ${className}`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`h-5 w-5 ${isAnimating ? "scale-125 transition-transform" : ""} ${
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      />
    </Button>
  )
}