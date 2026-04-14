"use client";

import { useState } from "react";

export default function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 flex flex-col gap-5 border">
      
      <h1 className="text-2xl font-semibold text-center">
        Create Account
      </h1>

      <div className="flex flex-col gap-3">
        <input
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
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
        <span className="text-blue-500 cursor-pointer hover:underline">
          Sign in
        </span>
      </p>

    </form>
  );
}