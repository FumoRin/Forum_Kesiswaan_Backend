const { createUploadthing } = require("uploadthing/express");
const { createRouteHandler } = require("uploadthing/express");
const { authenticate } = require("../middleware/auth");

const f = createUploadthing();

const uploadRouter = {
  blogImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    },
  })
    .middleware(async (req, res) => {
      return new Promise((resolve, reject) => {
        authenticate(req, res, (err) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve({ userId: req.user.id });
          }
        });
      });
    })
    .onUploadComplete(({ file, metadata }) => {
      console.log(`Upload complete for user ${metadata.userId}`);
      return { url: file.url };
    }),
};

module.exports = {
  uploadHandler: createRouteHandler({
    router: uploadRouter,
    config: {},
  }),
};
