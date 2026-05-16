const { Pool } = require("pg");
const { createApp } = require("./app");

const pool = new Pool({
  user: process.env.POSTGRES_USER || "admin",
  host: process.env.POSTGRES_HOST || "postgres",
  database: process.env.POSTGRES_DB || "appdb",
  password: process.env.POSTGRES_PASSWORD || "admin123",
  port: Number(process.env.POSTGRES_PORT || 5432),
});

const app = createApp({
  dbQuery: (queryText) => pool.query(queryText),
});

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
