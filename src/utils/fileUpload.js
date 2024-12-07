import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { BASE_URL } from "../../constants.js";

const fileUploader = async (data) => {
  const [imageFileName, imageFileExt] = data?.filename.split(".");
  const newImageFileName = `${imageFileName}-${Date.now()}.${imageFileExt}`;
  const filePath = path.join(BASE_URL, "tmp", "uploads");
  await pipeline(
    data.file,
    createWriteStream(`${filePath}/${newImageFileName}`),
  );
  return String(newImageFileName);
};

export default fileUploader;
