"use server";

import axios from "@/lib/axios";
import { cookies } from "next/headers";

export const loginAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post("/login", {
      email,
      password,
    });
    const cookieStore = await cookies();
    if (res.data.token) {
      cookieStore.set({
        name: "token",
        value: res.data.token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, 
      });
      return {
        success: "Logged in successfully",
        warning: res.data.warning || null,
        redirect: res.data.redirect || "/", 
      };
    }
    return { error: "No token received" };
  } catch (error) {
    return { error };
  }
};
