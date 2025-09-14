import * as crypto from "crypto";// import all functions in crypto lib

/* Key Component
 * data
 * algorithm
 * key
 * iv
 */

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Random byte Key must be 32 only
const iv = crypto.randomBytes(16);
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