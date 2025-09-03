'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, Brush, ChevronDownIcon, Code, HighlighterIcon, ImageIcon, ItalicIcon, Link2Icon, ListCollapseIcon, ListIcon, ListOrderedIcon, ListTodoIcon, LucideIcon, MessageSquarePlusIcon, Mic, MinusIcon, PlusIcon, PrinterIcon, QuoteIcon, Redo2Icon, RemoveFormattingIcon, SearchIcon, Sigma, SpellCheckIcon, UnderlineIcon, Undo2Icon, UploadIcon, WandSparkles, YoutubeIcon } from "lucide-react";
import { type Level } from '@tiptap/extension-heading'
import { type ColorResult, SketchPicker } from 'react-color'
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Rnd } from 'react-rnd'
import { Tldraw, useEditor } from "tldraw";
import 'tldraw/tldraw.css'

// interface AIGenerateProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// interface AIGenerateProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// export const AIGenerate = ({ open, onOpenChange }: AIGenerateProps) => {
//     const [aiPrompt, setAiPrompt] = useState("");
//     const [aiResult, setAiResult] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleAIGenerate = async () => {
//         if (!aiPrompt.trim()) return;

//         setLoading(true);
//         setAiResult(null);

//         try {
//             // fetch với absolute URL
//             const res = await fetch(new URL("/api/ai-generate", window.location.origin).toString(), {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ prompt: aiPrompt, chatId: "demo", senderId: "user" }),
//             });

//             // nếu server trả lỗi
//             if (!res.ok) {
//                 const text = await res.text();
//                 console.error("Server trả lỗi:", text);
//                 setAiResult("Có lỗi xảy ra khi tạo nội dung.");
//                 return;
//             }

//             // parse JSON
//             const data = await res.json();
//             const answer: string = data.answer ?? "Không có nội dung nào được tạo.";
//             console.log("AI answer:", answer);

//             // chèn vào editor
//             const { editor } = useEditorStore.getState();
//             if (editor) {
//                 const paragraphs = answer
//                     .split("\n")
//                     .map((p) => `<p>${p}</p>`)
//                     .join("");
//                 editor.commands.insertContent(paragraphs);
//                 editor.commands.focus();
//             }

//             setAiResult(answer);
//         } catch (err) {
//             console.error("Lỗi khi gọi AI:", err);
//             setAiResult("Có lỗi xảy ra khi tạo nội dung.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                     <DialogTitle>AI tạo nội dung</DialogTitle>
//                 </DialogHeader>

//                 <Input
//                     placeholder="Nhập yêu cầu tạo nội dung..."
//                     value={aiPrompt}
//                     onChange={(e) => setAiPrompt(e.target.value)}
//                     className="mb-2"
//                 />

//                 <div className="flex justify-end gap-2 mb-2">
//                     <Button variant="outline" onClick={() => onOpenChange(false)}>
//                         Hủy
//                     </Button>
//                     <Button
//                         className="bg-blue-500 hover:bg-blue-600"
//                         onClick={handleAIGenerate}
//                         disabled={loading}
//                     >
//                         {loading ? "Đang tạo..." : "Tạo"}
//                     </Button>
//                 </div>

//                 {aiResult && (
//                     <div className="mt-2 p-2 border rounded bg-gray-50 text-sm whitespace-pre-wrap">
//                         {aiResult}
//                     </div>
//                 )}
//             </DialogContent>
//         </Dialog>
//     );
// };

interface DrawingWindowProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (dataUrl: string) => void;
}

function Helper() {
    const editor = useEditor();

    useEffect(() => {
        const container = editor.getContainer();
        const focusOnPointerDown = () => editor.focus();
        container.addEventListener('pointerdown', focusOnPointerDown);
        return () => {
            container.removeEventListener('pointerdown', focusOnPointerDown);
        };
    }, [editor]);

    return null;
}

const DrawingWindow = ({ open, onClose, onSubmit }: DrawingWindowProps) => {
    const [editor, setEditor] = useState<any>(null);

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

function startVoiceToText() {
    // @ts-ignore
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

    // Dùng any thay vì SpeechRecognitionEvent
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log("Kết quả chuyển đổi:", transcript)

        // Chèn vào editor
        const { editor } = useEditorStore.getState();
        editor?.chain().focus().insertContent(transcript).run()
    }

    recognition.onerror = (event: any) => {
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
    const [align, setAlign] = useState<"left" | "center" | "right">("center")

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

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({ src }).run()
    }

    const onUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]

            if (file) {
                const imageUrl = URL.createObjectURL(file)
                onChange(imageUrl)
            }
        }

        input.click()
    }

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
                        <Button className="border-black border bg-white text-black hover:bg-neutral-200" onClick={handleImageUrlSubmit}>
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
        editor?.chain().focus().extendMarkRange('link').setLink({ href }).run()
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
                <Button onClick={() => onChange(value)} className="border-black border bg-white text-black hover:bg-neutral-200">
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
    const [aiGenerateOpen, setAiGenerateOpen] = useState(false);

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
        </div>
    )
}