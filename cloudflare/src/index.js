function objectNotFound(objectName) {
  return new Response(`${objectName} not found`, { status: 404 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const objectName = url.pathname.slice(1);

    switch (request.method) {
      case 'GET':
        if (objectName === '') {
          return new Response(`Missing object`, { status: 400 });
        }
        try {
          const bucket = env.ARCHIVE;
          const object = await bucket.get(objectName, {
            range: request.headers,
            onlyIf: request.headers,
          });

          if (object === null) {
            return objectNotFound(objectName);
          }

          const headers = new Headers();
          object.writeHttpMetadata(headers);
          headers.set('etag', object.httpEtag);

          if (object.range) {
            headers.set('content-range', `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`);
          }

          const status = object.body ? (request.headers.get('range') !== null ? 206 : 200) : 304;

          return new Response(object.body, {
            headers,
            status,
          });
        } catch (e) {
          return new Response('There was an error processing the request', {
            status: 500,
          });
        }

      case 'POST':
        var action = url.searchParams.get('action');

        switch (action) {
          case 'mpu-create': {
            const multipartUpload = await env.ARCHIVE.createMultipartUpload(objectName);
            return new Response(
              JSON.stringify({
                key: multipartUpload.objectName,
                uploadId: multipartUpload.uploadId,
              })
            );
          }
          case 'mpu-complete': {
            const uploadId = url.searchParams.get('uploadId');
            if (uploadId === null) {
              return new Response('Missing uploadId', { status: 400 });
            }

            const multipartUpload = env.ARCHIVE.resumeMultipartUpload(objectName, uploadId);

            const completeBody = await request.json();
            if (completeBody === null) {
              return new Response('Missing or incomplete body', {
                status: 400,
              });
            }

            // Error handling in case the multipart upload does not exist anymore
            try {
              const object = await multipartUpload.complete(completeBody.parts);
              return new Response(null, {
                headers: {
                  etag: object.httpEtag,
                },
              });
            } catch (error) {
              return new Response(error.message, { status: 400 });
            }
          }
          default:
            return new Response(`Unknown action ${action} for POST`, {
              status: 400,
            });
        }
      case 'PUT':
        var action = url.searchParams.get('action');

        switch (action) {
          case 'mpu-uploadpart': {
            const uploadId = url.searchParams.get('uploadId');
            const partNumberString = url.searchParams.get('partNumber');
            if (partNumberString === null || uploadId === null) {
              return new Response('Missing partNumber or uploadId', {
                status: 400,
              });
            }
            if (request.body === null) {
              return new Response('Missing request body', { status: 400 });
            }

            const partNumber = parseInt(partNumberString);
            const multipartUpload = env.ARCHIVE.resumeMultipartUpload(objectName, uploadId);
            try {
              const uploadedPart = await multipartUpload.uploadPart(partNumber, request.body);
              return new Response(JSON.stringify(uploadedPart));
            } catch (error) {
              return new Response(error.message, { status: 400 });
            }
          }
          default:
            return new Response(`Unknown action ${action} for PUT`, {
              status: 400,
            });
        }
      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { Allow: 'GET, POST, PUT' },
        });
    }
  },
};