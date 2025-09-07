import {Hono} from "hono";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Md5 } from "md5-typescript";

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
    // console.log('input of profile ', body);
    // console.log('body.password(original) ', body.password);

    //encode password
    const passwordHash = await bcrypt.hash(body.password, 13);
    // console.log('hash.password(after) ', passwordHash);
    body.password = passwordHash;
    // console.log('body.password(replace) ', body);

    //encode mobile
    body.mobile = Md5.init(body.mobile);

    //encode cardId
    body.cardId = Md5.init(body.cardId);

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
    delete profile.password;

    return c.json({
        message: "get data completed",
        data: profile
    }, 200);
});

app.post("/login", async (c) => {
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

export default app;