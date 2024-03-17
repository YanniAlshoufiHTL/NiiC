"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aetRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const pg_1 = require("pg");
const DatabaseService_1 = require("../DatabaseService");
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
exports.aetRouter = express_1.default.Router();
exports.aetRouter.get("/", async (_, res) => {
    try {
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send(await DatabaseService_1.DatabaseService.instance().getAets());
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
exports.aetRouter.put("/:id", async (req, res) => {
    const id = getId(req.params.id);
    if (id === -1) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    const aetInp = req.body;
    if (!(aetInp)) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    const aetNoId = aetInp;
    try {
        await DatabaseService_1.DatabaseService.instance().updateAet(id, aetNoId);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
});
exports.aetRouter.delete("/:id", async (req, res) => {
    const id = getId(req.params.id);
    if (id === -1) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    try {
        await DatabaseService_1.DatabaseService.instance().removeAet(id);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
});
exports.aetRouter.post('/:username', async (req, res) => {
    const cl = await getClient();
    const name = req.params.username;
    const datas = await cl.query('SELECT * FROM niicuser WHERE username = $1::text', [name]);
    const aet = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        type: req.body.type,
        color: req.body.color
    };
    if (datas.rows.length > 0) {
        const cl = await getClient();
        await cl.query('INSERT INTO aet (name, description, date, type, timebegin, timeend, color, calenderid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [aet.id, aet.description, aet.date, aet.type, aet.startTime, aet.endTime, aet.color, aet.color]);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
/**
 * Returns the ID from the given string or -1 if invalid.
 * @param {number} id The ID string to parse.
 * @returns {number} The ID or -1.
 */
function getId(id) {
    const pattern = /^\d+$/;
    return pattern.test(id) ? +id : -1;
}
