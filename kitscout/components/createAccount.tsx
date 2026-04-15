"use client";

import { useState } from "react";
import { signUp } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function CreateAccountForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);

    try {
        await signUp(email, password);
        router.push("/");
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 flex flex-col gap-5 border"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-semibold text-center">
        Create Account
      </h1>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        <input
          className="border border-gray-300 rounded-lg p-3 w-full"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Register"}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => router.push("/login")}
        >
          Sign in
        </span>
      </p>
    </form>
  );
}