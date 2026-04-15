"use client";

import { useEffect, useState } from "react";

import { signIn, signUp } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/authProvider";

export default function LoginBox() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
        await signIn(email, password);
        router.push("/");
    } catch (err) {
        setError((err as Error).message);
    }
  };

  return (

    <form 
      className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 flex flex-col gap-5 border"
      onSubmit={handleSubmit}
    >
      
      <h1 className="text-2xl font-semibold text-center">
        Login
      </h1>

      <div className="flex flex-col gap-3">
        <input
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition active:scale-[0.98]"
      >
        Register
      </button>

      <p className="text-sm text-gray-500 text-center">
        Already have an account?{" "}
        <span 
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() =>{
            router.push("/create-account")
          }}
        >
          Create Account
        </span>
      </p>

    </form>
  );
}