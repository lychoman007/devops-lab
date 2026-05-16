const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const { createApp } = require("./app");

test("GET /api/health returns database time", async () => {
  const app = createApp({
    dbQuery: async () => ({
      rows: [{ now: "2026-05-16T00:00:00.000Z" }],
    }),
  });

  const server = app.listen(0);
  await once(server, "listening");

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "success");
  assert.equal(body.database_time.now, "2026-05-16T00:00:00.000Z");

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});
