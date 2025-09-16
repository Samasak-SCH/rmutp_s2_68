// dot env for hiding Secret Key variable
import * as dotenv from 'dotenv';
dotenv.config();
import * as crypto from "crypto";// import all functions in crypto lib
import * as fs from 'fs'; // Import 'fs' module for file system operations

// 
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Random byte Key must be 32 only
const iv = crypto.randomBytes(16); // Random byte Key must be 16 only
console.log("algorithm ", algorithm);
console.log("key ", key.toString('hex'),Buffer.from(key),key.toString('hex').length); // Show key's hex value in the string value+length and use Buffer to protect timeout when encode/decode.
console.log("iv ", iv.toString('hex'),Buffer.from(iv),key.toString('hex').length); // Show iv's value in the string value+length and use Buffer to protect timeout when encode/decode.

// Read .env file
let envContent = fs.readFileSync('.env', 'utf-8');

// Replace existing KEY and IV lines
envContent = envContent.replace(
    /^KEY=.*/m,
    `KEY="${key.toString('hex')}"`
);
envContent = envContent.replace(
    /^IV=.*/m,
    `IV="${iv.toString('hex')}"`
);

// Write the updated content back to the .env file
fs.writeFileSync('.env', envContent);

console.log("New keys generated and updated to .env file.");

// Export somethings from encode to app.ts
export const encode = (data: string): string => {
    try {
        // Read KEY,IV from .env
        const keyFromEnv = process.env.KEY;
        const ivFromEnv = process.env.IV;

        // Convert KEY,IV from string to Buffer
        const keyBuffer = Buffer.from(keyFromEnv, 'hex');
        const ivBuffer = Buffer.from(ivFromEnv, 'hex');

        // Encrypted
        const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
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
        // Read KEY,IV from .env
        const keyFromEnv = process.env.KEY;
        const ivFromEnv = process.env.IV;

        // Convert KEY,IV from string to Buffer
        const keyBuffer = Buffer.from(keyFromEnv, 'hex');
        const ivBuffer = Buffer.from(ivFromEnv, 'hex');

        // Decrypted
        const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
        let decrypted = decipher.update(encryptedData, 'base64', 'utf-8'); // Set to grobal variable
        decrypted += decipher.final('utf-8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return "";
    }
};

export default { encode, decode };