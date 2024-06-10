import express from "express";
import * as dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { DatabaseService } from "../DatabaseService";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import NiicAet from "../be-models/NiicAet";

dotenv.config({path: __dirname + "/../../vars/.env"});

export const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!req.body.username || !req.body.password) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const shouldUserBeLoggedIn = await DatabaseService.instance().shouldLogIn(username, password);

    if (shouldUserBeLoggedIn instanceof Error) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    if (!shouldUserBeLoggedIn) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }

    const user = await DatabaseService.instance().getUser(username);

    if (!user) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        return;
    }

    const calendarId = await DatabaseService.instance().getCalendarId(user.id);

    if (!calendarId) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const aets = await DatabaseService.instance().getAetsFromCalendarId(calendarId);
    const minutes = 30;
    const expiresAt = new Date(Date.now() + minutes * 60000);
    const secretKey = process.env.SECRET_KEY;

    if(!secretKey) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        return;
    }

    const token = jwt.sign(
        {
            user: user.id,
            exp: expiresAt.getTime() / 1000,
        },
        secretKey
    );

    res.status(StatusCodes.OK)
        .json({id: user.id, username, aets, jwt: token});
})

loginRouter.post('/sign-up', async (req, res) => {

    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        await DatabaseService.instance().addUser(username, password);
        console.log(req.body);
        const user = await DatabaseService.instance().getUser(username);

        if (!user) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        const minutes = 30;
        const expiresAt = new Date(Date.now() + minutes * 60000);
        const secretKey = process.env.SECRET_KEY;

        if(!secretKey) {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            return;
        }

        const token = jwt.sign(
            {
                user: user.id,
                exp: expiresAt.getTime() / 1000,
            },
            secretKey
        );

        const aets: NiicAet[] = [];

        res.status(StatusCodes.OK).json({id: user.id, username, aets, jwt: token});

    } catch (e) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        return;
    }
})