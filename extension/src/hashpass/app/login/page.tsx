"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, Lock } from "@/components/login";

export default function HashPassLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null); // Ref for form element

  const handleLogin = (e: Event) => {
    e.preventDefault(); // Prevent default form submission

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    alert("URL: " + chrome.runtime.getURL("dashboard/index.html"));
  };

  // Attach the event listener after the component mounts
  useEffect(() => {
    const formElement = formRef.current; // Store current ref value

    if (formElement) {
      formElement.addEventListener("submit", handleLogin);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener("submit", handleLogin);
      }
    };
  }, [email, password]); // Dependencies remain the same

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card>
        <CardHeader>
          <Lock className="w-10 h-10 text-gray-700" />
          <CardTitle>HashPass Login</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-500">
                Please enter your email and password to login to HashPass.
            </p>
        </CardContent>
        <CardContent>
          <form ref={formRef} className="space-y-4">
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
