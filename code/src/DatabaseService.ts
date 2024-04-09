import { Client } from "pg";
import NiicAet from "./be-models/NiicAet";
import * as dotenv from "dotenv";
import NiicAetNoId from "./be-models/NiicAetNoId";
import NiicBlockModule from "./be-models/NiicBlockModule";
import NiicBlockModuleNoId from "./be-models/NiicBlockModuleNoId";
import NiicPublishedModule from "./be-models/NiicPublishedModule";
import NiicBlockModuleFe from "./be-models/NiicBlockModuleFe";

dotenv.config({path: __dirname + "/../vars/.env"});

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

    /**
     * The modules in the database.
     * Should only be used after invoking the `setModules` method and awaiting or ".then"-ing it.
     * @private
     */
    private _mods: NiicBlockModule[] | undefined = undefined;


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

    private constructor() {
    }

    // endregion


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
        const client = await this.client();
        const res = await client.query(`
            INSERT INTO aet (name, description, date, timebegin, timeend, type, color, calendarid)
            VALUES ($1::varchar, $2::text, $3::date, $4::numeric, $5::numeric, $6::varchar, $7::varchar, $8::bigint)
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
    }

    /**
     * Adds a module to the database and caches it locally.
     * @param mod
     * @returns {Promise<number | undefined>} The ID of the module added.
     */
    public async addMod(mod: NiicBlockModuleNoId): Promise<number | undefined> {
        const client = await this.client();

        switch (mod.type) {
            case "blm":
                const res = await client.query(
                    `
                        INSERT INTO blockmodule (token, title, description, html, css, js, published)
                        VALUES ($1::varchar, $2::varchar, $3::text, $4::text, $5::text, $6::text, false)
                        RETURNING id;
                    `,
                    [mod.token, mod.title, mod.description, mod.html, mod.css, mod.js]
                );

                const id: number = +res.rows[0].id;
                await this.setMods();

                this._mods!.push({
                    id,
                    ...mod,
                });
                return id;
        }

        throw new Error("NOT IMPLEMENTED, NEW MODULE TYPE MUST BE ADDED TO `addMod` METHOD");
    }

    /**
     * Removes an AET from the database and from local cache based on an ID provided.
     * @param {number} id The ID of the AET to remove.
     */
    public async removeAet(id: number) {
        const client = await this.client();
        await client.query("DELETE FROM aet WHERE id = $1::bigint", [id]);
        await this.setAets();
        const idx = this._aets!.findIndex(aet => aet.id === id);
        this._aets!.splice(idx, 1);
    }

    /**
     * Removes a module from the database and from local cache based on an ID or a token provided.
     * @param {number | string} idOrToken The ID or token of the module to remove.
     */
    public async removeMod(idOrToken: number | string) {
        const client = await this.client();
        const toRemove = typeof idOrToken === "number" ? "id" : "token";
        await client.query(`DELETE
                            FROM blockmodule
                            WHERE ${toRemove} = $1`, [idOrToken]);
        await this.setMods();
        const idx = this._mods!
            .findIndex(mod => (typeof idOrToken === "number" ? mod.id : mod.token) === idOrToken);
        this._mods!.splice(idx, 1);
    }

    /**
     * Updates an AET in the database.
     * Also updates the local cache.
     * @param {number} id The ID of the AET to update.
     * @param {NiicAetNoId} aetNoId The AET to update.
     */
    public async updateAet(id: number, aetNoId: NiicAetNoId) {
        const client = await this.client();
        await client.query(`
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
        await this.setAets();
        const idx = this._aets!.findIndex(a => a.id === id);
        this._aets![idx] = {
            id,
            ...aetNoId,
        };
    }


    /**
     * Updates a module in the database.
     * Also updates the local cache.
     * @param {NiicBlockModuleNoId} moduleNoId The module to update.
     */
    public async updateMod(moduleNoId: NiicBlockModuleNoId) {
        const client = await this.client();
        const res = await client.query(`
                    UPDATE blockmodule
                    SET title       = $1::varchar,
                        description = $2::varchar,
                        html        = $3::text,
                        css         = $4::text,
                        js          = $5::text
                    WHERE token = $6::varchar
                    RETURNING id
            `,
            [moduleNoId.title, moduleNoId.description, moduleNoId.html, moduleNoId.css, moduleNoId.js, moduleNoId.token]
        );
        await this.setMods();
        const idx = this._mods!.findIndex(m => m.token === moduleNoId.token);
        this._mods![idx] = {
            id: +res.rows[0].id,
            ...moduleNoId
        }
    }

    /**
     * Updates module token in the database.
     * Also updates the local cache.
     * @param oldToken previous token of module.
     * @param newToken new token of module.
     */
    public async updateModToken(oldToken: string, newToken: string) {
        const client = await this.client();
        const res = await client.query(`
                    UPDATE blockmodule
                    SET token = $2::varchar
                    WHERE token = $1::varchar
                    RETURNING *
            `,
            [oldToken, newToken]
        );
        const id: number = +res.rows[0].id;
        await this.setMods();
        const idx = this._mods!.findIndex(m => m.id === id);
        this._mods![idx].token = newToken;
    }

    /**
     * Gets all published modules.
     */
    public async getPublishedMods(): Promise<NiicPublishedModule[]> {
        const client = await this.client();
        const res = await client.query(`
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
            .map<NiicPublishedModule>(mod => {
                return {
                    additionalInformation:
                        [
                            mod.html ? "HTML" : null,
                            mod.css ? "JS" : null,
                            mod.js ? "CSS" : null,
                        ]
                            .filter(x => x !== null)
                            .join(" + "),
                    ...mod
                };
            });
    }

    /**
     * Gets all installed plugins for user.
     * @param userId
     */
    public async getInstalledMods(userId: number): Promise<NiicBlockModuleFe[]> {
        const client = await this.client();
        const res = await client.query(
            `
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
            `,
            [userId]
        );

        return res.rows
            .map<NiicBlockModuleFe>(mod => {
                return {
                    ...mod
                };
            });
    }

    /**
     * Returns a copy of all AETs in the database.
     */
    public async getAets(): Promise<NiicAet[]> {
        await this.setAets();
        const aets = [];
        for (const aet of this._aets!) {
            aets.push({...aet});
        }
        return aets;
    }

    /**
     * Gets all aets from a calendar via the calendar's ID.
     * @param calendarId The ID of the calendar.
     */
    public async getAetsFromCalendarId(calendarId: number): Promise<NiicAet[]> {
        const client = await this.client();
        const res = await client.query(
            `
                SELECT id,
                       name,
                       description,
                       date,

                       timebegin,
                       timeend,

                       type,

                       color
                FROM aet
                WHERE calendarid = $1::bigint
            `,
            [calendarId]
        );

        return res.rows.map(rows => ({
            id: +rows.id,
            title: rows.name,
            description: rows.description,
            date: new Date(rows.date),

            startTime: +rows.timebegin,
            endTime: +rows.timeend,

            type: rows.type,

            color: rows.color
        }));
    }

    /**
     * Gets a user with username and id from a username.
     * @param username The username of the user..
     */
    public async getUser(username: string): Promise<{
        id: number,
        username: string,
    } | false> {
        const client = await this.client();
        const res = await client.query(
            `
                SELECT id, username
                FROM niicuser
                WHERE username = $1::varchar
            `,
            [username]
        );

        if (res.rows.length < 1) {
            return false;
        }

        return {
            id: +res.rows[0].id,
            username: res.rows[0].username,
        };
    }

    /**
     * Gets a calendar ID from a user ID.
     * @param userId The ID of the user.
     */
    public async getCalendarId(userId: number): Promise<number | false> {
        const client = await this.client();
        const res = await client.query(
            `
                SELECT id
                FROM calendar
                WHERE niicuserid = $1::bigint
            `,
            [userId]
        );

        return +res.rows[0].id;
    }

    /**
     * Installs a plugin for a user.
     * @param userId The ID of the user.
     * @param modId The ID of the module.
     */
    public async installMod(userId: number, modId: number) {
        const client = await this.client();
        await client.query(
            `
                INSERT INTO installedplugin (niicuserdid, blockmoduleid)
                VALUES ($1::bigint, $2::bigint)
            `,
            [userId, modId]
        );
    }

    /**
     * Uninstalls a plugin for a user.
     * @param userId The ID of the user.
     * @param modId The ID of the module.
     */
    public async uninstallMod(userId: number, modId: number) {
        const client = await this.client();
        await client.query(
            `
                DELETE
                FROM installedplugin
                WHERE niicuserdid = $1::BIGINT
                  AND blockmoduleid = $2::BIGINT
            `,
            [userId, modId]
        );
    }

    /**
     * Publishes a module by token.
     * @param token The token of the module.
     */
    public async publishMod(token: string) {
        const client = await this.client();
        await client.query(
            `
                UPDATE blockmodule
                SET published = true
                WHERE token = $1::varchar(40)
            `,
            [token]
        );
    }

    /**
     * Unpublishes a module by token.
     * @param token The token of the module.
     */
    public async unpublishMod(token: string) {
        const client = await this.client();
        await client.query(
            `
                UPDATE blockmodule
                SET published = false
                WHERE token = $1::varchar(40)
            `,
            [token]
        );
    }

    /**
     * Prints all AETs in the database to the console.
     * If the AETs are cached, it uses the cached version.
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

    /**
     * Sets the `_aets` field to the current AETs in the database if not yet set.
     * @private
     */
    private async setAets() {
        if (this._aets === undefined) {
            const client = await this.client();
            const res = await client.query(`
                SELECT id,
                       name,
                       description,
                       date,
                       timebegin,
                       timeend,
                       color,
                       type,
                       calendarid
                FROM aet
            `);

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
     * Sets the `_modules` field to the current modules in the database if not yet set.
     * @private
     */
    private async setMods() {
        if (this._mods === undefined) {
            const client = await this.client();
            const res = await client.query(`
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
                this._mods!.push({
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
    }
}