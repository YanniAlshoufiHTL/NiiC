import express from "express";
import { tokensRouter } from "./routers/tokens-router";
import { usersRouter } from "./routers/users-router";
import { calRouter } from "./routers/cal-router";
import { aetRouter } from "./routers/aet-router";
import { storeRouter } from "./routers/store-router";
import { loginRouter } from "./routers/login-router";
import { modulesRouter } from "./routers/modules-router";

const app = express();
app.use(express.json());

app.use("/", express.static("public"));

app.use("/login", loginRouter);

app.use("/api/tokens", tokensRouter);
app.use("/api/users", usersRouter);
app.use("/api/cals", calRouter);
app.use("/api/aets", aetRouter);
app.use("/api/store", storeRouter);
app.use("/api/modules", modulesRouter);


const port = 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));