"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/auth/useRegister";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error, data } = useRegister();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ name, email, password });
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          {isPending ? "Creating account..." : "Register"}
        </button>

        {error && <p className="text-red-600 text-sm">{error.message}</p>}
        {data && <p className="text-green-600 text-sm">Welcome, {data.user.name}! Account created.</p>}
      </form>
    </div>
  );
}