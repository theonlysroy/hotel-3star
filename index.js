import { buildServer } from "./src/app.js";
import connectDb from "./src/db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const port = process.env.PORT || 8002;
async function start() {
  const app = buildServer();
  try {
    await connectDb();
    app.log.info("Db connected...");
    app.listen({ port }, () => {
      console.log(`Server @ http://localhost:${port}`);
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
