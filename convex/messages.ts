import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const sendMessage = mutation({
    args: {
        chatId: v.id("chats"),
        senderId: v.string(),
        role: v.union(v.literal("user"), v.literal("ai")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        await ctx.db.insert("messages", {
            chatId: args.chatId,
            senderId: args.senderId,
            role: args.role,
            content: args.content,
        });

        // 🟢 update vào bảng chats
await ctx.db.patch(args.chatId, { lastMessageAt: now });
    },
})

export const getMessages = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
            .order("asc")
            .collect();
    },
})
