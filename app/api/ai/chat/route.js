// app/api/ai/chat/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/libs/Prisma";
import { chatCompletion } from "@/app/libs/azureOpenAI";

// Stateful, Postgres-backed chat endpoint using ChatSession and ChatMessage.
// Accepts { message: string, sessionId?: string, cartProductIds?: number[] }
// Returns { sessionId, reply }.

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, sessionId: incomingSessionId, cartProductIds = [] } = body;

    if (!message || typeof message !== "string") {
      return new NextResponse("Message is required", { status: 400 });
    }

    // Optional cart context for richer answers
    let cartContext = "";
    if (Array.isArray(cartProductIds) && cartProductIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: cartProductIds.map(Number) } },
        select: {
          id: true,
          title: true,
          description: true,
          priceCents: true,
        },
      });
      cartContext = JSON.stringify(
        products.map((p) => ({
          ...p,
          price: p.priceCents,
        }))
      );
    }

    // 1. Resolve or create session
    let sessionId = incomingSessionId;
    let session = null;

    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {},
        include: { messages: true },
      });
      sessionId = session.id;
    }

    // 2. Build message history for the model
    const history = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    history.push({ role: "user", content: message });

    const systemPrompt =
      "You are Magicommerce, an AI shopping assistant. Be concise, helpful, and never " +
      "fabricate product availability beyond what the catalog logically supports.";

    const contextPrompt = `Cart / context products: ${cartContext || "none"}`;

    // 3. Call Azure OpenAI
    const assistantReply = await chatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: contextPrompt },
        ...history,
      ],
      maxTokens: 512,
      temperature: 0.5,
    });

    // 4. Persist both user + assistant messages
    await prisma.chatMessage.createMany({
      data: [
        {
          role: "user",
          content: message,
          sessionId,
        },
        {
          role: "assistant",
          content: assistantReply,
          sessionId,
        },
      ],
    });

    return NextResponse.json({ sessionId, reply: assistantReply });
  } catch (error) {
    console.error("[chat-api]", error);
    return new NextResponse("Chat error", { status: 500 });
  }
}
