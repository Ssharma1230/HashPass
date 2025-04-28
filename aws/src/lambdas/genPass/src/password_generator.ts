import { CalculateSalts } from './salt_calculator';
import { hashText, extractHash } from './hashing_tool_server';
import { createConnection } from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  };

export async function getUserInfoFromDB(enc_user_id: string){
    try {
        const connection = await createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT uuid, enc_email, enc_name, enc_phone_num FROM users WHERE enc_uuid = ?', [enc_user_id]);
        await connection.end();
    
        return {
          statusCode: 200,
          body: JSON.stringify(rows),
        };
    
      } catch (error) {
        console.error("Database error:", error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Database connection failed", error: error }),
        };
      }
}

export async function getQuestionResponses(enc_user_id: string){
    try {
        const connection = await createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT enc_question1, enc_question2, enc_question3, enc_question4, enc_question5, enc_question6, enc_question7, enc_question8, enc_question9, enc_question10 FROM sec_questions WHERE enc_uuid = ?', [enc_user_id]);
        await connection.end();
    
        return {
          statusCode: 200,
          body: JSON.stringify(rows),
        };
    
      } catch (error) {
        console.error("Database error:", error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Database connection failed", error: error }),
        };
      }
}

/*const securityAnswers: string[] = [
    "Fluffy", // Answer to: "What was the name of your first pet?"
    "Maple Street", // Answer to: "What street did you grow up on?"
    "Blue", // Answer to: "What is your favorite color?"
    "Toyota Corolla", // Answer to: "What was your first car?"
    "Mrs. Thompson", // Answer to: "Who was your favorite teacher?"
    "Pizza", // Answer to: "What is your favorite food?"
    "1985", // Answer to: "What year was your father born?"
    "Hawaii", // Answer to: "Where did you go on your honeymoon?"
    "Superman", // Answer to: "Who is your childhood hero?"
    "Beethoven", // Answer to: "What is your favorite composer or musician?"
];*/



export async function calculatePassword(argon2_salt:string, domain_name: string, encrypted_userid:string) : Promise<string>{
    
    // Gets user info from the db
    const db_response_userinfo = (await getUserInfoFromDB(encrypted_userid));
    console.log("Db response: ", db_response_userinfo);

    const users = JSON.parse(db_response_userinfo.body) as Array<{
        uuid: string;
        enc_email: string | null;
        enc_name: string | null;
        enc_phone: string | null;
    }>;

    const user = users[0];
    if (!user) {
        throw new Error('No user found');
    }

    const { uuid, enc_email, enc_name, enc_phone } = user;

    console.log('UUID:', uuid);
    console.log('Email hash:', enc_email);
    console.log('Name hash:', enc_name);
    console.log('Phone hash:', enc_phone);

    // Gets the answers to the security questions from db
    const db_response_secques = (await getQuestionResponses(encrypted_userid));
    console.log("Db response of questions: ", db_response_secques);

    const answers = JSON.parse(db_response_userinfo.body) as Array<{
        q1: string;
        q2: string;
        q3: string;
        q4: string;
        q5: string;
        q6: string;
        q7: string;
        q8: string;
        q9: string;
        q10: string;
    }>;

    const qanswer = answers[0];
    if (!qanswer) {
        throw new Error('No user found');
    }

    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10} = qanswer;
    const securityAnswers: string[] = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];


    const prepped_salt = domain_name + "-" + encrypted_userid + "-" + argon2_salt;


    const salt_indicies = await CalculateSalts(encrypted_userid);

    /*const salt1 = await hashText(securityAnswers[salt_indicies[0]])
    const salt2 = await hashText(securityAnswers[salt_indicies[1]])
    const salt3 = await hashText(securityAnswers[salt_indicies[2]])*/
    const salt1 = securityAnswers[salt_indicies[0]];
    const salt2 = securityAnswers[salt_indicies[1]];
    const salt3 = securityAnswers[salt_indicies[2]];

    console.log(salt_indicies)

    //const arranged_string = hashed_name+salt2+hashed_phone+salt1+hashed_domain+salt3+hashed_email;
    const arranged_string = enc_name+salt2+enc_phone+salt1+domain_name+salt3+enc_email;
    const fullHash = await hashText(arranged_string, prepped_salt);
    const extractedHash = extractHash(fullHash.body);
    console.log(fullHash)
    console.log(extractedHash)

    return extractedHash;
}