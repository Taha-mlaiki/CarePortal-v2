"use client";
import { registerAction } from "@/actions/register";
import React, { FormEvent, useState } from "react";

const Page = () => {
  type FormData = {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  };

  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await registerAction(data);
    console.log(res);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={(e) => submit(e)} className="max-w-lg w-full mx-auto">
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your name
          </label>
          <input
            value={data.name}
            type="text"
            id="name"
            onChange={(e) =>
              setData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="jhon doe"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            value={data.email}
            type="email"
            id="email"
            onChange={(e) =>
              setData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            role
          </label>
          <input
            type="text"
            id="role"
            value={data.role}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                role: e.target.value as "user" | "admin",
              }))
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="user"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            value={data.password}
            type="password"
            id="password"
            onChange={(e) =>
              setData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
