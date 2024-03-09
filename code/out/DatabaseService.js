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
class DatabaseService {
    _client = undefined;
    _aets = undefined;
    static _instance = undefined;
    static instance() {
        if (this._instance === undefined) {
            this._instance = new DatabaseService();
        }
        return this._instance;
    }
    constructor() { }
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
    async addAet(userid, title, description, date, startTime, endTime, type, color) {
        try {
            const client = await this.client();
            const res = await client.query(`
                INSERT INTO aet (name, description, date, timebegin, timeend, type, color, calenderid)
                VALUES ($1::varchar(255), $2::text, $3::date, $4::numeric, $5::numeric, $6::varchar(40), $7::varchar(7),
                        (SELECT id
                         FROM calendar
                         WHERE niicuserid = $8::bigint))
                RETURNING id;
            `, [title, description, date, startTime, endTime, type, color, userid]);
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
        catch (e) {
            console.error(e);
            return undefined;
        }
    }
    async removeAet(id) {
        try {
            const client = await this.client();
            await client.query("DELETE FROM aet WHERE id = $1::bigint", [id]);
            await this.setAets();
            const idx = this._aets.findIndex(aet => aet.id === id);
            this._aets.splice(idx, 1);
        }
        catch (e) {
            console.error(e);
        }
    }
    /**
     * Update an AET in the database.
     * `id` field of aet is ignored.
     * @param {number} id
     * @param {NiicAet} aet
     */
    async updateAet(id, aet) {
        try {
            const client = await this.client();
            await client.query(`
                UPDATE aet
                SET name = $1::varchar(255),
                    description = $2::text,
                    date = $3::date,
                    timebegin = $4::numeric,
                    timeend = $5::numeric,
                    type = $6::varchar(40),
                    color = $7::varchar(7)
                WHERE id = $8::bigint;
            `, [aet.title, aet.description, aet.date, aet.startTime, aet.endTime, aet.type, aet.color, id]);
            await this.setAets();
            const idx = this._aets.findIndex(a => a.id === id);
            this._aets[idx] = aet;
        }
        catch (e) {
            console.error(e);
        }
    }
    async printAets() {
        await this.setAets();
        console.log(this._aets);
    }
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
