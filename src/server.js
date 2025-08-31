"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_server_1 = require("@hono/node-server");
var app_js_1 = require("./app.js");
(0, node_server_1.serve)(app_js_1.default, function (info) {
    console.log("Server is running on port ".concat(info.port));
});
