"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_server_1 = require("@hono/node-server");
var app_js_1 = require("./app.js");
// Define the port number you want to use.
var desiredPort = 8089;
// Pass the configuration object directly as the first argument to `serve()`.
(0, node_server_1.serve)({
    fetch: app_js_1.default.fetch,
    port: desiredPort
}, function (info) {
    // This callback function runs when the server successfully starts.
    console.log("Server is running on port ".concat(info.port));
});
