import { serve } from "@hono/node-server";
import app from "./app.js";

// Define the port number you want to use.
const desiredPort = 8089;

// Pass the configuration object directly as the first argument to `serve()`.
serve({
    fetch: app.fetch,
    port: desiredPort
}, (info) => {
    // This callback function runs when the server successfully starts.
    console.log(`Server is running on port ${info.port}`);
});