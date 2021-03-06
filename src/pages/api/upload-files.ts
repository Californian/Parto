import aws from "aws-sdk";
import multer from "multer";
import nextConnect from "next-connect";

const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_PARTO,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_PARTO,
  },
  region: "us-east-2",
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "parto-dev",
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    (res as any)
      .status(500)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    (res as any)
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req, res) => {
  (res as any).status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
