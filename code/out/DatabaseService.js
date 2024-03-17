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
     * The local client used for the database interactions.
     * Should never be used directly, use the `client` method instead.
     * @private
     */
    _client = undefined;
    /**
     * The AETs in the database.
     * Should only be used after invoking the `setAets` method and awaiting or ".then"-ing it.
     * @private
     */
    _aets = undefined;
    // region Singleton
    static _instance = undefined;
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
    }
    // endregion
    /**
     * Sets the `_aets` field to the current AETs in the database if not yet set.
     * @private
     */
    async setAets() {
        if (this._aets === undefined) {
            const client = await this.client();
            const res = await client.query("SELECT * FROM aet");
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
     */
    async addAet(calendarId, title, description, date, startTime, endTime, type, color) {
        const client = await this.client();
        const res = await client.query(`
            INSERT INTO aet (name, description, date, timebegin, timeend, type, color, calenderid)
            VALUES ($1::varchar(255), $2::text, $3::date, $4::numeric, $5::numeric, $6::varchar(40), $7::varchar(7),
                    (SELECT id
                     FROM calendar
                     WHERE niicuserid = $8::bigint))
            RETURNING id;
        `, [title, description, date, startTime, endTime, type, color, calendarId]);
        const id = +res.rows[0].id;
        await this.setAets();
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
    }
    /**
     * Removes an AET from the database and from local cache based on an ID provided.
     * @param {number} id The ID of the AET to remove.
     */
    async removeAet(id) {
        const client = await this.client();
        await client.query("DELETE FROM aet WHERE id = $1::bigint", [id]);
        await this.setAets();
        const idx = this._aets.findIndex(aet => aet.id === id);
        this._aets.splice(idx, 1);
    }
    /**
     * Updates an AET in the database.
     * Also updates the local cache.
     * @param {number} id The ID of the AET to update.
     * @param {NiicAetNoId} aetNoId The AET to update.
     */
    async updateAet(id, aetNoId) {
        const client = await this.client();
        await client.query(`
            UPDATE aet
            SET name        = $1::varchar(255),
                description = $2::text,
                date        = $3::date,
                timebegin   = $4::numeric,
                timeend     = $5::numeric,
                type        = $6::varchar(40),
                color       = $7::varchar(7)
            WHERE id = $8::bigint;
        `, [aetNoId.title, aetNoId.description, aetNoId.date, aetNoId.startTime, aetNoId.endTime, aetNoId.type, aetNoId.color, id]);
        await this.setAets();
        const idx = this._aets.findIndex(a => a.id === id);
        this._aets[idx] = {
            id,
            ...aetNoId,
        };
    }
    /**
     * Returns a copy of all AETs in the database.
     */
    async getAets() {
        await this.setAets();
        const aets = [];
        for (const aet of this._aets) {
            aets.push({ ...aet });
        }
        return aets;
    }
    /**
     * Prints all AETs in the database to the console.
     * If the AETs are cached, it uses the cached version..
     */
    async printAets() {
        await this.setAets();
        console.log(this._aets);
    }
    /**
     * The local client used for the database interactions.
     * @private
     */
    async client() {
        if (this._client === undefined) {
            this._client = new pg_1.Client({
                database: process.env.DB_DB,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                host: process.env.DB_HOST,
                port: +(process.env.DB_PORT ?? 5432),
                ssl: true,
            });
            await this._client.connect();
            console.log("Connected to database");
        }
        return this._client;
    }
}
exports.DatabaseService = DatabaseService;
