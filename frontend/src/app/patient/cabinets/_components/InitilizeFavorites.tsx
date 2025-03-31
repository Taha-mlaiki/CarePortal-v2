"use client";

import axios from "@/lib/axios";
import { useFavoriteStore } from "@/store/favoritesStore";
import React, { useEffect } from "react";
import { toast } from "sonner";

const InitilizeFavorites = () => {
  const setFavorites = useFavoriteStore((state) => state.setFavorites);

  useEffect(() => {
    const fetchFavoritesIds = async () => {
      const res = await axios.get("/patient/cabinets/favoritedIds");
      if (res.status == 200) {
        setFavorites(res.data.favoritedIds);
      } else {
        toast.error(res.data.error);
      }
    };
    fetchFavoritesIds();
  }, [setFavorites]);

  return <div></div>;
};

export default InitilizeFavorites;
