"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CabinetCard } from "../_components/CabinetCard";
import { CabinetType } from "../page";


export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = JSON.parse(
          localStorage.getItem("favoriteCabinets") || "[]"
        );
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Filter cabinets based on favorites and search term
  const filteredCabinets = CABINETS_DATA.filter(
    (cabinet) =>
      favorites.includes(cabinet.id) &&
      (searchTerm === "" ||
        cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabinet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabinet.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Remove all favorites
  const clearAllFavorites = () => {
    localStorage.setItem("favoriteCabinets", "[]");
    setFavorites([]);
  };

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <Link
              href="/patient/cabinets"
              className="inline-flex mb-3 items-center gap-2 text-sm font-medium text-[#3b82f6] hover:text-[#3b82f6]/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cabinets
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              My Favorite Cabinets
            </h1>
          </div>

          {favorites.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Favorites</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove all cabinets from your
                    favorites? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllFavorites}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <p className="mt-2 text-lg text-gray-600">
          {favorites.length > 0
            ? `You have ${favorites.length} favorite ${
                favorites.length === 1 ? "cabinet" : "cabinets"
              }`
            : "You haven't added any cabinets to your favorites yet"}
        </p>
      </div>

      {/* Search bar */}
      {favorites.length > 0 && (
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300 pl-10 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3b82f6] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="ml-4 text-gray-600">Loading your favorites...</p>
        </div>
      ) : (
        <>
          {/* Empty state */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                No favorites yet
              </h3>
              <p className="mt-2 max-w-md text-gray-600">
                Start adding cabinets to your favorites by clicking the heart
                icon on any cabinet card or detail page.
              </p>
              <Link href="/patient/cabinets">
                <Button className="mt-6 bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                  Browse Cabinets
                </Button>
              </Link>
            </div>
          ) : filteredCabinets.length === 0 ? (
            // No results from search
            <div className="rounded-xl bg-white p-12 text-center shadow">
              <h3 className="text-xl font-medium text-gray-900">
                No matching cabinets found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your search criteria
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            // Favorites grid
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCabinets.map((cabinet) => (
                <CabinetCard key={cabinet.id} cabinet={cabinet} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
