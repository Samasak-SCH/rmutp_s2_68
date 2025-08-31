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

export default app;