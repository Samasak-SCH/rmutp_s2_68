import {Hono} from "hono";
import { PrismaClient } from "@prisma/client";

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

export default app;