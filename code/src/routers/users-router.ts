import express from "express";
import {Client } from 'pg';
import NiicAet from "../be-models/NiicAet";
import * as dotenv from "dotenv";


dotenv.config({path: __dirname + "/../vars/.env"});
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

export const usersRouter = express.Router();
usersRouter.get('/',async (req, res) => {
    const username = req.body.username;
    const client= await getClient();
    const user = await client.query('SELECT * FROM niicuser WHERE username = $1::varchar', [ username ]);

    if (user.rows.length > 0) {
        const id= user.rows[0].id;
        const aets = await client.query('SELECT * FROM aet WHERE calenderid = $1::serial',[id])
        const aet:NiicAet[]= aets.rows.map(rows=>({
            id: rows.id,
            title: rows.title,
            description: rows.description,
            date: rows.date,

            startTime: rows.startTime,
            endTime: rows.endTime,

            type: rows.type,

            color: rows.color
        }))
        res.json({username,aet});
        res.sendStatus(200)
    }else {
      res.sendStatus(400);
    }
})