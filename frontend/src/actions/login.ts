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
        maxAge: 60 * 20,
      });
      return { success: "login successfully" };
    }
  } catch (error) {
    return {error};
  }
};
