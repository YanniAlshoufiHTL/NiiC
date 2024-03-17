"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokens_router_1 = require("./routers/tokens-router");
const users_router_1 = require("./routers/users-router");
const cal_router_1 = require("./routers/cal-router");
const aet_router_1 = require("./routers/aet-router");
const store_router_1 = require("./routers/store-router");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", express_1.default.static("public"));
app.use("/api/tokens", tokens_router_1.tokensRouter);
app.use("/api/users", users_router_1.usersRouter);
app.use("/api/cal", cal_router_1.calRouter);
app.use("/api/aet", aet_router_1.aetRouter);
app.use("/api/store", store_router_1.storeRouter);
const port = 3000;
app.listen(port, function () {
    console.log(`Server listening on port ${port} ...`);
});
