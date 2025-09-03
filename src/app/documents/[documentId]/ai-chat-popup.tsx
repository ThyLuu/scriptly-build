"use client"

import { useState, useCallback } from "react"
import { useQuery, useMutation } from "convex/react"
import { PlusIcon, ArrowLeftIcon, TrashIcon, PencilIcon, CheckIcon, XIcon, Sparkles, SendHorizonalIcon, } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useAuth } from "@clerk/nextjs"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function AiChatPopup() {
    const { userId } = useAuth()
    const [chatId, setChatId] = useState<Id<"chats"> | null>(null)
    const [input, setInput] = useState("")
    const [isLoadingAi, setIsLoadingAi] = useState(false)
    const [showChatList, setShowChatList] = useState(true)
    const [editingChatId, setEditingChatId] = useState<Id<"chats"> | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [isNewChat, setIsNewChat] = useState(false)

    // convex mutations
    const createChat = useMutation(api.chats.createChat)
    const deleteChat = useMutation(api.chats.deleteChat)
    const renameChat = useMutation(api.chats.renameChat)
    const sendMessage = useMutation(api.messages.sendMessage)

    // fetch messages
    const messages =
        useQuery(api.messages.getMessages, chatId ? { chatId } : "skip") || []

    // fetch chat list
    const chatList =
        useQuery(api.chats.listChats, userId ? { ownerId: userId } : "skip") || []

    // gửi tin nhắn
    const handleSend = useCallback(async () => {
        if (!input.trim() || !chatId) return
        const msg = input.trim()

        await sendMessage({
            chatId,
            senderId: userId!,
            role: "user",
            content: msg,
        })

        setInput("")
        setIsLoadingAi(true)
        setIsNewChat(false)

        // gọi API AI
        await sendAiChat(chatId, userId!, msg)

        setIsLoadingAi(false)
    }, [input, chatId, sendMessage, userId])

    // tạo chat mới
    const handleNewChat = async () => {
        if (!userId) return
        const newId = await createChat({
            ownerId: userId,
            title: "Chưa có tiêu đề",
        })
        setChatId(newId)
        setShowChatList(false)
        setIsNewChat(true)
    }

    // đổi tên chat
    const handleRenameChat = async (id: Id<"chats">) => {
        if (!editTitle.trim()) return
        await renameChat({ chatId: id, title: editTitle })
        setEditingChatId(null)
        setEditTitle("")
    }

    function formatTime(timestamp?: number) {
        if (!timestamp) return "";
        const d = new Date(timestamp);
        return d.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        });
    }

    const handleSendTopic = async (topic: string) => {
        if (!chatId || !userId) return
        setIsNewChat(false)

        await sendMessage({
            chatId,
            senderId: userId,
            role: "user",
            content: topic,
        })

        setIsLoadingAi(true)
        await sendAiChat(chatId, userId, topic)
        setIsLoadingAi(false)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="fixed bottom-6 left-6 p-3 rounded-full bg-blue-500 text-white shadow-lg">
                    <Sparkles />
                </button>
            </PopoverTrigger>
            
            <PopoverContent
                side="top"
                className="w-96 h-[500px] bg-white shadow-lg rounded-xl flex flex-col z-50"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b">
                    {showChatList ? (
                        <>
                            <span className="font-semibold">Lịch sử trò chuyện</span>
                            <button
                                onClick={handleNewChat}
                                className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                            >
                                <PlusIcon className="w-4 h-4" /> Mới
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowChatList(true)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                            <span className="font-semibold">Trò chuyện</span>
                            <button
                                onClick={handleNewChat}
                                className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                            >
                                <PlusIcon className="w-4 h-4" /> Mới
                            </button>
                        </>
                    )}
                </div>

                {/* Nội dung */}
                {showChatList ? (
                    // Danh sách chat
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {chatList.map((c) => (
                            <div
                                key={c._id}
                                className="p-2 border rounded-lg flex items-center justify-between"
                            >
                                {editingChatId === c._id ? (
                                    <div className="flex-1 flex gap-1">
                                        <input
                                            className="flex-1 border rounded px-2 text-sm"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleRenameChat(c._id)}
                                            className="text-green-600"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingChatId(null)}
                                            className="text-red-600"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            onClick={() => {
                                                setChatId(c._id)
                                                setShowChatList(false)
                                            }}
                                            className="flex-1 cursor-pointer hover:underline"
                                        >
                                            <div className="font-medium hover:underline mb-1">{c.title}</div>
                                            <div className="text-xs text-gray-500">{formatTime(c.lastMessageAt)}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingChatId(c._id)
                                                    setEditTitle(c.title ?? "")
                                                }}
                                                className="text-gray-500 hover:text-gray-800"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await deleteChat({ chatId: c._id })
                                                    if (chatId === c._id) setChatId(null)
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        {/* <button
                            onClick={handleNewChat}
                            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                            <PlusIcon className="w-4 h-4" /> Mới
                        </button> */}
                    </div>
                ) : (
                    // Chat messages
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {isNewChat && messages.length === 0 && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-black px-4 py-3 rounded-2xl shadow border border-gray-200">
                                    <p className="mb-2">👋 Xin chào, tôi giúp gì được cho bạn?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Viết blog", "Viết câu truyện", "Kế hoạch", "Ý tưởng"].map((topic) => (
                                            <button
                                                key={topic}
                                                onClick={() => handleSendTopic(topic)}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition"
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((m) => (
                            <div
                                key={m._id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`p-2 rounded-lg max-w-[70%] overflow-x-auto whitespace-pre-wrap break-words 
                                        ${m.role === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-black"
                                        }`}
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({ node, ...props }) => (
                                                <ScrollArea className="w-full rounded-xl border p-2 bg-white">
                                                    <div className="min-w-max">
                                                        <table
                                                            className="table-auto border-collapse border border-gray-300 rounded-xl shadow-sm overflow-hidden text-sm"
                                                            {...props}
                                                        />
                                                    </div>
                                                    <ScrollBar
                                                        orientation="horizontal"
                                                        forceMount
                                                        className="h-2 mt-1 rounded-full bg-white"
                                                    />
                                                </ScrollArea>
                                            ),
                                            th: ({ node, ...props }) => (
                                                <th
                                                    className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"
                                                    {...props}
                                                />
                                            ),
                                            td: ({ node, ...props }) => (
                                                <td
                                                    className="border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
                                                    {...props}
                                                />
                                            ),
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoadingAi && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-black px-4 py-2 rounded-2xl shadow-sm border border-gray-200">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150" />
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Input */}
                {!showChatList && (
                    <div className="p-3 border-t flex gap-2">
                        <input
                            className="flex-1 border rounded-lg px-3 py-2 text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Hãy viết gì đó..."
                        />
                        <button
                            onClick={handleSend}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            <SendHorizonalIcon className="size-4"/>
                        </button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

async function sendAiChat(
    chatId: Id<"chats">,
    senderId: string,
    message: string
) {
    await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chatId,
            senderId,
            message,
        }),
    })
}
