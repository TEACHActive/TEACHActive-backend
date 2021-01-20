import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

export { app as config };
