import express from "express";

const router = express.Router();

//root url
router.route("/").get((req, res) => res.send("hello React JS"));

export default router;
