'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, Bot, Brush, ChevronDownIcon, Code, HighlighterIcon, ImageIcon, ItalicIcon, Link2Icon, ListCollapseIcon, ListIcon, ListOrderedIcon, ListTodoIcon, Loader2Icon, LucideIcon, MessageSquarePlusIcon, Mic, MinusIcon, PlusIcon, PrinterIcon, QuoteIcon, Redo2Icon, RemoveFormattingIcon, SearchIcon, Sigma, SpellCheckIcon, UnderlineIcon, Undo2Icon, UploadIcon, YoutubeIcon } from "lucide-react";
import { type Level } from '@tiptap/extension-heading'
import { type ColorResult, SketchPicker } from 'react-color'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Rnd } from 'react-rnd'
import { Tldraw } from "tldraw";
import 'tldraw/tldraw.css'
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
// import { Editor } from '@tiptap/react'
// import { Editor as TiptapEditor } from '@tiptap/react'
import { Editor as TldrawEditor } from 'tldraw'
import ReactMarkdown from "react-markdown"
import type { Editor } from "@tiptap/core"

interface AiEditorAction {
    action: "summarize" | "rewrite" | "generate" | "custom";
    customPrompt?: string;
}

interface AIEditorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editor: Editor | null
}

const AIEditor = ({ open, onOpenChange, editor }: AIEditorProps) => {
    const [loading, setLoading] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [aiResult, setAiResult] = useState("");
    const [editMode, setEditMode] = useState(false);
    const MAX_POLLING_TIME = 30000;

    const waitForAiResult = async (runId: string) => {
        const startTime = Date.now();
        
        while (Date.now() - startTime < MAX_POLLING_TIME) {
            try {
                const res = await fetch(`/api/ai-editor-result?runId=${runId}`);
                
                if (!res.ok) {
                    console.error(`API error: ${res.status}`);
                    await new Promise(res => setTimeout(res, 1000));
                    continue;
                }

                const data = await res.json();
                
                if (data.result) {
                    setAiResult(data.result);
                    return;
                }
                
                if (data.status === "error") {
                    setAiResult("❌ Lỗi xử lý. Vui lòng thử lại.");
                    return;
                }

                await new Promise(res => setTimeout(res, 1000));
            } catch (err) {
                console.error("Polling error:", err);
                await new Promise(res => setTimeout(res, 1000));
            }
        }
        
        setAiResult("⏱️ Hết thời gian chờ. Vui lòng thử lại.");
    };

    const getSelectedText = () => {
        if (!editor) return "";
        const { from, to } = editor.state.selection;
        return editor.state.doc.textBetween(from, to, " ").trim();
    };

    const sendAiRequest = async ({ action, customPrompt }: AiEditorAction) => {
        const selectedText = getSelectedText();
        
        if (!selectedText) {
            alert("Hãy bôi đen một đoạn văn bản trước khi dùng AI!");
            return;
        }

        setLoading(true);
        setAiResult("");
        setEditMode(false);

        try {
            const runId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const res = await fetch("/api/ai-editor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    runId,
                    selectedText, 
                    action, 
                    customPrompt: customPrompt || "" 
                }),
            });

            if (!res.ok) {
                alert(`Lỗi: ${res.status}`);
                setLoading(false);
                return;
            }

            const data = await res.json();
            
            if (data.error) {
                alert(`Lỗi: ${data.error}`);
                setLoading(false);
                return;
            }

            console.log("RunId gửi:", runId);

            await waitForAiResult(runId);
        } catch (err) {
            console.error("Error:", err);
            alert("Không thể gọi AI. Vui lòng thử lại.");
            setAiResult("");
        } finally {
            setLoading(false);
        }
    };

    const insertToEditor = () => {
        if (!aiResult || aiResult.startsWith("❌") || aiResult.startsWith("⏱️")) {
            alert("Không thể chèn lỗi. Vui lòng thử lại.");
            return;
        }
        
        if (!editor) {
            alert("Trình biên tập chưa sẵn sàng. Vui lòng thử lại.");
            return;
        }

        // Nếu dùng TipTap với Markdown extension
        // editor sẽ tự động parse markdown
        editor.chain().focus().insertContent(aiResult).run();
        
        // Nếu không có Markdown extension, convert markdown sang HTML
        // const html = markdownToHtml(aiResult);
        // editor.chain().focus().insertContent(html).run();
        
        setAiResult("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Công cụ AI chỉnh sửa</DialogTitle>
                </DialogHeader>

                {/* DANH SÁCH CÁC NÚT TOOL */}
                <div className="flex flex-col gap-2">
                    <Button 
                        disabled={loading} 
                        variant="secondary"
                        onClick={() => sendAiRequest({ action: "summarize" })}
                    >
                        {loading && <Loader2Icon className="animate-spin mr-2" size={16} />}
                        Tóm tắt
                    </Button>

                    <Button 
                        disabled={loading} 
                        variant="secondary"
                        onClick={() => sendAiRequest({ action: "rewrite" })}
                    >
                        {loading && <Loader2Icon className="animate-spin mr-2" size={16} />}
                        Viết lại
                    </Button>

                    <Button 
                        disabled={loading} 
                        variant="secondary"
                        onClick={() => sendAiRequest({ action: "generate" })}
                    >
                        {loading && <Loader2Icon className="animate-spin mr-2" size={16} />}
                        Mở rộng nội dung
                    </Button>

                    {/* CUSTOM PROMPT */}
                    <div className="mt-3 border-t pt-3">
                        <input
                            className="w-full px-3 py-2 rounded border text-sm"
                            placeholder="Yêu cầu tùy chỉnh..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            disabled={loading}
                        />
                        <Button
                            disabled={loading || !customPrompt.trim()}
                            className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => sendAiRequest({ action: "custom", customPrompt })}
                        >
                            {loading && <Loader2Icon className="animate-spin mr-2" size={16} />}
                            Gửi yêu cầu
                        </Button>
                    </div>
                </div>

                {aiResult && (
                    <div className="mt-4 border-t pt-3">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Kết quả AI:</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditMode(!editMode)}
                                disabled={aiResult.startsWith("❌") || aiResult.startsWith("⏱️")}
                            >
                                {editMode ? "Xem" : "Sửa"}
                            </Button>
                        </div>

                        {editMode ? (
                            // Mode chỉnh sửa: textarea text thuần
                            <textarea
                                className="w-full h-40 px-3 py-2 border rounded text-sm font-mono"
                                value={aiResult}
                                onChange={(e) => setAiResult(e.target.value)}
                                readOnly={aiResult.startsWith("❌") || aiResult.startsWith("⏱️")}
                            />
                        ) : (
                            // Mode xem: render markdown
                            <div className="w-full max-h-96 overflow-y-auto p-3 border rounded bg-gray-50">
                                <ReactMarkdown
                                    components={{
                                        h1: ({children}) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
                                        h2: ({children}) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
                                        h3: ({children}) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
                                        p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
                                        ul: ({children}) => <ul className="list-disc list-inside mb-2 ml-2">{children}</ul>,
                                        ol: ({children}) => <ol className="list-decimal list-inside mb-2 ml-2">{children}</ol>,
                                        li: ({children}) => <li className="mb-1">{children}</li>,
                                        blockquote: ({children}) => (
                                            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2 text-gray-600">
                                                {children}
                                            </blockquote>
                                        ),
                                        code: ({children}) => (
                                            <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                                                {children}
                                            </code>
                                        ),
                                        a: ({href, children}) => <a href={href} className="text-blue-500 underline">{children}</a>,
                                    }}
                                >
                                    {aiResult}
                                </ReactMarkdown>
                            </div>
                        )}

                        <div className="flex gap-2 mt-3">
                            <Button 
                                disabled={aiResult.startsWith("❌") || aiResult.startsWith("⏱️")}
                                className="flex-1 bg-green-600 text-white hover:bg-green-700" 
                                onClick={insertToEditor}
                            >
                                Chèn vào tài liệu
                            </Button>
                            <Button 
                                disabled={loading || aiResult.startsWith("❌") || aiResult.startsWith("⏱️")}
                                className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600"
                                onClick={() => sendAiRequest({ action: "custom", customPrompt: aiResult })}
                            >
                                Gửi lại
                            </Button>
                            <Button 
                                className="flex-1 bg-red-500 text-white hover:bg-red-600"
                                onClick={() => setAiResult("")}
                            >
                                Xóa
                            </Button>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface DrawingWindowProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (dataUrl: string) => void;
}

// function Helper() {
//     const editor = useEditor();

//     useEffect(() => {
//         const container = editor.getContainer();
//         const focusOnPointerDown = () => editor.focus();
//         container.addEventListener('pointerdown', focusOnPointerDown);
//         return () => {
//             container.removeEventListener('pointerdown', focusOnPointerDown);
//         };
//     }, [editor]);

//     return null;
// }

const DrawingWindow = ({ open, onClose, onSubmit }: DrawingWindowProps) => {
    // const [editor, setEditor] = useState<any>(null);
    const [editor, setEditor] = useState<TldrawEditor | null>(null);

    if (!open) return null;

    const handleSave = async () => {
        if (!editor) return;

        const ids = Array.from(editor.getCurrentPageShapeIds());
        if (ids.length === 0) {
            alert("Không có gì để xuất!");
            return;
        }

        const svg = await editor.getSvg(ids);
        if (!svg) return;

        const dataUrl = `data:image/svg+xml;base64,${btoa(
            new XMLSerializer().serializeToString(svg)
        )}`;

        onSubmit(dataUrl);
        onClose();
    }

    return (
        <Rnd
            default={{ x: 100, y: 0, width: 1000, height: 600 }}
            minWidth={400}
            minHeight={300}
            bounds="window"
            dragHandleClassName="drawing-header"
            className="shadow-lg border absolute border-gray-300 bg-white rounded-lg z-50 flex flex-col overflow-visible"
        >
            <div className="flex flex-col h-full w-full">
                <div className="drawing-header flex items-center justify-between bg-gray-100 px-3 py-2 cursor-move border-b relative z-10">
                    <span className="font-medium">🎨 Bảng vẽ</span>
                    <div className="space-x-2">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                        <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-700 text-white"
                            onClick={handleSave}
                        >
                            Chèn
                        </Button>
                    </div>
                </div>

                <div className="flex-grow relative">
                    <div className="h-full w-full pointer-events-none">
                        <Tldraw
                            persistenceKey="disable-pages"
                            options={{ maxPages: 1 }}
                            onMount={(editorInstance) => setEditor(editorInstance)}
                            className="pointer-events-auto"
                        />
                    </div>
                </div>

            </div>
        </Rnd>
    );
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

function startVoiceToText() {
    // @ts-expect-error - SpeechRecognition chưa có type đầy đủ
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
        alert("Trình duyệt của bạn không hỗ trợ Speech Recognition.")
        return
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.start();

    recognition.onstart = () => {
        console.log("Đang nghe giọng nói...")
    };

    // recognition.onresult = (event: any) => {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        console.log("Kết quả chuyển đổi:", transcript)

        // Chèn vào editor
        const { editor } = useEditorStore.getState();
        editor?.chain().focus().insertContent(transcript).run()
    }

    // recognition.onerror = (event: any) => {
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "not-allowed") {
            return;
        }

        if (event.error === "no-speech") {
            return;
        }
    }

    recognition.onend = () => {
        console.log("Kết thúc thu âm.")
    }
}

interface MathModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (formula: string, displayMode: boolean) => void
}

const MathModal = ({ open, onOpenChange, onSubmit }: MathModalProps) => {
    const [formula, setFormula] = useState("")
    const [displayMode, setDisplayMode] = useState(false) // false = inline, true = block

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chèn công thức toán học</DialogTitle>
                </DialogHeader>

                <textarea
                    className="w-full border rounded p-2 font-mono text-sm"
                    placeholder="Nhập công thức LaTeX, ví dụ: \frac{a}{b}"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                />

                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="displayMode"
                        checked={displayMode}
                        onChange={(e) => setDisplayMode(e.target.checked)}
                    />
                    <label htmlFor="displayMode">Dạng block</label>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                            onSubmit(formula, displayMode)
                            onOpenChange(false)
                        }}
                    >
                        Thêm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface YoutubeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (url: string, width: number, height: number) => void
}

const YoutubeModal = ({ open, onOpenChange, onSubmit }: YoutubeModalProps) => {
    const [url, setUrl] = useState("")
    const [width, setWidth] = useState(640)
    const [height, setHeight] = useState(480)
    // const [align, setAlign] = useState<"left" | "center" | "right">("center")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm YouTube video</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="YouTube URL"
                        className="w-full border px-3 py-2 rounded"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="w-1/2 border px-3 py-2 rounded"
                            placeholder="Width"
                            value={width}
                            onChange={e => setWidth(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            className="w-1/2 border px-3 py-2 rounded"
                            placeholder="Height"
                            value={height}
                            onChange={e => setHeight(Number(e.target.value))}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            onSubmit(url, width, height)
                            onOpenChange(false)
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Thêm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const LineHeightButton = () => {
    const { editor } = useEditorStore()

    const lineHeights = [
        {
            label: 'Mặc định',
            value: 'normal',
        },
        {
            label: 'Đơn',
            value: '1',
        },
        {
            label: '1.5',
            value: '1.5',
        },
        {
            label: 'Kép',
            value: '2',
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <ListCollapseIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-1 flex flex-col gapy-1">
                {lineHeights.map(({ label, value }) => (
                    <button key={value}
                        onClick={() => editor?.chain().focus().setLineHeight(value).run()}
                        className={cn('flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
                            editor?.getAttributes('paragraph').lineHeights === value && 'bg-neutral-200/80'
                        )}
                    >
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const FontSizeButton = () => {
    const { editor } = useEditorStore()

    const currentFontSize = editor?.getAttributes('textStyle').fontSize
        ? editor?.getAttributes('textStyle').fontSize.replace('px', '')
        : '16'

    const [fontSize, setFontSize] = useState(currentFontSize)
    const [inputValue, setInputValue] = useState(fontSize)
    const [isEditing, setIsEditing] = useState(false)

    const updateFontSize = (newSize: string) => {
        const size = parseInt(newSize)

        if (!isNaN(size) && size > 0) {
            editor?.chain().focus().setFontSize(`${size}px`).run()
            setFontSize(newSize)
            setInputValue(newSize)
            setIsEditing(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputBlur = () => {
        updateFontSize(inputValue)
    }

    const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            updateFontSize(inputValue)
            editor?.commands.focus()
        }
    }

    const increment = () => {
        const newSize = parseInt(fontSize) + 1
        updateFontSize(newSize.toString())
    }

    const decrement = () => {
        const newSize = parseInt(fontSize) - 1

        if (newSize > 0) {
            updateFontSize(newSize.toString())
        }
    }

    return (
        <div className="flex items-center gap-x-0.5">
            <button onClick={decrement} className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
                <MinusIcon className="size-4" />
            </button>

            {isEditing
                ? (
                    <input type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeydown}
                        className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
                    />
                )
                : (
                    <button onClick={() => {
                        setIsEditing(true)
                        setFontSize(currentFontSize)
                    }}
                        className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent cursor-text "
                    >
                        {currentFontSize}
                    </button>
                )
            }

            <button onClick={increment} className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
                <PlusIcon className="size-4" />
            </button>
        </div>
    )
}

const ListButton = () => {
    const { editor } = useEditorStore()

    const lists = [
        {
            label: 'Danh sách chấm đầu dòng',
            icon: ListIcon,
            isActive: () => editor?.isActive('bulletList'),
            onClick: () => editor?.chain().focus().toggleBulletList().run()
        },
        {
            label: 'Danh sách đánh số',
            icon: ListOrderedIcon,
            isActive: () => editor?.isActive('orderedList'),
            onClick: () => editor?.chain().focus().toggleOrderedList().run()
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <ListIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-1 flex flex-col gapy-1">
                {lists.map(({ label, icon: Icon, onClick, isActive }) => (
                    <button key={label}
                        onClick={onClick}
                        className={cn('flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
                            isActive() && 'bg-neutral-200/80'
                        )}
                    >
                        <Icon className="size-4" />
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const AlignButton = () => {
    const { editor } = useEditorStore()

    const alignments = [
        {
            label: 'Căn trái',
            value: 'left',
            icon: AlignLeftIcon,
        },
        {
            label: 'Căn giữa',
            value: 'center',
            icon: AlignCenterIcon,
        },
        {
            label: 'Căn phải',
            value: 'right',
            icon: AlignRightIcon,
        },
        {
            label: 'Căn đều hai bên',
            value: 'justify',
            icon: AlignJustifyIcon,
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <AlignLeftIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-1 flex flex-col gapy-1">
                {alignments.map(({ label, value, icon: Icon }) => (
                    <button key={value}
                        onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                        className={cn('flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
                            editor?.isActive({ textAlign: value }) && 'bg-neutral-200/80'
                        )}
                    >
                        <Icon className="size-4" />
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const ImageButton = () => {
    const { editor } = useEditorStore();
    const [imageUrl, setImageUrl] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { user } = useUser()
    // const params = useParams();
    const { documentId } = useParams();

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const getFileUrl = useMutation(api.files.getFileUrl);
    const saveFile = useMutation(api.files.saveFile);

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({ src }).run()
    }

    // const onUpload = () => {
    //     const input = document.createElement('input')
    //     input.type = 'file'
    //     input.accept = 'image/*'

    //     input.onchange = (e) => {
    //         const file = (e.target as HTMLInputElement).files?.[0]

    //         if (file) {
    //             const imageUrl = URL.createObjectURL(file)
    //             onChange(imageUrl)
    //         }
    //     }

    //     input.click()
    // }

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const uploadUrl = await generateUploadUrl({});

                const res = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                const { storageId } = await res.json();

                const fileUrl = await getFileUrl({ storageId });

                if (fileUrl) {
                    onChange(fileUrl);
                }

                // console.log("saveFile with:", {
                //     documentId: documentId,
                //     storageId,
                //     fileName: file.name,
                //     fileType: file.type,
                //     fileSize: file.size,
                //     uploadedBy: user?.primaryEmailAddress?.emailAddress || "Ẩn danh",
                // });

                await saveFile({
                    documentId: documentId as Id<'documents'>,
                    storageId,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    uploadedBy: user?.primaryEmailAddress?.emailAddress || 'Ẩn danh',
                });
            } catch (err) {
                console.error("Tải ảnh thất bại", err);
            }
        };

        input.click();
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl)
            setImageUrl('')
            setIsDialogOpen(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                        <ImageIcon className="size-4" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem onClick={onUpload}>
                        <UploadIcon className="size-4 mr-2" /> Tải lên từ máy tính
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                        <SearchIcon className="size-4 mr-2" /> Dán URL của hình ảnh
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chèn URL của hình ảnh</DialogTitle>
                    </DialogHeader>

                    <Input
                        placeholder="Chèn URL của hình ảnh ..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleImageUrlSubmit()
                            }
                        }}
                    />

                    <DialogFooter>
                        <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleImageUrlSubmit}>
                            Chèn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

const LinkButton = () => {
    const { editor } = useEditorStore()
    const [value, setValue] = useState("")

    // console.log(editor?.getAttributes("link").href, "TEST");

    const onChange = (href: string) => {
        let finalHref = href.trim()

        // Nếu không có http/https thì tự động thêm
        if (!/^https?:\/\//i.test(finalHref)) {
            finalHref = `https://${finalHref}`
        }

        // editor?.chain().focus().extendMarkRange('link').setLink({ href }).run()
        editor?.chain().focus().extendMarkRange('link').setLink({ href: finalHref }).run()
        setValue('')
    };

    return (
        <DropdownMenu
            onOpenChange={(open) => {
                if (open) {
                    setValue(editor?.getAttributes("link").href || "")
                }
            }}
        >
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <Link2Icon className="size-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
                <Input
                    placeholder="Dán đường dẫn liên kết"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button onClick={() => onChange(value)} className="bg-blue-500 text-white hover:bg-blue-600">
                    Áp dụng
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const HighlightColorButton = () => {
    const { editor } = useEditorStore()

    const value = editor?.getAttributes('highlight').color || '#FFFFFF'

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({ color: color.hex }).run()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <HighlighterIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-0">
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const TextColorButton = () => {
    const { editor } = useEditorStore()

    const value = editor?.getAttributes('textStyle').color || '#000000'

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="text-xs">A</span>

                    <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-0">
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const HeadingLevelButton = () => {
    const { editor } = useEditorStore()

    const headings = [
        { label: "Văn bản thường", value: 0, fontSize: "16px" },
        { label: "Tiêu đề 1", value: 1, fontSize: "32px" },
        { label: "Tiêu đề 2", value: 2, fontSize: "24px" },
        { label: "Tiêu đề 3", value: 3, fontSize: "20px" },
        { label: "Tiêu đề 4", value: 4, fontSize: "18px" },
        { label: "Tiêu đề 5", value: 5, fontSize: "16px" },
    ];

    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {
            if (editor?.isActive("heading", { level })) {
                return `Tiêu đề ${level}`;
            }
        }

        return "Văn bản thường";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="truncate">{getCurrentHeading()}</span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-1 flex flex-col gap-y-1 font-serif">
                {headings.map(({ label, value, fontSize }) => (
                    <button
                        key={value}
                        onClick={() => {
                            if (value === 0) {
                                editor?.chain().focus().setParagraph().run();
                            } else {
                                editor?.chain().focus().toggleHeading({ level: value as Level }).run();
                            }
                        }}
                        style={{ fontSize }}
                        className={cn("flex items-center gap-x-2 px-2 py-1 font-[value] rounded-sm hover:bg-neutral-200/80",
                            (value === 0 && !editor?.isActive("heading")) ||
                            (editor?.isActive("heading", { level: value as Level }) && "bg-neutral-200/80")
                        )}
                    >
                        {label}
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const FontFamilyButton = () => {
    const { editor } = useEditorStore()

    const fonts = [
        { label: "Arial", value: "Arial" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Courier New", value: "Courier New" },
        { label: "Georgia", value: "Georgia" },
        { label: "Verdana", value: "Verdana" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="truncate">
                        {editor?.getAttributes("textStyle").fontFamily || "Arial"}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {fonts.map(({ label, value }) => (
                    <button
                        onClick={() => editor?.chain().focus().setFontFamily(value).run()}
                        key={value}
                        className={cn("flex items-center gap-x-2 px-2 py-1 font-[value] rounded-sm hover:bg-neutral-200/80",
                            editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
                        )}
                        style={{ fontFamily: value }}
                    >
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}

const ToolbarButton = ({ onClick, isActive, icon: Icon }: ToolbarButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn('text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80',
                isActive && 'bg-neutral-200/80')}
        >
            <Icon className="size-4" />
        </button>
    )
}

export const Toolbar = () => {
    const { editor } = useEditorStore()

    const [youtubeOpen, setYoutubeOpen] = useState(false)
    const [mathOpen, setMathOpen] = useState(false)
    const [drawingOpen, setDrawingOpen] = useState(false)
    const [aiOpen, setAiOpen] = useState(false);
    // const [aiGenerateOpen, setAiGenerateOpen] = useState(false);

    const addYoutubeVideo = (url: string, width: number, height: number) => {
        if (!editor) return
        editor.chain().focus().setYoutubeVideo({
            src: url,
            width,
            height
        }).run()
    }

    const addMath = (formula: string, displayMode: boolean) => {
        if (!editor) return

        if (displayMode) {
            editor.chain().focus().insertBlockMath({ latex: formula }).run()
        } else {
            editor.chain().focus().insertInlineMath({ latex: formula }).run()
        }
    }

    const addDrawing = (dataUrl: string) => {
        editor?.chain().focus().setImage({ src: dataUrl }).run()
    }

    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
            [
                {
                    label: 'Undo',
                    icon: Undo2Icon,
                    onClick: () => editor?.chain().focus().undo().run(),
                },
                {
                    label: 'Redo',
                    icon: Redo2Icon,
                    onClick: () => editor?.chain().focus().redo().run(),
                },
                {
                    label: 'Print',
                    icon: PrinterIcon,
                    onClick: () => window.print(),
                },
                {
                    label: 'Spell Check',
                    icon: SpellCheckIcon,
                    onClick: () => {
                        const current = editor?.view.dom.getAttribute('spellCheck')
                        editor?.view.dom.setAttribute('spellCheck', current === 'false' ? 'true' : 'false')
                    },
                },
            ],
            [
                {
                    label: 'Bold',
                    icon: BoldIcon,
                    isActive: editor?.isActive('bold'),
                    onClick: () => editor?.chain().focus().toggleBold().run(),
                },
                {
                    label: 'Italic',
                    icon: ItalicIcon,
                    isActive: editor?.isActive('italic'),
                    onClick: () => editor?.chain().focus().toggleItalic().run(),
                },
                {
                    label: 'Underline',
                    icon: UnderlineIcon,
                    isActive: editor?.isActive('underline'),
                    onClick: () => editor?.chain().focus().toggleUnderline().run(),
                },
            ],
            [
                {
                    label: 'Comment',
                    icon: MessageSquarePlusIcon,
                    isActive: editor?.isActive('liveblocksCommentMark'),
                    onClick: () => editor?.chain().focus().addPendingComment().run(),
                },
                {
                    label: 'List Todo',
                    icon: ListTodoIcon,
                    isActive: editor?.isActive('taskList'),
                    onClick: () => editor?.chain().focus().toggleTaskList().run(),
                },
                {
                    label: 'Remove Formatting',
                    icon: RemoveFormattingIcon,
                    onClick: () => editor?.chain().focus().unsetAllMarks().run(),
                },
            ],
            [
                {
                    label: 'CodeBlock',
                    icon: Code,
                    isActive: editor?.isActive('codeBlock'),
                    onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
                },
                {
                    label: 'Quote',
                    icon: QuoteIcon,
                    isActive: editor?.isActive('quote'),
                    onClick: () => editor?.chain().focus().toggleBlockquote().run(),
                },
                {
                    label: 'Youtube',
                    icon: YoutubeIcon,
                    onClick: () => {
                        setYoutubeOpen(true)
                    },
                },
                {
                    label: 'Math',
                    icon: Sigma,
                    onClick: () => {
                        setMathOpen(true)
                    },
                },
                {
                    label: 'Drawing',
                    icon: Brush,
                    onClick: () => {
                        setDrawingOpen(true)
                    },
                },
                {
                    label: 'Voice to text',
                    icon: Mic,
                    onClick: startVoiceToText
                },
                {
                    label: 'AI edior tools',
                    icon: Bot,
                    onClick: () => {
                        setAiOpen(true)
                    },
                },
            ]
        ]

    return (
        <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}

            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <FontFamilyButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <HeadingLevelButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <FontSizeButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            {sections[1].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}

            <TextColorButton />
            <HighlightColorButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <LinkButton />
            <ImageButton />
            <AlignButton />
            <LineHeightButton />
            <ListButton />

            {sections[2].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}

            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            {sections[3].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}

            <YoutubeModal
                open={youtubeOpen}
                onOpenChange={setYoutubeOpen}
                onSubmit={addYoutubeVideo}
            />

            <MathModal
                open={mathOpen}
                onOpenChange={setMathOpen}
                onSubmit={addMath}
            />

            <DrawingWindow
                open={drawingOpen}
                onClose={() => setDrawingOpen(false)}
                onSubmit={addDrawing}
            />

            <AIEditor
                open={aiOpen}
                onOpenChange={setAiOpen}
                editor={editor}
            />
        </div>
    )
}