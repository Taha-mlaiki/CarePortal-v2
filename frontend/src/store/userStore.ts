import axios from "@/lib/axios";
import { create } from "zustand";
import { UserType } from "@/types";

interface stateType {
  user: UserType | null;
  fetchUser: () => void;
  clearUser: () => void;
  setUser: (userData: UserType) => void;
}

export const useUserState = create<stateType>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const res = await axios.get("/user");
      if (res.status === 200) {
        set({ user: res.data.user });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ user: null });
    }
  },
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));
