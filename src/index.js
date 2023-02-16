import express from "express";
import mongoose from "mongoose";
import dbConnection from "./config/config";

const app = express();
app.use(express.json());
app.use("/", (req, res) => {
  res.status(200).send({
    status: 200,
    message: "Welcome To Nest estate API",
  });
});

dbConnection();

const PORT = 5000;

app.listen(PORT, console.log(`Server Started on Port ${PORT}`));
