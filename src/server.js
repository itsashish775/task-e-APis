// server.js
require("dotenv").config();

const env = require("./validation/validateEnv");
const { sequelize } = require("./models");
const app = require("./index");

const port = process.env.PORT || 4000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database & tables synced");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("❌ DB sync error:", err));
