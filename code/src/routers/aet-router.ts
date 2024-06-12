import express from "express";

import { StatusCodes } from "http-status-codes";
import NiicAetNoId from "../be-models/NiicAetNoId";
import { DatabaseService } from "../DatabaseService";

export const aetRouter = express.Router();

aetRouter.get("/", async (_, res) => {
    try {
        const aets = await DatabaseService.instance().getAets()
        res
            .status(StatusCodes.OK)
            .send(aets);
    } catch (e) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

aetRouter.post("/", async (req, res) => {
    try {
        const aetNoId = convertBodyToAetNoId(req.body);
        const calendarId = getCalendarIdFromBody(req.body);

        if (!aetNoId || !calendarId) {
            console.error("Invalid body: ", req.body)
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        const result = await DatabaseService.instance().addAet(
            calendarId,
            aetNoId.title,
            aetNoId.description,
            aetNoId.date,
            aetNoId.startTime,
            aetNoId.endTime,
            aetNoId.type,
            aetNoId.color,
        );

        if (!result) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        res.
            status(StatusCodes.CREATED)
            .send({id: result});
    } catch (e) {
        console.error("Error while adding AET:", e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});


aetRouter.put("/:id", async (req, res) => {
    const id = getId(req.params.id);
    if (id === -1) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const aetNoId = convertBodyToAetNoId(req.body);

    if (aetNoId === false) {
        console.error("Invalid body: ", req.body)
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

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

// aetRouter.post('/', async (req, res) => {
//     try {
//         const aetNoId = convertBodyToAetNoId(req.body);
//         const calendarId = getCalendarIdFromBody(req.body);
//
//         if (!aetNoId || !calendarId) {
//             console.error("Invalid body: ", req.body)
//             res.sendStatus(StatusCodes.BAD_REQUEST);
//             return;
//         }
//
//         const id = await DatabaseService.instance().addAet(
//             calendarId,
//             aetNoId.title,
//             aetNoId.description,
//             aetNoId.date,
//             aetNoId.startTime,
//             aetNoId.endTime,
//             aetNoId.type,
//             aetNoId.color
//         );
//
//         if (id === undefined) {
//             res.sendStatus(StatusCodes.BAD_REQUEST);
//             return;
//         }
//
//         res
//             .status(StatusCodes.CREATED)
//             .send({id});
//     } catch (e) {
//         res.sendStatus(StatusCodes.BAD_REQUEST);
//     }
//
//
// })

/**
 * Returns the ID from the given string or -1 if invalid.
 * @param {number} id The ID string to parse.
 * @returns {number} The ID or -1.
 */
function getId(id: string): number {
    const pattern = /^\d+$/;
    return pattern.test(id) ? +id : -1;
}

function getCalendarIdFromBody(body: any): number | false {
    if (
        body.calendarid && /^\d+$/.test(body.calendarid.toString()) ||
        body.calendarId && /^\d+$/.test(body.calendarId.toString())
    ) {
        if (body.calendarid) {
            return +body.calendarid;
        }

        return +body.calendarId;
    }
    else if (typeof body.calendarid === "number" || typeof body.calendarId === "number") {
        if (body.calendarid) {
            return body.calendarid;
        }
        return body.calendarId;
    }

    return false;
}

function convertBodyToAetNoId(body: any): NiicAetNoId | false {
    const stringTypeString = "string";

    if (
        body.title && typeof body.title === stringTypeString &&
        body.description !== undefined && body.description !== null && typeof body.description === stringTypeString &&
        (body.date && typeof body.date === stringTypeString || body.date instanceof Date) &&
        body.startTime !== undefined && body.startTime !== null &&
        body.endTime !== undefined && body.endTime !== null &&
        body.type && typeof body.type === stringTypeString &&
        body.color && typeof body.color === stringTypeString &&
        body.calendarId !== undefined && body.calendarId !== null &&
        (typeof body.calendarId === stringTypeString && /\d+/.test(body.calendarId) || typeof body.calendarId === "number" ) &&

        !isNaN(Date.parse(body.date)) &&
        (body.type === "event" || body.type === "appointment" || body.type === "task") &&
        /^#(\d|[a-f]){6}$/.test(body.color)
    ) {
        return {
            title: body.title,
            description: body.description,
            date: new Date(body.date),
            startTime: +body.startTime,
            endTime: +body.endTime,
            type: body.type,
            color: body.color,
            calendarId: +body.calendarId
        };
    }

    return false;
}