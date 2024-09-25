import { Credentials, App } from "realm-web";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const objectName = url.pathname.slice(1);
    const app = new App({ id: env.MONGODB_APP_ID });

    const headers = new Headers(); // Added headers for CORS
    headers.set(
      "Access-Control-Allow-Origin",
      "https://archive.raulcarini.dev"
    ); // Allow only a domain
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT"); // Allow specific methods
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers

    if (request.method === "OPTIONS") {
      // Handle preflight requests
      return new Response(null, {
        headers,
        status: 204,
      });
    }

    if (objectName === "") {
      return new Response(`Missing object`, { headers, status: 400 });
    }

    const host = String(request.headers.get("host"));
    const publicHost = host.startsWith("public");
    if (publicHost) {
      if (request.method === "GET") {
        try {
          await app.logIn(Credentials.apiKey(env.MONGODB_API_KEY));

          let mongodb = app.currentUser.mongoClient("mongodb-atlas");
          let database = mongodb.db("production");
          let searchFile = await database.collection("files").findOne({
            name: objectName,
            public: true,
          });

          if (!searchFile) {
            return new Response(
              `Invalid Request: the file doesn't exist or isn't public`,
              { headers, status: 400 }
            );
          }
          await app.currentUser.logOut();

          const object = await env.ARCHIVE.get(objectName, {
            range: request.headers,
            onlyIf: request.headers,
          });

          if (object === null) {
            return new Response(`${objectName} not found`, {
              headers,
              status: 404,
            });
          }

          object.writeHttpMetadata(headers);
          headers.set("etag", object.httpEtag);

          if (object.range) {
            headers.set(
              "content-range",
              `bytes ${object.range.offset}-${
                object.range.end ?? object.size - 1
              }/${object.size}`
            );
          }

          const status = object.body
            ? request.headers.get("range") !== null
              ? 206
              : 200
            : 304;

          return new Response(object.body, {
            headers,
            status,
          });
        } catch (e) {
          console.log(e);
          return new Response("There was an error processing the request", {
            headers,
            status: 500,
          });
        }
      }
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { ...headers, Allow: "GET" },
      });
    }

    const authorization = request.headers.get("Authorization");
    if (authorization === null) {
      return new Response("Missing Authorization header", {
        headers,
        status: 401,
      });
    }

    const tokenParts = authorization.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return new Response("Invalid Authorization header", {
        headers,
        status: 401,
      });
    }

    const token = tokenParts[1];

    switch (request.method) {
      case "GET":
        try {
          await app.logIn(Credentials.apiKey(env.MONGODB_API_KEY));

          let mongodb = app.currentUser.mongoClient("mongodb-atlas");
          let database = mongodb.db("production");
          let searchToken = await database.collection("tokens").findOne({
            token: token,
            file: objectName,
            type: "download",
            used: false,
          });

          if (!searchToken) {
            return new Response(
              `Invalid Request: the token is invalid or expired`,
              { headers, status: 400 }
            );
          }
          const object = await env.ARCHIVE.get(objectName, {
            range: request.headers,
            onlyIf: request.headers,
          });

          if (object === null) {
            return new Response(`${objectName} not found`, {
              headers,
              status: 404,
            });
          }

          object.writeHttpMetadata(headers);
          headers.set("etag", object.httpEtag);

          if (object.range) {
            headers.set(
              "content-range",
              `bytes ${object.range.offset}-${
                object.range.end ?? object.size - 1
              }/${object.size}`
            );
          }

          const status = object.body
            ? request.headers.get("range") !== null
              ? 206
              : 200
            : 304;

          await database
            .collection("tokens")
            .updateOne(
              { _id: searchToken._id },
              {
                $set: {
                  used: true,
                  downloadDate: new Date(),
                  country: request.cf.country,
                  city: request.cf.city,
                },
              }
            );
          await app.currentUser.logOut();
          return new Response(object.body, {
            headers,
            status,
          });
        } catch (e) {
          console.log(e);
          return new Response("There was an error processing the request", {
            headers,
            status: 500,
          });
        }

      case "POST":
        var action = url.searchParams.get("action");

        try {
          await app.logIn(Credentials.apiKey(env.MONGODB_API_KEY));

          let mongodb = app.currentUser.mongoClient("mongodb-atlas");
          let database = mongodb.db("production");
          let searchToken = await database.collection("tokens").findOne({
            token: token,
            file: objectName,
            type: "upload",
            used: false,
          });

          if (!searchToken) {
            return new Response(
              `Invalid Request: the token is invalid or expired`,
              { headers, status: 400 }
            );
          }
          switch (action) {
            case "mpu-create": {
              await app.currentUser.logOut();
              const multipartUpload = await env.ARCHIVE.createMultipartUpload(
                objectName
              );
              return new Response(
                JSON.stringify({
                  key: multipartUpload.objectName,
                  uploadId: multipartUpload.uploadId,
                }),
                { headers, status: 201 }
              );
            }
            case "mpu-complete": {
              const uploadId = url.searchParams.get("uploadId");
              if (uploadId === null) {
                return new Response("Missing uploadId", {
                  headers,
                  status: 400,
                });
              }

              const multipartUpload = env.ARCHIVE.resumeMultipartUpload(
                objectName,
                uploadId
              );

              const completeBody = await request.json();
              if (completeBody === null) {
                return new Response("Missing or incomplete body", {
                  headers,
                  status: 400,
                });
              }

              // Error handling in case the multipart upload does not exist anymore
              try {
                const object = await multipartUpload.complete(
                  completeBody.parts
                );
                await database
                  .collection("tokens")
                  .updateOne(
                    { _id: searchToken._id },
                    {
                      $set: {
                        used: true,
                        uploadDate: new Date(),
                        country: request.cf.country,
                        city: request.cf.city,
                      },
                    }
                  );
                await app.currentUser.logOut();
                return new Response(null, {
                  headers,
                  status: 201,
                });
              } catch (error) {
                return new Response(error.message, { headers, status: 400 });
              }
            }
            default:
              return new Response(`Unknown action ${action} for POST`, {
                headers,
                status: 400,
              });
          }
        } catch (error) {
          return new Response(error.message, { headers, status: 500 });
        }
      case "PUT":
        var action = url.searchParams.get("action");

        try {
          await app.logIn(Credentials.apiKey(env.MONGODB_API_KEY));

          let mongodb = app.currentUser.mongoClient("mongodb-atlas");
          let database = mongodb.db("production");
          let searchToken = await database.collection("tokens").findOne({
            token: token,
            file: objectName,
            type: "upload",
            used: false,
          });

          if (!searchToken) {
            return new Response(
              `Invalid Request: the token is invalid or expired`,
              { headers, status: 400 }
            );
          }

          await app.currentUser.logOut();
        } catch (error) {
          return new Response(error.message, { headers, status: 500 });
        }

        switch (action) {
          case "mpu-uploadpart": {
            const uploadId = url.searchParams.get("uploadId");
            const partNumberString = url.searchParams.get("partNumber");
            if (partNumberString === null || uploadId === null) {
              return new Response("Missing partNumber or uploadId", {
                headers,
                status: 400,
              });
            }
            const formData = await request.formData();
            const file = formData.get("file");
            
            if (file === null) {
              return new Response("Missing request body", {
                headers,
                status: 400,
              });
            }

            try {
              const partNumber = parseInt(partNumberString);
              const multipartUpload = env.ARCHIVE.resumeMultipartUpload(
                objectName,
                uploadId
              );
              const uploadedPart = await multipartUpload.uploadPart(
                partNumber,
                file
              );
              return new Response(JSON.stringify(uploadedPart), {
                headers,
                status: 201,
              });
            } catch (error) {
              return new Response(error.message, { headers, status: 400 });
            }
          }
          default:
            return new Response(`Unknown action ${action} for PUT`, {
              status: 400,
              headers,
            });
        }
      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { ...headers, Allow: "GET, POST, PUT" },
        });
    }
  },
};
