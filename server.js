import express, { json } from "express";
import cors from "cors";
import { connect, connection as _connection } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());

const uri = process.env.ATLAS_URI;
connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = _connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
connection.on("error", (err) => {
  console.log("Error in MongoDB connection", err);
});

import usersRouter from "./routes/user.routes";

app.use("/users", usersRouter);
const options = {
  swaggerOptions: {
    authActions: {
      JWT: {
        name: "JWT",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "",
        },
        value: "Bearer <JWT>",
      },
    },
  },
};
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, options)
);
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
