import {Hono} from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello world.....My name's Somsak Tubthongdee"));
app.get("/Profile", (c) => c.text("Profile"));

export default app;