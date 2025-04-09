"use client";
import Decryption_Tester from "../security_components/decrypt_tester"
import Encryption_Tester from "../security_components/enc_dec_tool";
import HashTester from "../security_components/test/hashing_test_component"


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">HashPass</h1>
      <>
        <section className="mt-4 text-lg">HashPass Testing Page</section>
        <Encryption_Tester/>
        <Decryption_Tester/>
        <HashTester/>
      </>
    
    </main>
  );
}