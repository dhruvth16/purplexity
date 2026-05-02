import { type Request, type Response, type NextFunction } from "express";
import { supabase } from "../lib/client";
import { prisma } from "../prisma/db";
import type { AuthProvider } from "../prisma/generated/enums";

export async function authMiddleware(
  req: any,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.id) {
      let existingUser = await prisma.user.findUnique({
        where: {
          email: user.email!,
        },
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            supabaseId: user.id,
            email: user.email!,
            name: user.user_metadata.name,
            provider:
              (user.identities?.[0]?.provider.toUpperCase() as AuthProvider) ||
              undefined,
          },
        });
      }

      req.userId = existingUser.id;
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
