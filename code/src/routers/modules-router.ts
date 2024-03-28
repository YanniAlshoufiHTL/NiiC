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
modulesRouter.get("/",async (req, res) => {
    const client = await getClient();
    const blockmodules= await client.query('SELECT title,description from blockmodule');
    const plugin = blockmodules.rows.map(module=>({
        title: module.title,
        description: module.description
    }))
    res.json(plugin)
})


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

modulesRouter.put("/:blockmoduleid/:userid",async (req, res) => {
    const client=await getClient();
    try {
        const blockmodule = await client.query('SELECT id FROM blockmodule WHERE id=$1::BIGINT',[req.params.blockmoduleid]);
        const user= await client.query('SELECT id FROM niicuser WHERE id=$1::BIGINT',[req.params.userid]);
        await client.query(
            `
                INSERT INTO installedplugins (niicuserdid, blockmoduleid)
                VALUES ($1::BIGINT,$2::BIGINT)
               
            `,
            [user.rows[0].id,blockmodule.rows[0].id]
        );
         res.sendStatus(StatusCodes.ACCEPTED);
    }catch (e) {
        console.error("Error occurred:", e);
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }

})
modulesRouter.delete('/:blockmoduleid/:userid',async (req, res) => {
    const client= await getClient();
    try {
        const blockmodule = await client.query('SELECT id FROM blockmodule WHERE id=$1::BIGINT',[req.params.blockmoduleid]);
        const user= await client.query('SELECT id FROM niicuser WHERE id=$1::BIGINT',[req.params.userid]);

        await client.query( `
            DELETE FROM installedplugins 
            WHERE niicuserdid = $1::BIGINT AND blockmoduleid = $2::BIGINT
        `,
            [user.rows[0].id, blockmodule.rows[0].id]
        );
        res.sendStatus(StatusCodes.ACCEPTED);
    }catch (e) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }

})

modulesRouter.put("/publish",async (req, res) => {
    const token:string = req.body.token;
    const client=await getClient();
    const searchedBlockmodule = await client.query('SELECT * FROM blockmodule WHERE token = $1::varchar(40)',[token]);
    await client.query('UPDATE blockmodule SET published = true WHERE token = $1::varchar(40)',[token])
    res.send(searchedBlockmodule.rows[0]);
})
modulesRouter.put("/unpublish",async (req, res) => {
    const token:string = req.body.token;
    const client=await getClient();
    const searchedBlockmodule = await client.query('SELECT * FROM blockmodule WHERE token = $1::varchar(40)',[token]);
    await client.query('UPDATE blockmodule SET published = false WHERE token = $1::varchar(40)',[token])
    res.send(searchedBlockmodule.rows[0]);
})