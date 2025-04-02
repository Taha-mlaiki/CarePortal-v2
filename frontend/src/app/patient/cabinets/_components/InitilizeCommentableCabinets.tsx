"use client";

import axios from "@/lib/axios";
import { useCommentableCabinetsStore } from "@/store/commentStore";
import React, { useEffect } from "react";
import { toast } from "sonner";

const InitilizeCommentableCabinets = () => {
  const setCabinetsIds = useCommentableCabinetsStore(
    (state) => state.setCabinetsIds
  );

  useEffect(() => {
    const fetchCommentableCabinetIds = async () => {
      const res = await axios.get("/patient/cabinets/commentable");
      if (res.status == 200) {
        setCabinetsIds(res.data.cabinetIds);
        console.log("commentable cabinets ids:", res.data.cabinetIds);
      } else {
        toast.error(res.data.error);
      }
    };
    fetchCommentableCabinetIds();
  }, [setCabinetsIds]);

  return <div></div>;
};

export default InitilizeCommentableCabinets;
