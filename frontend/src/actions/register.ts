"use server";

import axios from "@/lib/axios";
import { cookies } from "next/headers";

export const registerAction = async ({
  email,
  password,
  role,
  name,
}: {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}) => {
  try {
    const res = await axios.post("/register", {
      name,
      email,
      password,
      role,
    });
    const cookieStore = await cookies();
    if (res.data.token) {
      cookieStore.set({
        name: "token",
        value: res.data.token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 2
      });
      return { success: "register successfully" };
    }
  } catch (error) {
    return { error };
  }
};
