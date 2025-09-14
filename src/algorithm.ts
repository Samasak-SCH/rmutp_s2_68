import * as crypto from "crypto";// import all functions in crypto lib
import * as fs from "fs";// import File system lib
import * as dotenv from 'dotenv';// import dotenv

/* Key Component
 * algorithm
 * key
 * iv
 */

// Function to write keys to the .env file
const writeKeysToEnv = (key: Buffer, iv: Buffer) => {
    const envContent = `SECRET_KEY=${key.toString('hex')}\nIV=${iv.toString('hex')}`;
    fs.writeFileSync('.env', envContent, { flag: 'w' });
    console.log("Keys have been written to the .env file.");
};

const algorithm = "aes-256-cbc";

// Check if keys exist in .env; if not, generate new ones and save them
let key: Buffer;
let iv: Buffer;

if (process.env.SECRET_KEY && process.env.IV) {
    key = Buffer.from(process.env.SECRET_KEY, 'hex');
    iv = Buffer.from(process.env.IV, 'hex');
    console.log("Using keys from .env file.");
} else {
    // Generate new keys
    key = crypto.randomBytes(32);
    iv = crypto.randomBytes(16);
    writeKeysToEnv(key, iv);
    console.log("Generated new keys and wrote them to .env.");
}
const password = "MyVerySecurePassword";

console.log("algorithm ", algorithm);
console.log("key ", key.toString('hex'),Buffer.from(key),key.toString('hex').length); // Show key's hex value in the string value+length and use Buffer to protect timeout when encode/decode.
console.log("iv ", iv.toString('hex'),Buffer.from(iv),key.toString('hex').length); // Show iv's value in the string value+length and use Buffer to protect timeout when encode/decode.
console.log("password ", password);

const encodeCipher = crypto.createCipheriv(algorithm, key, iv); // Selcet Cipheriv technic to encode
// console.log("encodeCipher ", encodeCipher);
const encrypted = encodeCipher.update(password, 'utf-8', 'base64');// Encode Data --> UTF-8 --> Base64
const final = encrypted + encodeCipher.final('base64');
console.log("encrypted(final)", final, final.length);

const decodeCipher = crypto.createDecipheriv(algorithm, key, iv);
// console.log("decodeCipher ", decodeCipher);
const decrypted = decodeCipher.update(final, 'base64', 'utf-8');// Encode Data --> Base64 --> UTF-8
const d_final = decrypted + decodeCipher.final('utf-8');
console.log("decrypted(final) ", d_final,d_final.length);