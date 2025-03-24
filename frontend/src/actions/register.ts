"use server";

import axios from "@/lib/axios";
import { cookies } from "next/headers";

export const registerAction = async ({
  email,
  password,
  role,
  username,
  phone_number,
  qualifications,
}: {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  role: "patient" | "manager";
  qualifications?: string;
}) => {
  try {
    const res = await axios.post("/register", {
      username,
      email,
      password,
      phone_number,
      role,
      qualifications,
    });
    const cookieStore = await cookies();
    if (res.data.token) {
      cookieStore.set({
        name: "token",
        value: res.data.token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 2,
      });
      return { success: res.data.success, role: res.data.role };
    }
  } catch (error) {
    return { error };
  }
};
