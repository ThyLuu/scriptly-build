import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createAiJob = mutation({
    args: {
        runId: v.string(),
        ownerId: v.string(),
        selectedText: v.string(),
        action: v.string(),
        customPrompt: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("aiEditor", {
            runId: args.runId,
            ownerId: args.ownerId,
            selectedText: args.selectedText,
            action: args.action,
            customPrompt: args.customPrompt,
            status: "pending",
        });
    },
});

export const setAiResult = mutation({
    args: {
        runId: v.string(),
        result: v.string(),
    },
    handler: async (ctx, args) => {
        const record = await ctx.db
            .query("aiEditor")
            .withIndex("by_runId", (q) => q.eq("runId", args.runId))
            .unique();

        if (!record) {
            throw new Error(`AI job with runId ${args.runId} not found`);
        }

        await ctx.db.patch(record._id, {
            status: "done",
            result: args.result,
        });
    },
});

export const getAiResult = query({
    args: { runId: v.string() },
    handler: async (ctx, args) => {
        const record = await ctx.db
            .query("aiEditor")
            .withIndex("by_runId", (q) => q.eq("runId", args.runId))
            .unique();

        if (!record) return null;

        return {
            result: record.result || null,
            status: record.status,
        };
    },
});