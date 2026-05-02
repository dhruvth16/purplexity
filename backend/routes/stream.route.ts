import express from "express";
import { streamService, followUpStreamService } from "../services/stream.service";
import { authMiddleware } from "../middleware/middleware";
import { prisma } from "../prisma/db";

const streamRouter = express.Router();

streamRouter.post("/", authMiddleware, async (req: any, res) => {
  const { query } = req.body;
  const userId = req.userId;

  if (!query || !userId) {
    return res.status(400).json({ error: "Query and user ID are required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { response, sources } = await streamService(query as string);

    let content = "";
    for await (const chunk of response) {
      if (chunk?.text) {
        res.write(chunk.text);
        content += chunk.text;
      }
    }

    if (userId) {
      const conversation = await prisma.conversation.create({
        data: {
          userId,
          title: query.length > 50 ? query.substring(0, 47) + "..." : query,
          slug: query.toLowerCase().replace(/\s+/g, "-").substring(0, 50),
        },
      });

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content:
            content +
            "\n\nSources:\n" +
            sources.map((s: any) => s.url).join("\n"),
        },
      });
    }

    res.write("\n<SOURCES>\n");

    const source = sources.map((result: any) => ({
      url: result.url,
    }));

    res.write(JSON.stringify(source));
    res.write("\n</SOURCES>\n");

    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.end();
    }
  }
});

streamRouter.post("/follow_up", authMiddleware, async (req: any, res) => {
  const { query, conversationId } = req.body;
  const userId = req.userId;

  if (!query || !userId || !conversationId) {
    return res
      .status(400)
      .json({ error: "Query, user ID, and conversation ID are required" });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  if (conversation.userId !== userId) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  //@ts-ignore
  const conversationContext = conversation.messages
    .map((msg: any) => msg.content)
    .join("\n---\n");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { response, sources } = await followUpStreamService(
      query,
      conversationContext,
    );

    let content = "";
    for await (const chunk of response) {
      if (chunk?.text) {
        res.write(chunk.text);
        content += chunk.text;
      }
    }

    // Save the follow-up response as a new message in the same conversation
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content:
          content +
          "\n\nSources:\n" +
          sources.map((s: any) => s.url).join("\n"),
      },
    });

    res.write("\n<SOURCES>\n");

    const source = sources.map((result: any) => ({
      url: result.url,
    }));

    res.write(JSON.stringify(source));
    res.write("\n</SOURCES>\n");

    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.end();
    }
  }
});

export default streamRouter;

