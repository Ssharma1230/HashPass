import HashingTestComponent from './security_components/hashing_test_component';
import PasswordGenerator from './security_components/password_generator';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">HashPass</h1>
      <section className="mt-4 text-lg">Hello World!</section>
      <div>
        <PasswordGenerator/>
      </div>
    </main>
  );
}
