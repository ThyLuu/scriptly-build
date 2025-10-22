import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const getFileUrl = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, { storageId }) => {
        return await ctx.storage.getUrl(storageId);
    },
});

export const saveFile = mutation({
    args: {
        documentId: v.id("documents"),
        storageId: v.id("_storage"),
        fileName: v.string(),
        fileType: v.string(),
        fileSize: v.number(),
        uploadedBy: v.string(),
    },
    handler: async (ctx, args) => {
        // console.log("saveFile args:", args);

        // await ctx.db.insert("files", {
        //     documentId: args.documentId,
        //     storageId: args.storageId,
        //     fileName: args.fileName,
        //     fileType: args.fileType,
        //     fileSize: args.fileSize,
        //     uploadedBy: args.uploadedBy,
        // });
        await ctx.db.insert("files", args);
    },
});

export const getFilesByDocument = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, { documentId }) => {
        return await ctx.db
            .query("files")
            .withIndex("by_document_id", (q) => q.eq("documentId", documentId))
            .collect();
    },
});