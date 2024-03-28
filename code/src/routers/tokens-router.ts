import express from "express";
import TokenGenerationReq from "../be-models/TokenGenerationReq";
import {StatusCodes} from "http-status-codes";
import {DatabaseService} from "../DatabaseService";

export const tokensRouter = express.Router();

tokensRouter.put("/", async (req, res) => {
    const body: TokenGenerationReq = req.body;
    const token: string = generateToken(body);
    try {
        if (body.oldToken === null) {
            await DatabaseService.instance().addMod({
                token,
                title: "",
                type: "blm",
                html: null,
                js: null,
                css: null,
                description: null,
            })

            res.status(StatusCodes.CREATED).send(token);
            return;
        }

        await DatabaseService.instance().updateModToken(
            body.oldToken,
            token,
        )
        res.status(StatusCodes.OK).send(token);

    } catch (e) {
        console.error(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

function generateToken(token: TokenGenerationReq): string {
    return generateTokenString(token, Math.floor(Math.random() * 1000000));
}

function generateTokenString(token: TokenGenerationReq, randomNumber: number): string {
    return token.type +
        "-R-" + replaceAllCommasWithHyphen(token.read.toString()) +
        "-W-" + replaceAllCommasWithHyphen(token.write.toString()) +
        "-" + randomNumber.toString();
}

function replaceAllCommasWithHyphen(str: string): string {
    return str.replace(",", "-");
}