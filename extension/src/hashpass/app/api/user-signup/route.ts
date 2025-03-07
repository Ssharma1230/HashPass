import { NextResponse } from 'next/server';
import { createSSHTunnelAndConnect } from '../../utils/sshTunnel';

export async function POST(req: Request) {
    try {
      const { name, email, phone, securityAnswers, passphrase } = await req.json();
  
      console.log('Starting SSH Tunnel...');
      const connection = await createSSHTunnelAndConnect();
  
      console.log('SSH Tunnel established. Inserting data...');
      const createdAt = new Date().toISOString();
      const [result] = await connection.execute(
        'INSERT INTO users (uuid, enc_uuid, enc_name, enc_email, enc_phone_num, enc_time_creation) VALUES (UUID(), UUID(), ?, ?, ?, ?)',
        [name, email, phone, createdAt]
      );
  
      console.log('Data inserted successfully:', result);
      await connection.end();
  
      return NextResponse.json({ success: true, result });
    } catch (error) {
      console.error('Signup error:', error);
      return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
    }
  }
  
