import express from "express";
import mongoose from "mongoose";
import dbConnection from "./config/config"

const app = express();
app.use(express.json());

dbConnection()

const PORT = 5000;

app.listen(PORT, console.log(`Server Started on Port ${PORT}`));
