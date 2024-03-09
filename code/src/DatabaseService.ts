import { Client } from "pg";
import { NiicAet } from "./be-models/NiicAet";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../vars/.env" });

/**
 * Service for interacting with the database.
 * Contains methods for adding, removing, and updating AETs.
 */
export class DatabaseService {
    /**
     * The local client used for the database interactions.
     * Should never be used directly, use the `client` method instead.
     * @private
     */
    private _client: Client | undefined = undefined;

    /**
     * The AETs in the database.
     * Should only be used after invoking the `setAets` method and awaiting or ".then"-ing it.
     * @private
     */
    private _aets: NiicAet[] | undefined = undefined;

    // region Singleton

    private static _instance: DatabaseService | undefined = undefined;

    /**
     * Returns the instance of the database service.
     * This method must be invoked each time the service is used.
     */
    public static instance() {
        if (this._instance === undefined) {
            this._instance = new DatabaseService();
        }

        return this._instance;
    }

    private constructor() {}

    // endregion

    /**
     * Sets the `_aets` field to the current AETs in the database if not yet set.
     * @private
     */
    private async setAets() {
        if (this._aets === undefined) {
            const client = await this.client();
            const res = await client.query("SELECT * FROM aet");

            this._aets = [];
            res.rows.forEach(row => {
                this._aets!.push({
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
    public async addAet(
        calendarId: number,
        title: string,
        description: string,
        date: Date,
        startTime: number,
        endTime: number,
        type: "appointment" | "event" | "task",
        color: string,
    ): Promise<number | undefined> {
        try {
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
            this._aets!.push({
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
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    /**
     * Removes an AET from the database and from local cache based on an ID provided.
     * @param {number} id The ID of the AET to remove.
     */
    public async removeAet(id: number) {
        try {
            const client = await this.client();
            await client.query("DELETE FROM aet WHERE id = $1::bigint", [id]);
            await this.setAets();
            const idx = this._aets!.findIndex(aet => aet.id === id);
            this._aets!.splice(idx, 1);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Updates an AET in the database.
     * `id` field of aet is ignored.
     * @param {number} id The ID of the AET to update.
     * @param {NiicAet} aet The AET to update. Its `id` field is ignored.
     */
    public async updateAet(id: number, aet: NiicAet) {
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
            const idx = this._aets!.findIndex(a => a.id === id);
            this._aets![idx] = aet;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Prints all AETs in the database to the console.
     * If the AETs are cached, it uses the cached version..
     */
    public async printAets() {
        await this.setAets();
        console.log(this._aets);
    }


    /**
     * The local client used for the database interactions.
     * @private
     */
    private async client(): Promise<Client> {
        if (this._client === undefined) {
            this._client = new Client({
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