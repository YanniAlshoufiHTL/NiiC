import express from "express";
import TokenGenerationReq from "../be-models/TokenGenerationReq";
import {StatusCodes} from "http-status-codes";
import {DatabaseService} from "../DatabaseService";
import {isAuthenticated, checkIfUserAuthenticatedWithId} from "../middleware/auth-handlers";
import jwt from "jsonwebtoken";

export const tokensRouter = express.Router();

tokensRouter.put("/", isAuthenticated, async (req, res) => {
    const body: TokenGenerationReq = req.body;
    try {
        if(body.userId === undefined) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        if(!await checkIfUserAuthenticatedWithId(+body.userId, req, res)){
            return;
        }

        if(body.type !== undefined) {
            const token = await generateToken(body);

            if (token instanceof Error) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .send(token.message);
                return;
            }

            if (body.oldToken === null || body.oldToken === undefined || body.oldToken.length === 0) {
                await DatabaseService.instance().addMod({
                    token,
                    title: "",
                    type: "blm",
                    html: null,
                    js: null,
                    css: null,
                    description: null,
                    published: false,
                })

                res.status(StatusCodes.CREATED).send(token);
                return;
            }

            await DatabaseService.instance().updateModToken(
                body.oldToken,
                token,
            )
            res.status(StatusCodes.OK).send(token);
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

async function generateToken(token: TokenGenerationReq): Promise<string | Error> {
    const idsOfUsersWithReadAccess = await DatabaseService.instance().getIdsOfUsernames(token.read);
    const idsOfUsersWithWriteAccess = await DatabaseService.instance().getIdsOfUsernames(token.write);

    if (idsOfUsersWithReadAccess instanceof Error) {
        return idsOfUsersWithReadAccess;
    }

    if (idsOfUsersWithWriteAccess instanceof Error) {
        return idsOfUsersWithWriteAccess;
    }

    return token.type +
        "-" + token.userId.toString() +
        "-R-" + replaceAllCommasWithHyphen(idsOfUsersWithReadAccess.toString()) +
        "-W-" + replaceAllCommasWithHyphen(idsOfUsersWithWriteAccess.toString()) +
        "-" + Math.floor(Math.random() * 1000000);
}

function replaceAllCommasWithHyphen(str: string): string {
    return str.replace(",", "-");
}