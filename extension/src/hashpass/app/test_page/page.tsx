"use client";
import Encryption_Tester from "../security_components/enc_dec_tool"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">HashPass</h1>
      <>
        <section className="mt-4 text-lg">HashPass Testing Page</section>
        <Encryption_Tester/>
      </>
    
    </main>
  );
}