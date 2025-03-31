// store/favoritesStore.ts
import { create } from 'zustand';

type FavoriteState = {
  favoritesIds: number[];
  addFavorite: (cabinetId: number) => void;
  removeFavorite: (cabinetId: number) => void;
  setFavorites: (ids: number[]) => void;
};

export const useFavoriteStore = create<FavoriteState>((set) => ({
  favoritesIds: [],
  addFavorite: (cabinetId) =>
    set((state) => ({
      favoritesIds: [...state.favoritesIds, cabinetId],
    })),
  removeFavorite: (cabinetId) =>
    set((state) => ({
      favoritesIds: state.favoritesIds.filter((id) => id !== cabinetId),
    })),
  setFavorites: (ids) => set({ favoritesIds: ids }),
}));