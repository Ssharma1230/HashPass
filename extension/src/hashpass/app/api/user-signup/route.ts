import { NextResponse } from 'next/server';
import { createSSHTunnelAndConnect } from '../../utils/sshTunnel';
import { encrypt } from '../../security_components/tools/AES_tool';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2/promise';

export async function POST(req: Request) {
    try {
        const { name, email, phone, passphrase } = await req.json();

        console.log('Starting SSH Tunnel...');
        const connection = await createSSHTunnelAndConnect();

        console.log('Checking if email exists...');
        const [rows] = await connection.execute<RowDataPacket[]>(
          'SELECT COUNT(*) as count FROM users WHERE enc_email = ?',
          [email]
        );
        
        const existingUser = (rows as { count: number }[])[0]?.count ?? 0;
        
        if (existingUser > 0) {
          return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        console.log('Encrypting data...');
        const uuid = uuidv4(); 
        const enc_uuid = await encrypt(uuid, passphrase);
        const enc_name = await encrypt(name, passphrase);
        const enc_phone = await encrypt(phone, passphrase);
        const enc_time_creation = new Date().toISOString();

        console.log('Inserting new user...');
        const [result] = await connection.execute(
            'INSERT INTO users (uuid, enc_uuid, enc_name, enc_email, enc_phone_num, enc_time_creation) VALUES (?, ?, ?, ?, ?, ?)',
            [uuid, enc_uuid, enc_name, email, enc_phone, enc_time_creation]
        );

        console.log('User registered successfully:', result);
        await connection.end();

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
    }
}
