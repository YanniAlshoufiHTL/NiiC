"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
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
    port: +((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : 5432),
    ssl: true,
});
let connected = false;
function getClient() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connected) {
            yield client.connect();
            connected = true;
        }
        return client;
    });
}
exports.aetRouter = express_1.default.Router();
exports.aetRouter.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send(yield DatabaseService_1.DatabaseService.instance().getAets());
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}));
exports.aetRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, date, startTime, endTime, type, color, calendarId } = req.body;
        const result = yield DatabaseService_1.DatabaseService.instance().addAet(calendarId, title, description, new Date(date), +startTime, +endTime, type, color);
        if (!result) {
            res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(http_status_codes_1.StatusCodes.CREATED).send({ id: result });
    }
    catch (e) {
        console.error("Error while adding AET:", e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
exports.aetRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(new Date(req.body.date));
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
        yield DatabaseService_1.DatabaseService.instance().updateAet(id, aetNoId);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
exports.aetRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = getId(req.params.id);
    if (id === -1) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    try {
        yield DatabaseService_1.DatabaseService.instance().removeAet(id);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
}));
exports.aetRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cl;
    try {
        cl = yield getClient();
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        return;
    }
    try {
        const aet = {
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            startTime: +req.body.startTime,
            endTime: +req.body.endTime,
            type: req.body.type,
            color: req.body.color,
        };
        const result = yield cl.query(`
                INSERT INTO aet (name, description, date, type, timebegin, timeend, color, calendarid)
                VALUES ($1::varchar, $2::text, $3::date, $4::varchar, $5::numeric, $6::numeric, $7::varchar, $8::bigint)
                RETURNING aet.id
            `, [aet.title, aet.description, aet.date, aet.type, aet.startTime, aet.endTime, aet.color, +req.body.calenderid]);
        res.status(http_status_codes_1.StatusCodes.CREATED).send({ id: +result.rows[0].id });
    }
    catch (e) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
/**
 * Returns the ID from the given string or -1 if invalid.
 * @param {number} id The ID string to parse.
 * @returns {number} The ID or -1.
 */
function getId(id) {
    const pattern = /^\d+$/;
    return pattern.test(id) ? +id : -1;
}
