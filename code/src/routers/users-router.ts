import express from "express";
import { DatabaseService } from "../DatabaseService";
import bcrypt = require('bcrypt')
import { OK, StatusCodes } from "http-status-codes";

export const usersRouter = express.Router();

usersRouter.get("/exists/:username", async (req, res) => {
    const username = req.params.username;

    if (username === undefined || username === null) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const doesUserExist = await DatabaseService.instance().userWithUsernameExists(username);

    if (typeof doesUserExist === "string") {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(doesUserExist);
        return;
    }

    res
        .status(StatusCodes.OK)
        .send(doesUserExist ? "true" : "false");
});

usersRouter.delete("/:id", async (req, res) => {
    const id = +req.params.id;
    try {
        await DatabaseService.instance().deleteUser((id));
    } catch (err) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    res.sendStatus(StatusCodes.OK);
});

usersRouter.put("/logout/:id", async (req, res) => {
    try {
        await DatabaseService.instance().logOutUser(+req.params.id);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

usersRouter.post("/login", async (req, res) => {
    try {
        await DatabaseService.instance().shouldLogIn(req.body.name,req.body.password);
        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});