"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokensRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const DatabaseService_1 = require("../DatabaseService");
exports.tokensRouter = express_1.default.Router();
exports.tokensRouter.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const token = generateToken(body);
    try {
        if (body.oldToken === null || body.oldToken === undefined || body.oldToken.length === 0) {
            yield DatabaseService_1.DatabaseService.instance().addMod({
                token,
                title: "",
                type: "blm",
                html: null,
                js: null,
                css: null,
                description: null,
                published: false,
            });
            res.status(http_status_codes_1.StatusCodes.CREATED).send(token);
            return;
        }
        yield DatabaseService_1.DatabaseService.instance().updateModToken(body.oldToken, token);
        res.status(http_status_codes_1.StatusCodes.OK).send(token);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
function generateToken(token) {
    return generateTokenString(token, Math.floor(Math.random() * 1000000));
}
function generateTokenString(token, randomNumber) {
    return token.type +
        "-R-" + replaceAllCommasWithHyphen(token.read.toString()) +
        "-W-" + replaceAllCommasWithHyphen(token.write.toString()) +
        "-" + randomNumber.toString();
}
function replaceAllCommasWithHyphen(str) {
    return str.replace(",", "-");
}
