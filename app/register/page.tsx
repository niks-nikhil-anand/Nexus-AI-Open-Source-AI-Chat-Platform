"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RegisterUI from "@/components/RegisterUI";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterUI
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      error={error}
      onSubmit={handleRegister}
    />
  );
}
