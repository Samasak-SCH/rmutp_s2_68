import { serve } from "@hono/node-server";
import app from "./app.js";

const desiredPort = 3001;

serve({
    fetch: app.fetch,
    port: desiredPort
}, (info) => {
    console.log(`Server is running on port ${info.port}`);
});