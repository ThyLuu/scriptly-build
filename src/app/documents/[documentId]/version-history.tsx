'use client'

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useVersionHistory } from "@/hooks/use-version-history";
import { api } from "../../../../convex/_generated/api";
import { Clock, HistoryIcon, X, Trash2, RefreshCcwIcon } from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import { toast } from "sonner";

interface DocumentHistoryProps {
    documentId: Id<"documents">;
    roomId: string;
    userId: string;
    userName?: string;
}

export default function DocumentHistory({
    documentId,
    roomId,
    userId,
    userName,
}: DocumentHistoryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVersionId, setSelectedVersionId] = useState<string>();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [description, setDescription] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const { editor } = useEditorStore();
    const { createSnapshot } = useVersionHistory(documentId, roomId);
    const deleteVersion = useMutation(api.documentVersions.deleteVersion);
    const updateDescription = useMutation(api.documentVersions.updateVersionDescription);

    const convexVersions = useQuery(api.documentVersions.getDocumentVersions, {
        documentId,
    });

    const selectedVersion = useMemo(
        () =>
            convexVersions?.find((version) => version._id === selectedVersionId),
        [selectedVersionId, convexVersions]
    );

    useEffect(() => {
        if (selectedVersion) {
            setEditDescription(selectedVersion.description || "");
        }
    }, [selectedVersion]);


    // Restore version
    const handleRestoreVersion = useCallback(async () => {
        if (!selectedVersion || !editor) return;

        try {
            editor.commands.setContent(selectedVersion.content);
            toast.success("Khôi phục phiên bản thành công");
        } catch (error) {
            console.error("Failed to restore version:", error);
            toast.error("Khôi phục phiên bản thất bại");
        }
    }, [selectedVersion, editor]);

    // Delete version
    const handleDeleteVersion = useCallback(async () => {
        if (!selectedVersion) return;

        const confirmed = window.confirm(
            "Bạn có chắn chăn muốn xóa phiên bản này không? Hành động này không thể hoàn tác"
        );

        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await deleteVersion({
                versionId: selectedVersion._id,
            });

            setSelectedVersionId(undefined);
            toast.success("Đã xóa phiên bản!");
        } catch (error) {
            console.error("Failed to delete version:", error);
            toast.error("Lỗi khi xóa phiên bản");
        } finally {
            setIsDeleting(false);
        }
    }, [selectedVersion, deleteVersion]);

    // Lưu version hiện tại
    const handleSaveVersion = useCallback(async () => {
        if (!editor) {
            toast.error("Trình soạn thảo chưa sẵn sàng");
            return;
        }

        setIsSaving(true);
        try {
            const content = editor.getHTML();
            const timestamp = new Date().toISOString();

            if (!content || content.trim() === "" || content.trim() === "<p></p>") {
                toast.error("Không thể lưu phiên bản trống!");
                setIsSaving(false);
                return;
            }

            await createSnapshot(
                timestamp,
                content,
                editor.getJSON(),
                userId,
                userName,
                description || undefined
            );

            setDescription("");
            toast.success("Đã lưu phiên bản!");
        } catch (error) {
            console.error("Failed to save version:", error);
            toast.error("Lỗi khi lưu phiên bản");
        } finally {
            setIsSaving(false);
        }
    }, [editor, createSnapshot, userId, userName, description]);

    const handleUpdateDescription = useCallback(async () => {
        if (!selectedVersion) return;

        try {
            await updateDescription({
                versionId: selectedVersion._id,
                description: editDescription,
            });

            toast.success("Mô tả đã được cập nhật!");
        } catch (error) {
            console.error("Failed to update description:", error);
            toast.error("Lỗi khi cập nhật mô tả");
        }
    }, [selectedVersion, editDescription, updateDescription]);


    return (
        <>
            {/* History Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Lịch sử phiên bản"
            >
                <HistoryIcon className="w-5 h-5 text-gray-700" />
            </button>

            {/* Popup Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-700" />
                                <h2 className="text-lg font-semibold">Lịch sử phiên bản</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-200 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex overflow-hidden">

                            {/* Sidebar */}
                            <div className="w-72 border-r bg-gray-50 flex flex-col">

                                {/* Save new version */}
                                <div className="p-4 border-b space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-700">Tạo phiên bản mới</h3>
                                    <input
                                        type="text"
                                        placeholder="Mô tả (tuỳ chọn)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                        disabled={isSaving}
                                    />
                                    <button
                                        onClick={handleSaveVersion}
                                        disabled={isSaving}
                                        className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                                    >
                                        {isSaving ? "Đang lưu..." : "Lưu phiên bản"}
                                    </button>
                                </div>

                                {/* Version list */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Danh sách phiên bản</h3>

                                    {!convexVersions ? (
                                        <div className="text-gray-500 text-sm">Đang tải...</div>
                                    ) : convexVersions.length === 0 ? (
                                        <div className="text-gray-500 text-sm">Không có phiên bản nào</div>
                                    ) : (
                                        convexVersions.map((v) => (
                                            <button
                                                key={v._id}
                                                onClick={() => setSelectedVersionId(v._id)}
                                                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedVersionId === v._id
                                                        ? "bg-blue-500 text-white border-blue-500 shadow"
                                                        : "bg-white hover:bg-gray-100 border-gray-300"
                                                    }`}
                                            >
                                                <div className="text-xs font-semibold">
                                                    {new Date(v._creationTime).toLocaleString()}
                                                </div>

                                                {v.description && (
                                                    <div className="text-xs opacity-70 truncate">{v.description}</div>
                                                )}

                                                {v.createdByName && (
                                                    <div className="text-[11px] opacity-60 mt-1">
                                                        bởi {v.createdByName}
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="flex-1 p-6 flex flex-col">
                                {selectedVersion ? (
                                    <>
                                        {/* Action Bar */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800 text-lg">Xem trước</h3>

                                            <div className="flex items-center gap-2">

                                                {/* Edit description */}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        className="px-3 py-2 w-56 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                    />
                                                    <button
                                                        onClick={handleUpdateDescription}
                                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                                    >
                                                        Lưu mô tả
                                                    </button>
                                                </div>

                                                {/* Restore */}
                                                <button
                                                    onClick={handleRestoreVersion}
                                                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                                >
                                                    <RefreshCcwIcon className="w-4 h-4 inline-block mr-1" />
                                                    Khôi phục
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={handleDeleteVersion}
                                                    disabled={isDeleting}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-red-300 flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Xoá
                                                </button>
                                            </div>
                                        </div>

                                        {/* Preview Content */}
                                        <div className="flex-1 overflow-y-auto border rounded-xl bg-white p-6 shadow-inner">
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center flex-1 text-gray-400">
                                        Chọn một phiên bản để xem chi tiết
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}

