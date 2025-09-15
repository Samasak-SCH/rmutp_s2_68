// dot env for hiding Secret Key variable
import * as dotenv from 'dotenv';
dotenv.config();
import * as crypto from "crypto";// import all functions in crypto lib

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Random byte Key must be 32 only
const iv = crypto.randomBytes(16);
console.log("algorithm ", algorithm);
console.log("key ", key.toString('hex'),Buffer.from(key),key.toString('hex').length); // Show key's hex value in the string value+length and use Buffer to protect timeout when encode/decode.
console.log("iv ", iv.toString('hex'),Buffer.from(iv),key.toString('hex').length); // Show iv's value in the string value+length and use Buffer to protect timeout when encode/decode.

// Export somethings from encode to app.ts
export const encode = (data: string): string => {
    try {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(data, 'utf-8', 'base64'); // Set to grobal variable
        encrypted += cipher.final('base64');
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error);
        return "";
    }
};

// Export somethings from decode to app.ts
export const decode = (encryptedData: string): string => {
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedData, 'base64', 'utf-8'); // Set to grobal variable
        decrypted += decipher.final('utf-8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return "";
    }
};

export default { encode, decode };