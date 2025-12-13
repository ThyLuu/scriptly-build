import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        initialContent: v.optional(v.string()),
        ownerId: v.string(),
        roomId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
    })
        .index('by_owner_id', ['ownerId'])
        .index('by_organization_id', ['organizationId'])
        .searchIndex('search_title', {
            searchField: 'title',
            filterFields: ['ownerId', 'organizationId'],
        }),

    users: defineTable({
        userId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    })
        .index('by_user_id', ['userId']),

    chats: defineTable({
        ownerId: v.string(),
        title: v.optional(v.string()),
        lastMessageAt: v.optional(v.number()),
    }).index("by_owner_id", ["ownerId"]),

    messages: defineTable({
        chatId: v.id("chats"),
        senderId: v.string(),
        role: v.union(v.literal("user"), v.literal("ai")),
        content: v.string(),
    }).index("by_chat_id", ["chatId"]),

    files: defineTable({
        documentId: v.id("documents"),
        storageId: v.id("_storage"),
        fileName: v.string(),
        fileType: v.string(),
        fileSize: v.number(),
        uploadedBy: v.string(),
    })
        .index("by_document_id", ["documentId"])
        .index("by_uploaded_by", ["uploadedBy"]),

    aiEditor: defineTable({
        runId: v.string(),
        ownerId: v.string(),
        selectedText: v.string(),
        action: v.string(),            // summarize | rewrite | generate | custom
        customPrompt: v.optional(v.string()),
        status: v.union(
            v.literal("pending"),
            v.literal("done"),
            v.literal("error")
        ),
        result: v.optional(v.string()),
    })
        .index("by_runId", ["runId"])
        .index("by_ownerId", ["ownerId"]),

    documentVersions: defineTable({
        documentId: v.id("documents"),
        roomId: v.string(),
        versionId: v.string(), 
        content: v.string(), 
        snapshot: v.any(), 
        createdBy: v.string(), 
        createdByName: v.optional(v.string()),
        description: v.optional(v.string()), 
    })
        .index("by_document_id", ["documentId"])
        .index("by_room_id", ["roomId"])
        .index("by_version_id", ["versionId"]),
})