"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useFavoriteStore } from "@/store/favoritesStore";
import { useQueryClient } from "@tanstack/react-query";

type FavoriteButtonProps = {
  cabinetId: number;
  cabinetName?: string;
  initialIsFavorite?: boolean;
  variant?: "icon" | "button";
  className?: string;
};

export default function FavoriteButton({
  cabinetId,
  cabinetName,
  initialIsFavorite = false,
  variant = "icon",
  className = "",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isAnimating, setIsAnimating] = useState(false);
  const { favoritesIds, addFavorite, removeFavorite } = useFavoriteStore();
  const queryClient = useQueryClient();

  // Sync local state with store
  useEffect(() => {
    setIsFavorite(favoritesIds.includes(cabinetId));
  }, [cabinetId, favoritesIds]);

  const toggleFavorite = async () => {
    const wasFavorite = isFavorite;
    setIsFavorite(!isFavorite); // Optimistic update
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Animation duration

    try {
      if (!wasFavorite) {
        // Add to favorites
        const res = await axios.post(`/patient/favorites`, {
          cabinetId,
        });
        if (res.status === 201) {
          addFavorite(cabinetId);
          toast.success(
            cabinetName
              ? `${cabinetName} added to favorites!`
              : "Added to favorites!"
          );
          queryClient.invalidateQueries({ queryKey: ["favorites"] });
        } else {
          throw new Error("Unexpected response status");
        }
      } else {
        // Remove from favorites
        const res = await axios.delete(`/patient/favorites/${cabinetId}`);
        if (res.status === 200 || res.status === 204) {
          removeFavorite(cabinetId); // Update store
          toast.success(
            cabinetName
              ? `${cabinetName} removed from favorites`
              : "Removed from favorites"
          );
        } else {
          throw new Error("Unexpected response status");
        }
      }
    } catch (error) {
      // Rollback on error
      setIsFavorite(wasFavorite);
      toast.error("Something went wrong. Please try again.");
      console.error("Favorite toggle error:", error);
    }
  };

  if (variant === "button") {
    return (
      <Button
        variant={isFavorite ? "default" : "outline"}
        className={`gap-2 ${
          isFavorite ? "bg-red-500 hover:bg-red-600" : ""
        } ${className}`}
        onClick={toggleFavorite}
      >
        <Heart
          className={`h-4 w-4 ${
            isAnimating ? "scale-125 transition-transform duration-300" : ""
          } ${isFavorite ? "fill-white" : ""}`}
        />
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </Button>
    );
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
        className={`h-5 w-5 ${
          isAnimating ? "scale-125 transition-transform duration-300" : ""
        } ${
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-500 hover:text-red-500"
        }`}
      />
    </Button>
  );
}
