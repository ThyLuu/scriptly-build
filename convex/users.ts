import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
    args: {
        userId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        }

        return await ctx.db.insert("users", args);
    }
})