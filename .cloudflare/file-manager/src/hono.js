import { Hono } from "hono";
import { cors } from "hono/cors";
import { Credentials, App } from "realm-web";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "https://archive.raulcarini.dev",
    allowMethods: ["GET", "POST", "PUT", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("There was an error processing the request", 500);
});

const handleGet = async (c, env, objectName, publicHost) => {
  const app = new App({ id: env.MONGODB_APP_ID });
  await app.logIn(Credentials.apiKey(env.MONGODB_API_KEY));

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const database = mongodb.db("production");

  if (publicHost) {
    const searchFile = await database.collection("files").findOne({
      name: objectName,
      public: true,
    });

    if (!searchFile) {
      return c.text(
        "Invalid Request: the file doesn't exist or isn't public",
        400
      );
    }
  } else {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) return c.text("Missing or invalid Authorization header", 401);

    const searchToken = await database.collection("tokens").findOne({
      token: token,
      file: encodeURIComponent(objectName),
      type: "download",
      used: false,
    });

    if (!searchToken) {
      return c.text("Invalid Request: the token is invalid or expired", 400);
    }

    await database.collection("tokens").updateOne(
      { _id: searchToken._id },
      {
        $set: {
          used: true,
          downloadDate: new Date(),
          country: c.req.raw.cf.country,
          city: c.req.raw.cf.city,
        },
      }
    );
  }

  await app.currentUser.logOut();

  const object = await env.ARCHIVE.get(encodeURIComponent(objectName), {
    range: c.req.raw.headers,
    onlyIf: c.req.raw.headers,
  });

  if (object === null) {
    return c.text(`${objectName} not found`, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  if (object.range) {
    headers.set(
      "content-range",
      `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${
        object.size
      }`
    );
  }

  const status = object.body ? 200 : 304;
  return new Response(object.body, { headers, status });
};

const handlePost = async (c, env, objectName) => {
  const action = c.req.query("action");
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return c.text("Missing or invalid Authorization header", 401);

  const app = new App({ id: env.MONGODB_APP_ID });
  await app.logIn(Credentials.apiKey(env.MONGODB_API_KEY));

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const database = mongodb.db("production");
  const searchToken = await database.collection("tokens").findOne({
    token: token,
    file: objectName,
    type: "upload",
    used: false,
  });

  if (!searchToken) {
    return c.text("Invalid Request: the token is invalid or expired", 400);
  }

  switch (action) {
    case "mpu-create": {
      await app.currentUser.logOut();
      const multipartUpload = await env.ARCHIVE.createMultipartUpload(
        objectName
      );
      return c.json(
        {
          key: multipartUpload.objectName,
          uploadId: multipartUpload.uploadId,
        },
        201
      );
    }
    case "mpu-complete": {
      const uploadId = c.req.query("uploadId");
      if (!uploadId) return c.text("Missing uploadId", 400);

      const multipartUpload = env.ARCHIVE.resumeMultipartUpload(
        objectName,
        uploadId
      );

      const completeBody = await c.req.json();
      if (!completeBody) return c.text("Missing or incomplete body", 400);

      try {
        await multipartUpload.complete(completeBody.parts);
        await database.collection("tokens").updateOne(
          { _id: searchToken._id },
          {
            $set: {
              used: true,
              uploadDate: new Date(),
              country: c.req.raw.cf.country,
              city: c.req.raw.cf.city,
            },
          }
        );
        await app.currentUser.logOut();
        return c.text(null, 201);
      } catch (error) {
        return c.text(error.message, 400);
      }
    }
    default:
      return c.text(`Unknown action ${action} for POST`, 400);
  }
};

const handlePut = async (c, env, objectName) => {
  const action = c.req.query("action");
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return c.text("Missing or invalid Authorization header", 401);

  const app = new App({ id: env.MONGODB_APP_ID });
  await app.logIn(Credentials.apiKey(env.MONGODB_API_KEY));

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const database = mongodb.db("production");
  const searchToken = await database.collection("tokens").findOne({
    token: token,
    file: objectName,
    type: "upload",
    used: false,
  });

  if (!searchToken) {
    return c.text("Invalid Request: the token is invalid or expired", 400);
  }

  await app.currentUser.logOut();

  if (action === "mpu-uploadpart") {
    const uploadId = c.req.query("uploadId");
    const partNumberString = c.req.query("partNumber");

    if (!partNumberString || !uploadId) {
      return c.text("Missing partNumber or uploadId", 400);
    }

    const body = await c.req.parseBody();
    const file = body.file;

    if (!file) {
      return c.text("Missing file in request body", 400);
    }

    try {
      const partNumber = parseInt(partNumberString);
      const multipartUpload = env.ARCHIVE.resumeMultipartUpload(
        objectName,
        uploadId
      );
      const uploadedPart = await multipartUpload.uploadPart(partNumber, file);
      return c.json(uploadedPart, 201);
    } catch (error) {
      return c.text(error.message, 400);
    }
  }

  return c.text(`Unknown action ${action} for PUT`, 400);
};

app.get("/:objectName", async (c) => {
  const { objectName } = c.req.param();
  const publicHost = c.req.header("host")?.startsWith("public");
  return handleGet(c, c.env, objectName, publicHost);
});

app.post("/:objectName", async (c) => {
  const { objectName } = c.req.param();
  return handlePost(c, c.env, encodeURIComponent(objectName));
});

app.put("/:objectName", async (c) => {
  const { objectName } = c.req.param();
  return handlePut(c, c.env, encodeURIComponent(objectName));
});

export default app;
