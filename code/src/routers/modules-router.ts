import express from "express";
import NiicBlockModuleNoId from "../be-models/NiicBlockModuleNoId";
import { StatusCodes } from "http-status-codes";
import { DatabaseService } from "../DatabaseService";

export const modulesRouter = express.Router();

// Create new block module
modulesRouter.post('/', async (req, res) => {
    let modRequestCastTry: NiicBlockModuleNoId | null = null;
    try {
        modRequestCastTry = req.body;
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const modRequest: NiicBlockModuleNoId = modRequestCastTry!;

    try {
        modRequest.type = "blm";
        const id = await
            DatabaseService.instance().addMod(modRequest);

        res
            .status(StatusCodes.CREATED)
            .send({id});
    } catch (e) {
        console.error(e);
        //? already exists
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

// Edit block module
modulesRouter.put('/', async (req, res) => {
    let modRequestCastTry: NiicBlockModuleNoId | null = null;
    try {
        modRequestCastTry = req.body;
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const modRequest: NiicBlockModuleNoId = modRequestCastTry!;
    modRequest.type = "blm";

    try {
        await
            DatabaseService.instance().updateMod(modRequest);

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

// Delete block module
modulesRouter.delete('/:token', async (req, res) => {
    const token: string = req.params.token;

    try {
        await
            DatabaseService.instance().removeMod(token);

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e)
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});