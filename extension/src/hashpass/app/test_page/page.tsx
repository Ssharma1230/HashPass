"use client";
import PasswordGenerator from "../security_components/components/password_generator";
import Encryption_Tester from "../security_components/enc_dec_tool";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">HashPass Testing Env</h1>
      <>
        <section className="mt-4 text-lg">Password Generator</section>
        <PasswordGenerator/>
        <Encryption_Tester/>
      </>
    
    </main>
  );
}