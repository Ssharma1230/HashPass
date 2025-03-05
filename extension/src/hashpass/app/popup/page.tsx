import Link from "next/link";
import EncDecTool from '../security_components/enc_dec_tool';
import PasswordGenerator from "../security_components/components/password_generator";

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
        <PasswordGenerator/>
      </div>
      <div>
        <EncDecTool/>
      </div>
    </main>
  );
}