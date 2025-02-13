import { NextRequest, NextResponse } from 'next/server';
import argon2 from 'argon2';

export async function POST(req: NextRequest) {
  try {
    const { textToHash } = await req.json();
    const hash = await argon2.hash(textToHash, {
      salt: Buffer.from("my-static-salt", "utf8"),
      type: argon2.argon2id,
      timeCost: 2,
      memoryCost: 65536,
      parallelism: 1,
    });
    return NextResponse.json({ hash });
  } catch (err) {
    if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      } else {
        // Fallback for non-Error values
        return NextResponse.json({ error: String(err) }, { status: 500 });
      }
  }
}