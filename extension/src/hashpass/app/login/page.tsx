import { useState, useEffect, useRef, useCallback } from "react";

export default function HashPassLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Memoize handleLogin so it doesn't change on every render
  const handleLogin = useCallback((e: Event) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    alert("URL: " + chrome.runtime.getURL("dashboard/index.html"));
  }, [email, password]); // Now it has stable dependencies

  useEffect(() => {
    const formElement = formRef.current;

    if (formElement) {
      formElement.addEventListener("submit", handleLogin);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener("submit", handleLogin);
      }
    };
  }, [handleLogin]); // Now handleLogin is properly included

  return (
    <form ref={formRef}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
