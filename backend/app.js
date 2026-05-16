const express = require("express");
const cors = require("cors");

function createApp({ dbQuery }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Backend API Running");
  });

  app.get("/api/health", async (req, res) => {
    try {
      const result = await dbQuery("SELECT NOW() AS now");

      res.json({
        status: "success",
        database_time: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
      });
    }
  });

  return app;
}

module.exports = { createApp };
