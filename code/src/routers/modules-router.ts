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

// Get all published block modules
modulesRouter.get("/", async (_, res) => {
    try {
        const mods = await DatabaseService.instance().getPublishedMods();
        res
            .status(StatusCodes.OK)
            .send(mods);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
})

// Get all installed plugins for user
modulesRouter.get("/:userId", async (req, res) => {
    const userId: number = +req.params.userId;

    if (userId !== 0 && !userId) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try {
        const mods = await DatabaseService.instance().getInstalledMods(userId);
        res
            .status(StatusCodes.OK)
            .send(mods);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

// Delete block module
modulesRouter.delete('/:token', async (req, res) => {
    const token: string = req.params.token;

    try {
        await DatabaseService.instance().removeMod(token);

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e)
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

// Install plugin
modulesRouter.put("/:blockmoduleid/:userid", async (req, res) => {
    const ids = getModIdAndUserId(req.params.blockmoduleid, req.params.userid);
    if (!ids) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try {
        await DatabaseService.instance().installPlugin(ids.userId, ids.blockModuleId)
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }
});

// Uninstall plugin
modulesRouter.delete('/:blockmoduleid/:userid', async (req, res) => {
    const ids = getModIdAndUserId(req.params.blockmoduleid, req.params.userid);

    if (!ids) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try {
        await DatabaseService.instance().uninstallPlugin(ids.userId, ids.blockModuleId);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

function getModIdAndUserId(blockModuleId: any, userId: any): {
    blockModuleId: number,
    userId: number,
} | false {
    if (!blockModuleId || !userId || !/\d+/.test(blockModuleId) || !/\d+/.test(userId)) {
        return false;
    }

    return {
        blockModuleId: +blockModuleId,
        userId: +userId,
    }
}

// Publish plugin
modulesRouter.put("/publish", async (req, res) => {
    try {
        const token: string = req.body.token;
        await DatabaseService.instance().publishMod(token);

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

// Unpulbish plugin
modulesRouter.put("/unpublish", async (req, res) => {
    try {
        const token: string = req.body.token;
        await DatabaseService.instance().unpublishMod(token);

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});