"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
dotenv.config({ path: __dirname + "/../../vars/.env" });
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
exports.loginRouter = express_1.default.Router();
exports.loginRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const client = yield getClient();
    const user = yield client.query('SELECT * FROM niicuser WHERE username = $1::varchar', [username]);
    if (user.rows.length > 0) {
        const id = +user.rows[0].id;
        const aetQuery = yield client.query('SELECT * FROM aet WHERE calendarid = $1::bigint', [id]);
        const aets = aetQuery.rows.map(rows => ({
            id: +rows.id,
            title: rows.name,
            description: rows.description,
            date: new Date(rows.date),
            startTime: +rows.timebegin,
            endTime: +rows.timeend,
            type: rows.type,
            color: rows.color
        }));
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ id, username, aets });
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
