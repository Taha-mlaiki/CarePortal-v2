// store/favoritesStore.ts
import { create } from "zustand";

type CommentableCabinetsState = {
  cabinetIds: number[];
  setCabinetsIds: (ids: number[]) => void;
};

export const useCommentableCabinetsStore = create<CommentableCabinetsState>(
  (set) => ({
    cabinetIds: [],
    setCabinetsIds: (ids) => set({ cabinetIds: ids }),
  })
);
