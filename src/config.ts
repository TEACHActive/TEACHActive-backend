import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(helmet());
app.use(cors());

export { app as config };
