import express from "express";
import * as dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { DatabaseService } from "../DatabaseService";

dotenv.config({path: __dirname + "/../../vars/.env"});

export const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    const username = req.body.username;

    if (!req.body.username) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const user = await DatabaseService.instance().getUser(username);

    if (!user) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const calendarId = await DatabaseService.instance().getCalendarId(user.id);

    if (!calendarId) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const aets = await DatabaseService.instance().getAetsFromCalendarId(calendarId);

    res
        .status(StatusCodes.OK)
        .json({id: user.id, username, aets});
})
