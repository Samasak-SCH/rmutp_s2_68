import {Hono} from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello world.....My name's Somsak Tubthongdee"));

export default app;