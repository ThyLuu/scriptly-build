import { useMutation } from "convex/react";
import { useCallback } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface EditorSnapshot {
    [key: string]: unknown;
}

export const useVersionHistory = (documentId: Id<"documents">, roomId: string) => {
    const saveVersion = useMutation(api.documentVersions.saveVersion);

    // Lưu version khi người dùng click "Save"
    const createSnapshot = useCallback(
        async (
            versionId: string,
            content: string,
            snapshot: EditorSnapshot,
            userId: string,
            userName?: string,
            description?: string
        ) => {
            try {
                // Chỉ lưu vào Convex database, không gọi Liveblocks API
                const dbVersionId = await saveVersion({
                    documentId,
                    roomId,
                    versionId,
                    content,
                    snapshot,
                    createdBy: userId,
                    createdByName: userName,
                    description,
                });

                return dbVersionId;
            } catch (error) {
                console.error("Failed to create version:", error);
                throw error;
            }
        },
        [documentId, roomId, saveVersion]
    );

    return { createSnapshot };
};

// Liveblocks version creation is optional - can be skipped
// Only save to Convex database is required

// Hàm restore version từ Convex (sử dụng saved content)
export const restoreVersionFromConvex = async (
    content: string,
    setEditorContent?: (content: string) => void
) => {
    try {
        // Callback để update editor với content của version được restore
        if (setEditorContent) {
            setEditorContent(content);
        }
        return { success: true, content };
    } catch (error) {
        console.error("Error restoring version:", error);
        throw error;
    }
};