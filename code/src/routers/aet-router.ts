import express from "express";

import { StatusCodes } from "http-status-codes";
import { Client } from 'pg';
import NiicAetNoId from "../be-models/NiicAetNoId";
import { DatabaseService } from "../DatabaseService";

const client = new Client({
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 5432),
    ssl: true,
});
let connected = false;

async function getClient() {
    if (!connected) {
        await client.connect();
        connected = true;
    }
    return client;
}

export const aetRouter = express.Router();

aetRouter.get("/", async (_, res) => {
    try {
        res
            .status(StatusCodes.OK)
            .send(await DatabaseService.instance().getAets());
    } catch (e) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

aetRouter.post("/", async (req, res) => {
    try {
        const {title, description, date, startTime, endTime, type, color, calendarId} = req.body;

        const result = await DatabaseService.instance().addAet(
            calendarId,
            title,
            description,
            new Date(date),
            +startTime,
            +endTime,
            type,
            color
        )

        if (!result) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        res.status(StatusCodes.CREATED).send({id: result});
    } catch (e) {
        console.error("Error while adding AET:", e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});


aetRouter.put("/:id", async (req, res) => {
    console.log(new Date(req.body.date));

    const id = getId(req.params.id);
    if (id === -1) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const aetInp = req.body;

    if (!(aetInp satisfies NiicAetNoId)) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const aetNoId: NiicAetNoId = aetInp;

    try {
        await DatabaseService.instance().updateAet(id, aetNoId);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

aetRouter.delete("/:id", async (req, res) => {
    const id = getId(req.params.id);
    if (id === -1) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try {
        await DatabaseService.instance().removeAet(id);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
});

aetRouter.post('/', async (req, res) => {
    let cl;
    try {
        cl = await getClient();
    } catch (e) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        return;
    }
    try {
        const aet: NiicAetNoId = {
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            startTime: +req.body.startTime,
            endTime: +req.body.endTime,
            type: req.body.type,
            color: req.body.color,
        }
        const result = await cl.query(
            `
                INSERT INTO aet (name, description, date, type, timebegin, timeend, color, calenderid)
                VALUES ($1::varchar, $2::text, $3::date, $4::varchar, $5::numeric, $6::numeric, $7::varchar, $8::bigint)
                RETURNING aet.id
            `,
            [aet.title, aet.description, aet.date, aet.type, aet.startTime, aet.endTime, aet.color, +req.body.calenderid]
        );
        res.status(StatusCodes.CREATED).send({id: +result.rows[0].id});
    } catch (e) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }


})

/**
 * Returns the ID from the given string or -1 if invalid.
 * @param {number} id The ID string to parse.
 * @returns {number} The ID or -1.
 */
function getId(id: string): number {
    const pattern = /^\d+$/;
    return pattern.test(id) ? +id : -1;
}