import Link from "next/link";
import EncDecTester from '../security_components/enc_dec_tool';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">HashPass</h1>
      <section className="mt-4 text-lg">Hello World!</section>
      <div>
      <Link href="/login/index.html">
          <button>Go to Login &gt;</button>
        </Link>
      </div>
      <div>
        <EncDecTester/>
      </div>
    </main>
  );
}