import { Client } from 'ssh2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function createSSHTunnelAndConnect() {
  return new Promise<mysql.Connection>((resolve, reject) => {
    const sshClient = new Client();

    const localPort = parseInt(process.env.LOCAL_PORT || '3307', 10);
    const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

    sshClient.on('ready', () => {
      sshClient.forwardOut(
        '127.0.0.1',  
        localPort, 
        process.env.DB_HOST || '',  
        dbPort,  
        async (err, stream) => {
          if (err) return reject(err);

          const dbConnection = await mysql.createConnection({
            host: '127.0.0.1', 
            port: localPort, 
            user: process.env.DB_USER || '',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || '',
            stream,
          });

          resolve(dbConnection);
        }
      );
    });

    sshClient.connect({
      host: process.env.SSH_HOST || '',
      port: 22,
      username: process.env.SSH_USER || '',
      privateKey: fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH || ''),
    });
  });
}
