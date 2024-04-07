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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + "/../vars/.env" });
/**
 * Service for interacting with the database.
 * Contains methods for adding, removing, and updating AETs.
 */
class DatabaseService {
    /**
     * Returns the instance of the database service.
     * This method must be invoked each time the service is used.
     */
    static instance() {
        if (this._instance === undefined) {
            this._instance = new DatabaseService();
        }
        return this._instance;
    }
    constructor() {
        /**
         * The local client used for the database interactions.
         * Should never be used directly, use the `client` method instead.
         * @private
         */
        this._client = undefined;
        /**
         * The AETs in the database.
         * Should only be used after invoking the `setAets` method and awaiting or ".then"-ing it.
         * @private
         */
        this._aets = undefined;
        /**
         * The modules in the database.
         * Should only be used after invoking the `setModules` method and awaiting or ".then"-ing it.
         * @private
         */
        this._mods = undefined;
    }
    // endregion
    /**
     * Sets the `_aets` field to the current AETs in the database if not yet set.
     * @private
     */
    setAets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._aets === undefined) {
                const client = yield this.client();
                const res = yield client.query("SELECT * FROM aet");
                this._aets = [];
                res.rows.forEach(row => {
                    this._aets.push({
                        id: row.id,
                        title: row.name,
                        description: row.description,
                        date: new Date(Date.parse(row.date)),
                        startTime: +row.timebegin,
                        endTime: +row.timeend,
                        color: row.color,
                        type: row.type,
                    });
                });
            }
        });
    }
    /**
     * Sets the `_modules` field to the current modules in the database if not yet set.
     * @private
     */
    setMods() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._mods === undefined) {
                const client = yield this.client();
                const res = yield client.query(`
                SELECT id,
                       token,
                       title,
                       description,
                       html,
                       css,
                       js,
                       published
                FROM blockmodule
            `);
                this._mods = [];
                res.rows.forEach(row => {
                    this._mods.push({
                        id: +row.id,
                        token: row.token,
                        title: row.title,
                        description: row.description,
                        type: "blm",
                        html: row.html,
                        css: row.css,
                        js: row.js,
                        published: row.published
                    });
                });
            }
        });
    }
    /**
     * Adds an AET to the database and caches it locally.
     * @param {number} calendarId The ID of the calendar to add the AET to.
     * @param {string} title The title of the AET.
     * @param {string} description The description of the AET.
     * @param {Date} date The date at which the AET takes place.
     * @param {number} startTime The time of the day (0 <= t <= 24) at which the AET starts.
     * @param {number} endTime The time of the day (0 <= t <= 24) at which the AET ends.
     * @param {"appointment" | "event" | "task"} type The type of the AET ("appointment", "event", or "task").
     * @param {string} color The color of the AET as /^#[0-9a-f]{6}$/. (e.g. "#f303ed")
     * @returns {Promise<number | undefined>} The ID of the AET added.
     */
    addAet(calendarId, title, description, date, startTime, endTime, type, color) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            const res = yield client.query(`
            INSERT INTO aet (name, description, date, timebegin, timeend, type, color, calendarid)
            VALUES ($1::varchar, $2::text, $3::date, $4::numeric, $5::numeric, $6::varchar, $7::varchar, $8::bigint)
            RETURNING id;
        `, [title, description, date, startTime, endTime, type, color, calendarId]);
            const id = +res.rows[0].id;
            yield this.setAets();
            this._aets.push({
                id,
                title,
                description,
                date,
                startTime,
                endTime,
                type,
                color,
            });
            return id;
        });
    }
    /**
     * Adds a module to the database and caches it locally.
     * @param mod
     * @returns {Promise<number | undefined>} The ID of the module added.
     */
    addMod(mod) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            switch (mod.type) {
                case "blm":
                    const res = yield client.query(`
                        INSERT INTO blockmodule (token, title, description, html, css, js, published)
                        VALUES ($1::varchar, $2::varchar, $3::text, $4::text, $5::text, $6::text, false)
                        RETURNING id;
                    `, [mod.token, mod.title, mod.description, mod.html, mod.css, mod.js]);
                    const id = +res.rows[0].id;
                    yield this.setMods();
                    this._mods.push(Object.assign({ id }, mod));
                    return id;
            }
            throw new Error("NOT IMPLEMENTED, NEW MODULE TYPE MUST BE ADDED TO `addMod` METHOD");
        });
    }
    /**
     * Removes an AET from the database and from local cache based on an ID provided.
     * @param {number} id The ID of the AET to remove.
     */
    removeAet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            yield client.query("DELETE FROM aet WHERE id = $1::bigint", [id]);
            yield this.setAets();
            const idx = this._aets.findIndex(aet => aet.id === id);
            this._aets.splice(idx, 1);
        });
    }
    /**
     * Removes a module from the database and from local cache based on an ID or a token provided.
     * @param {number | string} idOrToken The ID or token of the module to remove.
     */
    removeMod(idOrToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            const toRemove = typeof idOrToken === "number" ? "id" : "token";
            yield client.query(`DELETE
                            FROM blockmodule
                            WHERE ${toRemove} = $1`, [idOrToken]);
            yield this.setMods();
            const idx = this._mods
                .findIndex(mod => (typeof idOrToken === "number" ? mod.id : mod.token) === idOrToken);
            this._mods.splice(idx, 1);
        });
    }
    /**
     * Updates an AET in the database.
     * Also updates the local cache.
     * @param {number} id The ID of the AET to update.
     * @param {NiicAetNoId} aetNoId The AET to update.
     */
    updateAet(id, aetNoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            yield client.query(`
            UPDATE aet
            SET name        = $1::varchar,
                description = $2::text,
                date        = $3::date,
                timebegin   = $4::numeric,
                timeend     = $5::numeric,
                type        = $6::varchar,
                color       = $7::varchar
            WHERE id = $8::bigint;
        `, [aetNoId.title, aetNoId.description, aetNoId.date, aetNoId.startTime, aetNoId.endTime, aetNoId.type, aetNoId.color, id]);
            yield this.setAets();
            const idx = this._aets.findIndex(a => a.id === id);
            this._aets[idx] = Object.assign({ id }, aetNoId);
        });
    }
    /**
     * Updates a module in the database.
     * Also updates the local cache.
     * @param {NiicBlockModuleNoId} moduleNoId The module to update.
     */
    updateMod(moduleNoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            const res = yield client.query(`
                    UPDATE blockmodule
                    SET title       = $1::varchar,
                        description = $2::varchar,
                        html        = $3::text,
                        css         = $4::text,
                        js          = $5::text
                    WHERE token = $6::varchar
                    RETURNING id
            `, [moduleNoId.title, moduleNoId.description, moduleNoId.html, moduleNoId.css, moduleNoId.js, moduleNoId.token]);
            yield this.setMods();
            const idx = this._mods.findIndex(m => m.token === moduleNoId.token);
            this._mods[idx] = Object.assign({ id: +res.rows[0].id }, moduleNoId);
        });
    }
    /**
     * Updates module token in the database.
     * Also updates the local cache.
     * @param oldToken previous token of module.
     * @param newToken new token of module.
     */
    updateModToken(oldToken, newToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            const res = yield client.query(`
                    UPDATE blockmodule
                    SET token = $2::varchar
                    WHERE token = $1::varchar
                    RETURNING *
            `, [oldToken, newToken]);
            const id = +res.rows[0].id;
            yield this.setMods();
            const idx = this._mods.findIndex(m => m.id === id);
            this._mods[idx].token = newToken;
        });
    }
    /**
     * Gets all published modules.
     */
    getPublishedMods() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            const res = yield client.query(`
            SELECT id,
                   title,
                   description,
                   html,
                   css,
                   js,
                   'blm' AS type
            FROM blockmodule
            where published = true
        `);
            return res.rows
                .map(mod => {
                return Object.assign({ additionalInformation: [
                        mod.html ? "HTML" : null,
                        mod.css ? "JS" : null,
                        mod.js ? "CSS" : null,
                    ]
                        .filter(x => x !== null)
                        .join(" + ") }, mod);
            });
        });
    }
    /**
     * Gets all installed plugins for user.
     * @param userId
     */
    getInstalledMods(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            const res = yield client.query(`
                SELECT id,
                       title,
                       description,
                       html,
                       css,
                       js,
                       'blm' AS type
                FROM blockmodule
                WHERE published = true
                  AND id IN (SELECT blockmoduleid FROM installedplugin WHERE niicuserdid = $1::bigint)
            `, [userId]);
            return res.rows
                .map(mod => {
                return Object.assign({}, mod);
            });
        });
    }
    /**
     * Returns a copy of all AETs in the database.
     */
    getAets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAets();
            const aets = [];
            for (const aet of this._aets) {
                aets.push(Object.assign({}, aet));
            }
            return aets;
        });
    }
    /**
     * Prints all AETs in the database to the console.
     * If the AETs are cached, it uses the cached version.
     */
    printAets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAets();
            console.log(this._aets);
        });
    }
    /**
     * The local client used for the database interactions.
     * @private
     */
    client() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client === undefined) {
                this._client = new pg_1.Client({
                    database: process.env.DB_DB,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    host: process.env.DB_HOST,
                    port: +((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : 5432),
                    ssl: true,
                });
                yield this._client.connect();
                console.log("Connected to database");
            }
            return this._client;
        });
    }
}
exports.DatabaseService = DatabaseService;
// region Singleton
DatabaseService._instance = undefined;
