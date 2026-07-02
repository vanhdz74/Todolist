import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
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
  "listShares",
  "users",
  "taskSteps",
  "categories",
  "taskCategories",
  "attachments",
  "notifications",
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

const sanitizeForeignKeys = (data) => {
  const nextData = { ...data };

  for (const [key, value] of Object.entries(nextData)) {
    if (key.endsWith("Id") && value === null) {
      delete nextData[key];
    }
  }

  return nextData;
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

const getCollectionItems = (db, collection) => {
  const items = db[collection];

  if (!Array.isArray(items)) {
    throw new Error(`Collection "${collection}" is not an array`);
  }

  return items;
};

const ensureCollectionItems = (db, collection) => {
  if (!Array.isArray(db[collection])) {
    db[collection] = [];
  }

  return db[collection];
};

const removeItemsByTaskId = (db, collection, taskId) => {
  db[collection] = ensureCollectionItems(db, collection).filter(
    (item) => item.taskId !== taskId,
  );
};

const removeItemsByField = (db, collection, field, value) => {
  db[collection] = ensureCollectionItems(db, collection).filter(
    (item) => item[field] !== value,
  );
};

const createInviteCode = () => randomBytes(8).toString("base64url");

const getInitials = (name) =>
  String(name || "U")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  try {
    const url = new URL(request.url ?? "/", `http://${HOST}:${PORT}`);
    const [, collection, idSegment, action] = url.pathname.split("/");

    if (!collections.has(collection)) {
      sendJson(response, 404, { message: "Not found" });
      return;
    }

    const db = await readDb();
    const items = getCollectionItems(db, collection);
    const id = idSegment ? Number(idSegment) : null;

    if (idSegment && Number.isNaN(id)) {
      sendJson(response, 400, { message: "Invalid id" });
      return;
    }

    if (collection === "lists" && id !== null && action === "share") {
      const list = ensureCollectionItems(db, "lists").find(
        (entry) => entry.id === id,
      );

      if (!list) {
        sendJson(response, 404, { message: "List not found" });
        return;
      }

      if (!["GET", "POST"].includes(request.method ?? "")) {
        sendJson(response, 405, { message: "Method not allowed" });
        return;
      }

      const body = request.method === "POST" ? await parseBody(request) : {};
      const origin = body.origin || "http://localhost:5173";
      const requestOwner = body.owner;
      const shares = ensureCollectionItems(db, "listShares");
      let share = shares.find((entry) => entry.listId === id);

      if (!share) {
        const now = new Date().toISOString();

        share = {
          id: getNextId(shares),
          listId: id,
          code: createInviteCode(),
          createdBy: list.userId,
          owner: requestOwner,
          createdAt: now,
          updatedAt: now,
        };
        db.listShares = [...shares, share];
        await writeDb(db);
      } else if (requestOwner) {
        share = {
          ...share,
          owner: requestOwner,
          updatedAt: new Date().toISOString(),
        };
        db.listShares = shares.map((entry) =>
          entry.id === share.id ? share : entry,
        );
        await writeDb(db);
      }

      const dbOwner = ensureCollectionItems(db, "users").find(
        (user) => user.id === list.userId,
      );
      const owner = share.owner ??
        (dbOwner
          ? {
              id: dbOwner.id,
              name: dbOwner.name,
              email: dbOwner.email,
              initials: getInitials(dbOwner.name),
            }
          : null);

      sendJson(response, 200, {
        ...share,
        inviteUrl: `${origin}/tasks/sharing?invite=${share.code}`,
        owner,
      });
      return;
    }

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
      const body = sanitizeForeignKeys(await parseBody(request));
      const created = { ...body, id: getNextId(items) };

      db[collection] = [...items, created];
      await writeDb(db);
      sendJson(response, 201, created);
      return;
    }

    if (request.method === "PATCH" && id !== null) {
      const body = sanitizeForeignKeys(await parseBody(request));
      const index = items.findIndex((entry) => entry.id === id);

      if (index === -1) {
        sendJson(response, 404, { message: "Not found" });
        return;
      }

      const updated = { ...items[index], ...body };
      const nextItems = [...items];

      nextItems[index] = updated;
      db[collection] = nextItems;
      await writeDb(db);
      sendJson(response, 200, updated);
      return;
    }

    if (request.method === "DELETE" && id !== null) {
      const exists = items.some((entry) => entry.id === id);

      if (!exists) {
        sendJson(response, 200, {});
        return;
      }

      if (collection === "tasks") {
        db.tasks = ensureCollectionItems(db, "tasks").filter(
          (entry) => entry.id !== id,
        );
        removeItemsByTaskId(db, "taskSteps", id);
        removeItemsByTaskId(db, "taskCategories", id);
        removeItemsByTaskId(db, "attachments", id);
        removeItemsByTaskId(db, "notifications", id);
      } else if (collection === "lists") {
        db.lists = ensureCollectionItems(db, "lists").filter(
          (entry) => entry.id !== id,
        );
        db.tasks = ensureCollectionItems(db, "tasks").map((task) =>
          task.listId === id ? { ...task, listId: null } : task,
        );
      } else if (collection === "listGroups") {
        db.listGroups = ensureCollectionItems(db, "listGroups").filter(
          (entry) => entry.id !== id,
        );
        db.lists = ensureCollectionItems(db, "lists").map((list) =>
          list.groupId === id ? { ...list, groupId: null } : list,
        );
      } else if (collection === "categories") {
        db.categories = ensureCollectionItems(db, "categories").filter(
          (entry) => entry.id !== id,
        );
        removeItemsByField(db, "taskCategories", "categoryId", id);
      } else {
        db[collection] = items.filter((entry) => entry.id !== id);
      }

      await writeDb(db);
      sendJson(response, 200, {});
      return;
    }

    sendJson(response, 405, { message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, {
      message: error instanceof Error ? error.message : "Server error",
    });
  }
}).listen(PORT, HOST, () => {
  console.log(`Mock API running at http://${HOST}:${PORT}`);
});
