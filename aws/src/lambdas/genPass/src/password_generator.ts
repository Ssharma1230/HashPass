import { CalculateSalts } from './salt_calculator';
import { hashText, extractHash } from './hashing_tool_server';


const securityAnswers: string[] = [
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
];


export async function calculatePassword(argon2_salt:string) : Promise<string>{
    
    const db_val = "test_db_val" // FETCH THIS FROM DB. THIS IS WHAT WILL BE USED FOR CALCULATING CUSTOM SALT INDICIES

    const enc_name = "Name";
    const enc_email = "name@gmail.com"
    const enc_phone = "5555555555"
    const site_domain = "amazon.com"

    const prepped_salt = db_val + "-" + argon2_salt;
            
    const hashed_name = await extractHash((await hashText(enc_name, prepped_salt)).body);
    const hashed_email = await extractHash((await hashText(enc_email, prepped_salt)).body);
    const hashed_phone = await extractHash((await hashText(enc_phone, prepped_salt)).body);
    const hashed_domain = await extractHash((await hashText(site_domain, prepped_salt)).body);

    const salt_indicies = await CalculateSalts(db_val);

    /*const salt1 = await hashText(securityAnswers[salt_indicies[0]])
    const salt2 = await hashText(securityAnswers[salt_indicies[1]])
    const salt3 = await hashText(securityAnswers[salt_indicies[2]])*/
    const salt1 = securityAnswers[salt_indicies[0]];
    const salt2 = securityAnswers[salt_indicies[1]];
    const salt3 = securityAnswers[salt_indicies[2]];

    console.log(salt_indicies)

    const arranged_string = hashed_name+salt2+hashed_phone+salt1+hashed_domain+salt3+hashed_email;
    const fullHash = await hashText(arranged_string, prepped_salt);
    const extractedHash = extractHash(fullHash.body);
    console.log(fullHash)
    console.log(extractedHash)

    return extractedHash;
}