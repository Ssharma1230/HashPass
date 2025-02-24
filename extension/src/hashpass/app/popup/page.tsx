import Encryption_Tester from '../security_components/test/encryption_tester';
import PasswordGenerator from '../security_components/components/password_generator';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">HashPassPOP</h1>
      <section className="mt-4 text-lg">Hello World!</section>
      <div>
        <PasswordGenerator/>
      </div>
      <div>
        <Encryption_Tester/>
      </div>
    </main>
  );
}
