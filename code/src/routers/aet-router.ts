import express from "express";
import { StatusCodes } from "http-status-codes";
import { DatabaseService } from "../DatabaseService";
import NiicAetNoId from "../be-models/NiicAetNoId";

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

aetRouter.put("/:id", async (req, res) => {
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

/**
 * Returns the ID from the given string or -1 if invalid.
 * @param {number} id The ID string to parse.
 * @returns {number} The ID or -1.
 */
function getId(id: string): number {
    const pattern = /^\d+$/;
    return pattern.test(id) ? +id : -1;
}