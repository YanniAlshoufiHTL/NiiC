import express from "express";

const app = express();
app.use(express.json());    // parse JSON data and places result in req.body

app.listen(3000, function () {
    console.log("Server listening on port 3000 ...");
});