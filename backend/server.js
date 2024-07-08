import express from "express";
import api from "./routes/index.js";
import { db } from "./config/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
// const express = require("express")
// const api = require('./routes/index.js')
// const db = require('./config/db.js').db
// const cors = require("cors")
// const path = require('path')
const PORT = 3001;
const app = express();

// reading environmetal variable file
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/error-middleware.js";
dotenv.config();

// database connection
db();

//decodes the url
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(cors(*))
app.get("/", (req, res) => {
  res.send("From the FYP server");
});

//base url
app.use("/api/v1", api);

// Upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(errorHandler);
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT ?? 3001);
});
