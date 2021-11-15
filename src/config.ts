import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

export { app as config };
