import express from "express";
import NiicBlockModuleNoId from "../be-models/NiicBlockModuleNoId";
import { StatusCodes } from "http-status-codes";
import { DatabaseService } from "../DatabaseService";
import * as dotenv from "dotenv";
import { Client } from 'pg';

dotenv.config({path: __dirname + "/../../vars/.env"});
export const modulesRouter = express.Router();
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
    //
    // const client = await getClient();
    // const blockModules = await client.query(`
    //     SELECT id, title, description, html, css, js
    //     FROM blockmodule
    //     WHERE published = true
    // `);
    //
    // const plugin = blockModules.rows.map(mod => ({
    //     id: +mod.id,
    //     title: mod.title,
    //     description: mod.description,
    //     type: "blm",
    //     additionalInformation:
    //         [
    //             mod.html ? "HTML" : null,
    //             mod.css ? "CSS" : null,
    //             mod.js ? "JS" : null,
    //         ]
    //             .filter(x => x !== null)
    //             .join(" + "),
    // }))
    //
    // res
    //     .status(StatusCodes.OK)
    //     .json(plugin)
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
    const client = await getClient();
    try {
        const blockmodule = await client.query(
            'SELECT id FROM blockmodule WHERE id=$1::BIGINT',
            [req.params.blockmoduleid]
        );
        const user = await client.query(
            'SELECT id FROM niicuser WHERE id=$1::BIGINT',
            [req.params.userid]
        );

        await client.query(
            `
                INSERT INTO installedplugin (niicuserdid, blockmoduleid)
                VALUES ($1::BIGINT, $2::BIGINT)
            `,
            [user.rows[0].id, blockmodule.rows[0].id]
        );
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }
});

// Uninstall plugin
modulesRouter.delete('/:blockmoduleid/:userid', async (req, res) => {
    const client = await getClient();

    try {
        const blockmodule = await client.query(
            'SELECT id FROM blockmodule WHERE id=$1::BIGINT',
            [req.params.blockmoduleid]
        );
        const user = await client.query(
            'SELECT id FROM niicuser WHERE id=$1::BIGINT',
            [req.params.userid]
        );

        await client.query(`
                    DELETE
                    FROM installedplugin
                    WHERE niicuserdid = $1::BIGINT
                      AND blockmoduleid = $2::BIGINT
            `,
            [user.rows[0].id, blockmodule.rows[0].id]
        );
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

// Publish plugin
modulesRouter.put("/publish", async (req, res) => {
    try {
        const token: string = req.body.token;
        const client = await getClient();

        await client.query(`
                    UPDATE blockmodule
                    SET published = true
                    WHERE token = $1::varchar(40)
            `,
            [token]
        );

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
        const client = await getClient();
        await client.query(`
                    UPDATE blockmodule
                    SET published = false
                    WHERE token = $1::varchar(40)
            `,
            [token]
        );

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});