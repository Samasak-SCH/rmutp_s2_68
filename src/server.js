"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_server_1 = require("@hono/node-server");
var app_js_1 = require("./app.js");
var desiredPort = 3001;
(0, node_server_1.serve)({
    fetch: app_js_1.default.fetch,
    port: desiredPort
}, function (info) {
    console.log("Server is running on port ".concat(info.port));
});
