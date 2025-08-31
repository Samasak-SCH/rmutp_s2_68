import { serve } from "@hono/node-server";
import app from "./app.js";

serve(app, (info) => {
    console.log(`Server is running on port ${info.port}`);
});