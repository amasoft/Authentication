//import modules
import express from "express";
import router from "./routes/usersRoutes.js";
import { connection, app } from "./config/connection.js";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";
// Create a Redis client
//initialize middlewares
// const app = express();
app.use(express.static("public"));
app.use(express.json());
const baseurl = "/api/v1/";
app.use(baseurl, router);

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AUthentication and Authorization Api",
      contact: {
        name: "API Support",
        url: "https://www.example.com/support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerjsdoc(option);
app.use("/api-doc", swaggerui.serve, swaggerui.setup(specs));
app.get("/", (req, res) => {
  console.log("amadhffv");
  res.send("welcome");
  // document.write("welcome");
});
