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
exports.modulesRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const DatabaseService_1 = require("../DatabaseService");
const dotenv = __importStar(require("dotenv"));
const pg_1 = require("pg");
dotenv.config({ path: __dirname + "/../../vars/.env" });
exports.modulesRouter = express_1.default.Router();
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
// Create new block module
exports.modulesRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let modRequestCastTry = null;
    try {
        modRequestCastTry = req.body;
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    const modRequest = modRequestCastTry;
    try {
        modRequest.type = "blm";
        const id = yield DatabaseService_1.DatabaseService.instance().addMod(modRequest);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .send({ id });
    }
    catch (e) {
        console.error(e);
        //? already exists
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Edit block module
exports.modulesRouter.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let modRequestCastTry = null;
    try {
        modRequestCastTry = req.body;
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    const modRequest = modRequestCastTry;
    modRequest.type = "blm";
    try {
        yield DatabaseService_1.DatabaseService.instance().updateMod(modRequest);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Get all published block modules
exports.modulesRouter.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mods = yield DatabaseService_1.DatabaseService.instance().getPublishedMods();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send(mods);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Get all installed plugins for user
exports.modulesRouter.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = +req.params.userId;
    if (userId !== 0 && !userId) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    try {
        const mods = yield DatabaseService_1.DatabaseService.instance().getInstalledMods(userId);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send(mods);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Delete block module
exports.modulesRouter.delete('/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        yield DatabaseService_1.DatabaseService.instance().removeMod(token);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Install plugin
exports.modulesRouter.put("/:blockmoduleid/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    try {
        const blockmodule = yield client.query('SELECT id FROM blockmodule WHERE id=$1::BIGINT', [req.params.blockmoduleid]);
        const user = yield client.query('SELECT id FROM niicuser WHERE id=$1::BIGINT', [req.params.userid]);
        yield client.query(`
                INSERT INTO installedplugin (niicuserdid, blockmoduleid)
                VALUES ($1::BIGINT, $2::BIGINT)
            `, [user.rows[0].id, blockmodule.rows[0].id]);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Uninstall plugin
exports.modulesRouter.delete('/:blockmoduleid/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getClient();
    try {
        const blockmodule = yield client.query('SELECT id FROM blockmodule WHERE id=$1::BIGINT', [req.params.blockmoduleid]);
        const user = yield client.query('SELECT id FROM niicuser WHERE id=$1::BIGINT', [req.params.userid]);
        yield client.query(`
                    DELETE
                    FROM installedplugin
                    WHERE niicuserdid = $1::BIGINT
                      AND blockmoduleid = $2::BIGINT
            `, [user.rows[0].id, blockmodule.rows[0].id]);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Publish plugin
exports.modulesRouter.put("/publish", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const client = yield getClient();
        yield client.query(`
                    UPDATE blockmodule
                    SET published = true
                    WHERE token = $1::varchar(40)
            `, [token]);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
// Unpulbish plugin
exports.modulesRouter.put("/unpublish", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const client = yield getClient();
        yield client.query(`
                    UPDATE blockmodule
                    SET published = false
                    WHERE token = $1::varchar(40)
            `, [token]);
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
