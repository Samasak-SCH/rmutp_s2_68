import {Hono} from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Hono();

app.get("/", (c) => c.text("Hello world.....My name's Somsak Tubthongdee --> Lab 4 on 31/08/2568"));

//Get data from db
const profiles = prisma.profile.findMany();

//Response
app.get("/Profile", (c) => {
    return c.json({
        message:"get data completed",
        data: profiles
    },200);
});

export default app;