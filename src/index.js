

const express = require("express");
const routes = require("./routes");
const responseHandler = require("./middleware/responseHandler");

const app = express();
app.use(express.json());

app.use(responseHandler);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", routes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));



module.exports = app;
