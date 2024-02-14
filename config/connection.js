import { mongoose } from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import redis from "redis";

dotenv.config();

const PORT = process.env.PORT || 5001;
const dbURI = process.env.URL;

export const app = express();
app.use(cors());

export const connection = mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then((result) =>
    app.listen(PORT, function () {
      const client = redis.createClient();
      client.on("connect", function () {
        console.log("Connected to Redis server");
      });
      client.on("error", function (error) {
        console.error("Error connecting to Redis server:", error);
      });
      console.log(`connection succesful ${PORT}`);
    })
  )
  .catch((err) => console.log(err));
// export default connection;
