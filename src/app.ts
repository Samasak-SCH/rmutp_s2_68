import {Hono} from "hono";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
// Symmetric Encryption
import * as CryptoJS from 'crypto-js';
import { encode, decode } from './security'; // import ฟังก์ชันจาก security.ts

// dot env for hiding Secret Key variable
import * as dotenv from 'dotenv';
dotenv.config();

// Use environment variables from a .env file
const SECRET_KEY = process.env.SECRET_KEY as string;

const prisma = new PrismaClient();

const app = new Hono();

app.get("/", (c) => c.text("Hello world.....My name's Somsak Tubthongdee --> Lab 4 on 31/08/2568"));

app.get("/Profile", async (c) => {
    //Get data from db
    const profiles = await prisma.profile.findMany();

    //Response
    return c.json({
        message:"get data completed",
        data: profiles
    },200);
});

app.get("/Profile/uuidSearch", async (c) => {

    const uuid = "de2170c8-3ca8-4907-82a7-e634953a1857";

    const profile = await prisma.profile.findUnique({
        where: {
            id: uuid,
        },
    });

    if (profile) {

        return c.json({
            message: "UUID was found",
            data: profile
        }, 200);
    } else {

        return c.json({
            message: "UUID was not found",
            data: null
        }, 404);
    }
});

app.post("/Profile", async (c) => {
    //logic to create a new profile
    const body = await c.req.json();
    const { username, password, mobile, cardId } = body;
    // console.log('input of profile ', body);
    // console.log('body.password(original) ', body.password);

    //encode password
    //const passwordHash = await bcrypt.hash(body.password, 13);
    //Encode mobile and cardId by AES
    const encryptedpassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    const encryptedmobile = CryptoJS.AES.encrypt(mobile, SECRET_KEY).toString();
    const encryptedcardId= CryptoJS.AES.encrypt(cardId, SECRET_KEY).toString();
    // console.log('hash.password(after) ', passwordHash);
    //body.password = passwordHash;
    body.password = encryptedpassword;
    // console.log('body.password(replace) ', body);

    //encode mobile
    //body.mobile = Md5.init(body.mobile);
    body.mobile = encryptedmobile;
    
    //encode cardId
    //body.cardId = Md5.init(body.cardId);
    body.cardId = encryptedcardId;

    //data before save
    console.log('data before save ', body);
    // return c.json({
    //     message: "data before save",
    //     data: body
    // });
    
    //save to db
    body.status= false;
    const result = await prisma.profile.create({
        data: body
    })
    .then(data => { 
        delete data.password;
        console.log('create profile completed', data);
        return data;
    })
    .catch(err => {
        console.log(`create profile failed `, JSON.stringify(err?.message));
        // switch case error message
        return "please recheck username, mobile or cardId";
    });

    //output response
    return c.json({
        message: "create profile completed",
        data: result
    });
});


app.get("/Profile/:id", async (c) => {
    //get some data from db
    const id = c.req.param('id');
    console.log('id ', id);
    const profile = await prisma.profile.findFirstOrThrow({
        where: {
            
            id: id
        }
    });
    //delete profile.password;

    const decryptedpassword = CryptoJS.AES.decrypt(profile.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const decryptedmobile = CryptoJS.AES.decrypt(profile.mobile, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const decryptedcardId= CryptoJS.AES.decrypt(profile.cardId, SECRET_KEY).toString(CryptoJS.enc.Utf8);

    // Create a new object with the decrypted data and without the password
    const decryptedProfile = {
            id: profile.id,
            username: profile.username,
            password: decryptedpassword,
            mobile: decryptedmobile,
            cardId: decryptedcardId,
    };

    return c.json({
        message: "get data completed",
        data: decryptedProfile
    }, 200);
});

app.post("/Login", async (c) => {
    const body = await c.req.json();
    console.log('input of login ', body);

    // process ?
    // 1. find user by username
    const user = await prisma.profile.findUnique({
        select: { password: true },
        where: {
            username: body.username
        }
    });
    console.log('user info ', user);
    // 2. compare password
    const userPassword = await bcrypt.hash(user?.password ?? '', 13);
    const isMatch = await bcrypt.compare(body.password, user?.password ?? '');
    console.log('isMatch ', isMatch);
    return c.json({
        message: "login completed",
        data: isMatch,
        user: user?.password,
        hash: userPassword
    });
});

// New encode-decode by Crypto on 14-09-2025

app.post("/encode", async (c) => {
    //logic to create a new profile
    const body = await c.req.json();
    const { username, password, mobile, cardId } = body;

    // Encode Password & cardID
    const encryptedPass = encode(password);
    const encryptedCardID = encode(cardId);
    
    body.username = username;
    body.password = encryptedPass;
    body.mobile = mobile;
    body.cardId = encryptedCardID;

    body.status= false;
    const result = await prisma.profile.create({
        data: body
    })
    .then(data => { 
        delete data.password; // Not show password
        delete data.cardId; // Not show cardId
        console.log('create profile completed', data);
        return data;
    })
    .catch(err => {
        console.log(`create profile failed `, JSON.stringify(err?.message));
        // switch case error message
        return "please recheck username, mobile or cardId";
    });

    return c.json({
        message: "Encode and create profile completed",
        data: result,
        encrypted_password: encryptedPass,
        encrypted_card_id: encryptedCardID
    });
});

/*
app.post("/decode", async (c) => {
    const body = await c.req.json(); // For POST if you want
    const { encryptedPassword, encryptedCardID } = body;

    // Decode Password and CardID
    const decryptedPass = decode(encryptedPassword);
    const decryptedCardID = decode(encryptedCardID);

    return c.json({
        message: "Decode completed",
        decrypted_password: decryptedPass,
        decrypted_card_id: decryptedCardID
    });
});
*/

app.get("/decode/:id", async (c) => {
    try {
        const id = c.req.param('id');
        console.log('id ', id);

        const profile = await prisma.profile.findFirstOrThrow({
            where: {
                id: id
            }
        });

        // Encrypt
        const encryptedPassword = profile.password; 
        const encryptedCardID = profile.cardId;
        
        // Check Data
        if (!encryptedPassword || !encryptedCardID) {
            return c.json({
                message: "Missing encrypted data in database record."
            }, 404);
        }

        // Decode Password and CardID
        const decryptedPass = decode(encryptedPassword);
        const decryptedCardID = decode(encryptedCardID);

        return c.json({
            message: "The ID was found in the database record and successfully decrypted",
            decrypted_password: decryptedPass,
            decrypted_card_id: decryptedCardID
        });

    } catch (e) {
        console.error('Decryption failed:', e);
        return c.json({
            message: "Decryption failed. Please check your data.",
            error: e.message
        }, 500);
    }
});

export default app;