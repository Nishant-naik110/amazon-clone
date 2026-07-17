"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const { mutate, isPending, error } = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          login(data.token, data.user); // saves to context + localStorage
          router.push("/"); // redirect to homepage after login
        },
      }
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-yellow-400 p-2 rounded font-semibold" type="submit" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
        </button>
        {error && <p className="text-red-600 text-sm">{error.message}</p>}
      </form>
      <p className="text-sm mt-4">
        New here? <a href="/register" className="underline">Create an account</a>
      </p>
    </div>
  );
}