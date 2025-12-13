import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Lưu version vào Convex database
export const saveVersion = mutation({
    args: {
        documentId: v.id("documents"),
        roomId: v.string(),
        versionId: v.string(),
        content: v.string(),
        snapshot: v.any(),
        createdBy: v.string(),
        createdByName: v.optional(v.string()),
        description: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const versionId = await ctx.db.insert("documentVersions", {
            documentId: args.documentId,
            roomId: args.roomId,
            versionId: args.versionId,
            content: args.content,
            snapshot: args.snapshot,
            createdBy: args.createdBy,
            createdByName: args.createdByName,
            description: args.description,
        });

        return versionId;
    },
});

// Lấy tất cả versions của một document
export const getDocumentVersions = query({
    args: {
        documentId: v.id("documents"),
    },
    async handler(ctx, args) {
        const versions = await ctx.db
            .query("documentVersions")
            .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
            .order("desc")
            .collect();

        return versions;
    },
});

// Lấy một version cụ thể
export const getVersion = query({
    args: {
        versionId: v.string(),
    },
    async handler(ctx, args) {
        const version = await ctx.db
            .query("documentVersions")
            .withIndex("by_version_id", (q) => q.eq("versionId", args.versionId))
            .first();

        return version;
    },
});

// Xóa version
export const deleteVersion = mutation({
    args: {
        versionId: v.id("documentVersions"),
    },
    async handler(ctx, args) {
        await ctx.db.delete(args.versionId);
    },
});

// Cập nhật description của version
export const updateVersionDescription = mutation({
    args: {
        versionId: v.id("documentVersions"),
        description: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.patch(args.versionId, {
            description: args.description,
        });
    },
});