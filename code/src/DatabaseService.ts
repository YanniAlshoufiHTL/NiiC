import { Client } from "pg";
import { NiicAet } from "./be-models/NiicAet";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../vars/.env" });

export class DatabaseService {
    private _client: Client | undefined = undefined;
    private _aets: NiicAet[] | undefined = undefined;
    private static _instance: DatabaseService | undefined = undefined;

    public static instance() {
        if (this._instance === undefined) {
            this._instance = new DatabaseService();
        }

        return this._instance;
    }

    private constructor() {}

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

    public async addAet(
        userid: number,
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
            `, [title, description, date, startTime, endTime, type, color, userid]);
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
     * Update an AET in the database.
     * `id` field of aet is ignored.
     * @param {number} id
     * @param {NiicAet} aet
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

    public async printAets() {
        await this.setAets();
        console.log(this._aets);
    }



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