// dot env for hiding Secret Key variable
import * as dotenv from 'dotenv';
dotenv.config();

// Use environment variables from a .env file
const SECURITY_KEY = process.env.SECURITY_KEY as string;

// Export somethings from encode to app.ts
export const encode = () => {
    console.log("encode function called");
    // Add your encoding logic here
    return "encoded data"; // Return function's result
};

// Export somethings from decode to app.ts
export const decode = () => {
    console.log("decode function called");
    // Add your decoding logic here
    return "decoded data";  // Return function's result
};

export default { encode, decode };