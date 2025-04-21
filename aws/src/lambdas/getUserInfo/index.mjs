import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export const handler = async (event) => {
  try {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    let request_body;
    if (event.body) {
      request_body = JSON.parse(event.body);
    } else {
      console.log("No body found");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No body found" }),
      };
    }

    const { UUID } = request_body;

    console.log("Parsed UUID:", UUID);

    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT enc_email, enc_name, enc_phone_num FROM users WHERE uuid = ?', [UUID]);
      await connection.end();
  
      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
  
    } catch (error) {
      console.error("Database error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Database connection failed", error: error.message }),
      };
    }
  } catch (error) {
    console.error("Unhandled error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error"
      }),
    };
  }
};
