import Link from 'next/link';
import HashingTestComponent from './hashing_test_component';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">HashPass</h1>
      <section className="mt-4 text-lg">Hello World!</section>
      <div>
        <HashingTestComponent/>
      </div>
    </main>
  );
}
