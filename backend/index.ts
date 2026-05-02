import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import streamRouter from "./routes/stream.route";
import conversationRouter from "./routes/conversation.route";
import { prisma } from "./prisma/db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.use("/api/stream", streamRouter);
app.use("/api/conversations", conversationRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
