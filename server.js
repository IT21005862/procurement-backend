import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import supRequestRoutes from "./routes/supplierRoutes.js";

const PORT = process.env.PORT || 8070;
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGO_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongodb Connection success!");
});

app.use("/api/supplierRequests", supRequestRoutes);