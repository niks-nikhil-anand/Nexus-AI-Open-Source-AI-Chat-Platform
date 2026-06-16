import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id || null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    });
    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Fetch chats error:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, id } = body;
    
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let chat;
    if (id) {
      chat = await prisma.chat.upsert({
        where: { id },
        update: {},
        create: {
          id,
          title,
          userId,
        },
      });
      
      if (chat.userId !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      chat = await prisma.chat.create({
        data: {
          title,
          userId,
        },
      });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
