import express from "express";
import { authMiddleware } from "../middleware/middleware";
import { prisma } from "../prisma/db";

const conversationRouter = express.Router();

conversationRouter.get("/", authMiddleware, async (req: any, res) => {
  const userId = req.userId;

  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { messages: true } },
      },
    });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

conversationRouter.get(
  "/:conversationId",
  authMiddleware,
  async (req: any, res) => {
    const { conversationId } = req.params;
    const userId = req.userId;

    try {
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

      res.json(conversation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default conversationRouter;
