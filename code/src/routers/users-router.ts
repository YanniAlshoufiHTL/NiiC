import express from "express";
import {DatabaseService} from "../DatabaseService";
import bcrypt= require('bcrypt')
import {OK, StatusCodes} from "http-status-codes";



export const usersRouter = express.Router();

usersRouter.post("/", async (req, res) => {
    let email= req.body.email;
    let name = req.body.name;
    try {
        await DatabaseService.instance().addUser(email, name, bcrypt.hashSync(req.body.password,10));
        res.sendStatus(StatusCodes.OK);
    }catch (err){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        console.log(err);
    }


})

usersRouter.put("/:id", async (req, res) => {
    try {
        await DatabaseService.instance().updateUser(req.body.email,req.body.name,bcrypt.hashSync(req.body.password,10),+req.params.id);
        res.sendStatus(StatusCodes.OK);
    }catch (err){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        console.log(err);
    }
})

usersRouter.delete("/:id", async (req, res) => {
    const id= +req.params.id;
    try {
        await DatabaseService.instance().deleteUser((id));
    }catch (err){
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    res.sendStatus(StatusCodes.OK);
})

usersRouter.put("/logout/:id", async (req, res) => {
    try {
        await DatabaseService.instance().logOutUser(+req.params.id);
        res.sendStatus(StatusCodes.OK);
    }catch (err){
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }

})
usersRouter.post("/login", async (req, res) => {
    try {
        await DatabaseService.instance().logInUser(req.body.name,req.body.password);
        res.sendStatus(StatusCodes.OK);
    }catch (err){
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }

})