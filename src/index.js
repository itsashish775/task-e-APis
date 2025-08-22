require("dotenv").config();

const env = require("./validation/validateEnv");

const express = require("express");
const routes = require("./routes");
const { sequelize } = require("./models");
const responseHandler = require("./middleware/responseHandler");

const app = express();
app.use(express.json());

app.use(responseHandler);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", routes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

const port = process.env.PORT || 4000;
sequelize
  .sync({ alter: true }) // 👈 creates tables if they don't exist
  .then(() => {
    console.log("✅ Database & tables synced");
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error("❌ DB sync error:", err));
