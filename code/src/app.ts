import express from "express";
import {tokensRouter} from "./routers/tokens-router";
import {usersRouter} from "./routers/users-router";
import {calRouter} from "./routers/cal-router";
import {aetRouter} from "./routers/aet-router";
import {storeRouter} from "./routers/store-router";

const app = express();
app.use(express.json());    // parse JSON data and places result in req.body

app.use("/", express.static("public"));

app.use("/api/tokens", tokensRouter);
app.use("/api/users", usersRouter);
app.use("/api/cal", calRouter);
app.use("/api/aet", aetRouter);
app.use("/api/store", storeRouter);

app.listen(3000, function () {
    console.log("Server listening on port 3000 ...");
});