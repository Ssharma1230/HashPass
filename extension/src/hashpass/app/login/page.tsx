"use client";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Lock } from "@/components/login";

export default function HashPassLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
//   const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");

    // router.push(chrome.runtime.getURL("dashboard/index.html"));
    // router.push("/dashboard");
    // window.location.href = chrome.runtime.getURL("dashboard/index.html");
    window.open(chrome.runtime.getURL("dashboard/index.html"), "_self");

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card>
        <CardHeader>
          <Lock className="w-10 h-10 text-gray-700" />
          <CardTitle>HashPass Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
              Login
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}