import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createChat = mutation({
    args: {
        ownerId: v.string(),
        title: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const chatId = await ctx.db.insert("chats", {
            ownerId: args.ownerId,
            title: args.title ?? "Chưa có tiêu đề",
            lastMessageAt: now,
        });
        return chatId;
    },
})

export const listChats = query({
    args: { ownerId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chats")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", args.ownerId))
            .order("desc")
            .collect();
    },
})

export const deleteChat = mutation({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        // xóa toàn bộ messages trong chat
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
            .collect();

        for (const m of messages) {
            await ctx.db.delete(m._id);
        }

        // xóa chat
        await ctx.db.delete(args.chatId);
    },
})

export const renameChat = mutation({
  args: {
    chatId: v.id("chats"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, { title: args.title });
  },
})
