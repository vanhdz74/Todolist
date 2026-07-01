import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? "127.0.0.1";
const DB_PATH = join(dirname(fileURLToPath(import.meta.url)), "db.json");
const collections = new Set([
  "tasks",
  "lists",
  "listGroups",
  "users",
  "taskSteps",
  "categories",
  "taskCategories",
  "attachments",
]);

const readDb = async () => JSON.parse(await readFile(DB_PATH, "utf8"));

const writeDb = async (db) => {
  await writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`);
};

const sendJson = (response, statusCode, data) => {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(data));
};

const parseBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  return rawBody ? JSON.parse(rawBody) : {};
};

const matchesQuery = (item, searchParams) => {
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("_")) continue;

    const itemValue = item[key];
    const normalizedValue =
      value === "true" ? true : value === "false" ? false : Number(value);

    if (
      String(itemValue) !==
      String(Number.isNaN(normalizedValue) ? value : normalizedValue)
    ) {
      return false;
    }
  }

  return true;
};

const getNextId = (items) => {
  return items.reduce((maxId, item) => Math.max(maxId, Number(item.id)), 0) + 1;
};

createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  try {
    const url = new URL(request.url ?? "/", `http://${HOST}:${PORT}`);
    const [, collection, idSegment] = url.pathname.split("/");

    if (!collections.has(collection)) {
      sendJson(response, 404, { message: "Not found" });
      return;
    }

    const db = await readDb();
    const items = db[collection];
    const id = idSegment ? Number(idSegment) : null;

    if (request.method === "GET" && id === null) {
      sendJson(
        response,
        200,
        items.filter((item) => matchesQuery(item, url.searchParams)),
      );
      return;
    }

    if (request.method === "GET" && id !== null) {
      const item = items.find((entry) => entry.id === id);

      sendJson(response, item ? 200 : 404, item ?? { message: "Not found" });
      return;
    }

    if (request.method === "POST" && id === null) {
      const body = await parseBody(request);
      const created = { ...body, id: getNextId(items) };

      db[collection] = [...items, created];
      await writeDb(db);
      sendJson(response, 201, created);
      return;
    }

    if (request.method === "PATCH" && id !== null) {
      const body = await parseBody(request);
      const index = items.findIndex((entry) => entry.id === id);

      if (index === -1) {
        sendJson(response, 404, { message: "Not found" });
        return;
      }

      const updated = { ...items[index], ...body };

      db[collection] = items.with(index, updated);
      await writeDb(db);
      sendJson(response, 200, updated);
      return;
    }

    if (request.method === "DELETE" && id !== null) {
      db[collection] = items.filter((entry) => entry.id !== id);
      await writeDb(db);
      sendJson(response, 200, {});
      return;
    }

    sendJson(response, 405, { message: "Method not allowed" });
  } catch (error) {
    sendJson(response, 500, {
      message: error instanceof Error ? error.message : "Server error",
    });
  }
}).listen(PORT, HOST, () => {
  console.log(`Mock API running at http://${HOST}:${PORT}`);
});
