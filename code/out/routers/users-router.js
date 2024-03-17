"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const client = new pg_1.Client({
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
exports.usersRouter = express_1.default.Router();
exports.usersRouter.get('/', async (req, res) => {
    const username = req.body.username;
    const client = await getClient();
    const user = await client.query('SELECT * FROM niicuser WHERE username = $1::text', [username]);
    if (user.rows.length > 0) {
        const id = user.rows[0].id;
        const aets = await client.query('SELECT * FROM aet WHERE calenderid = $1::text', [id]);
        const aet = aets.rows.map(rows => ({
            id: rows.id,
            title: rows.title,
            description: rows.description,
            date: rows.date,
            startTime: rows.startTime,
            endTime: rows.endTime,
            type: rows.type,
            color: rows.color
        }));
        res.json({ username, aet });
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
