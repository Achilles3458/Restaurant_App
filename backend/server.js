//attach the cors and express json middleware to send and receive json and speficy routes
import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

const app = express(); //use to create the server

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/v1/restaurants", restaurants);

//return something anything that is not found
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
