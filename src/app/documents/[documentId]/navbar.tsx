'use client'

import Link from "next/link"
import { DocumentInput } from "./document-input"
import { IoDocumentText } from "react-icons/io5";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { BoldIcon, FileIcon, FileJsonIcon, FilePenIcon, FilePlusIcon, FileTextIcon, GlobeIcon, ItalicIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, StrikethroughIcon, TextIcon, TrashIcon, UnderlineIcon, Undo2Icon } from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { TablePicker } from "./tablePicker";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import { Avatars } from "./avatar";
import { Inbox } from "./inbox";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RenameDialog } from "@/components/rename-dialog";
import { RemoveDialog } from "@/components/remove-dialog";
import Meeting from "./meeting";
import DocumentHistory from "./version-history";

interface NavbarProps {
    data: Doc<'documents'>
}

export const Navbar = ({ data }: NavbarProps) => {
    const router = useRouter()

    const { editor } = useEditorStore()

    const mutation = useMutation(api.documents.create)

    const {user} = useUser()
    const roomId = data.roomId || `doc-${data._id}`
    const userId = user?.id || ""
    const userName = user?.fullName || "Anonymous"

    const onNewDocument = () => {
        mutation({
            title: 'Tài liệu không có tiêu đề',
            initialContent: ''
        })
            .catch(() => toast.error('Có gì đó không ổn'))
            .then((id) => {
                router.push(`/documents/${id}`)
                toast.success('Tài liệu được tạo thành công')
            })
    }

    const insertTable = ({ rows, cols }: { rows: number, cols: number }) => {
        editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run()
    }

    const onDownload = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = fileName
        a.click()
    }

    const onSaveJSON = () => {
        if (!editor) return

        const content = editor.getJSON()
        const blob = new Blob([JSON.stringify(content)], {
            type: 'application/json'
        })

        onDownload(blob, `${data.title}.json`)
    }

    const onSaveHTML = () => {
        if (!editor) return

        const content = editor.getHTML()
        const blob = new Blob([content], {
            type: 'text/html'
        })

        onDownload(blob, `${data.title}.html`)
    }

    const onSaveText = () => {
        if (!editor) return

        const content = editor.getText()
        const blob = new Blob([content], {
            type: 'text/plain'
        })

        onDownload(blob, `${data.title}.txt`)
    }

    return (
        <nav className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Link href={'/'}>
                    <IoDocumentText className="size-10 text-blue-500" />
                </Link>

                <div className="flex flex-col">
                    <DocumentInput title={data.title} id={data._id} />

                    <div className="flex">
                        <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                            {/* Tệp */}
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Tệp
                                </MenubarTrigger>

                                <MenubarContent className="print:hidden">
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <FileIcon className="size-4 mr-2" />
                                            Lưu dưới dạng ...
                                        </MenubarSubTrigger>

                                        <MenubarSubContent>
                                            <MenubarItem onClick={onSaveJSON}>
                                                <FileJsonIcon className="size-4 mr-2" />
                                                JSON
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveHTML}>
                                                <GlobeIcon className="size-4 mr-2" />
                                                HTML
                                            </MenubarItem>
                                            <MenubarItem onClick={() => window.print()}>
                                                <BsFilePdf className="size-4 mr-2" />
                                                PDF
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveText}>
                                                <FileTextIcon className="size-4 mr-2" />
                                                Text
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>

                                    <MenubarItem onClick={onNewDocument}>
                                        <FilePlusIcon className="size-4 mr-2" />
                                        Tài liệu mới
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <RenameDialog documentId={data._id} initialTitle={data.title}>
                                        <MenubarItem onClick={(e) => e.stopPropagation()} onSelect={(e) => e.preventDefault()}>
                                            <FilePenIcon className="size-4 mr-2" />
                                            Đổi tên
                                        </MenubarItem>
                                    </RenameDialog>

                                    <RemoveDialog documentId={data._id}>
                                        <MenubarItem onClick={(e) => e.stopPropagation()} onSelect={(e) => e.preventDefault()}>
                                            <TrashIcon className="size-4 mr-2" />
                                            Chuyển vào thùng rác
                                        </MenubarItem>
                                    </RemoveDialog>

                                    <MenubarSeparator />
                                    <MenubarItem onClick={() => window.print()}>
                                        <PrinterIcon className="size-4 mr-2" />
                                        In
                                        <MenubarShortcut>Ctrl+P</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>

                            {/* Chỉnh sửa */}
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Chỉnh sửa
                                </MenubarTrigger>

                                <MenubarContent>
                                    <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                                        <Undo2Icon className="size-4 mr-2" />
                                        Hoản tác
                                        <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                                        <Redo2Icon className="size-4 mr-2" />
                                        Làm lại
                                        <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>

                            {/* Chèn */}
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Chèn
                                </MenubarTrigger>
 
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>Bảng</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>
                                                1 x 1
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>
                                                2 x 2
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>
                                                3 x 3
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>
                                                4 x 4
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 5, cols: 5 })}>
                                                5 x 5
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>

                                    <MenubarSub>
                                        <MenubarSubTrigger>Tùy chỉnh bảng</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <TablePicker />
                                        </MenubarSubContent>
                                    </MenubarSub>

                                    <MenubarSub>
                                        <MenubarSubTrigger>Chỉnh sửa bảng</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => editor?.chain().focus().addColumnBefore().run()}>
                                                Thêm cột bên trái
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().addColumnAfter().run()}>
                                                Thêm cột bên phải
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().addRowBefore().run()}>
                                                Thêm hàng bên trên
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().addRowAfter().run()}>
                                                Thêm hàng bên dưới
                                            </MenubarItem>
                                            <MenubarSeparator />
                                            <MenubarItem onClick={() => editor?.chain().focus().deleteColumn().run()}>
                                                Xoá cột hiện tại
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().deleteRow().run()}>
                                                Xoá hàng hiện tại
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().deleteTable().run()}>
                                                Xoá bảng
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                </MenubarContent>
                            </MenubarMenu>

                            {/* Định dạng */}
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Định dạng
                                </MenubarTrigger>

                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <TextIcon className="size-4 mr-2" />
                                            Văn bản
                                        </MenubarSubTrigger>

                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                                                <BoldIcon className="size-4 mr-2" />
                                                In đậm
                                                <MenubarShortcut>Ctrl+B</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                                                <ItalicIcon className="size-4 mr-2" />
                                                In nghiên
                                                <MenubarShortcut>Ctrl+I</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                                                <UnderlineIcon className="size-4 mr-2" />
                                                Gạch chân
                                                <MenubarShortcut>Ctrl+U</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                                                <StrikethroughIcon className="size-4 mr-2" />
                                                Gạch ngang chữ
                                                <MenubarShortcut className="ml-2">Alt+Shift+5</MenubarShortcut>
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>

                                    <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                                        <RemoveFormattingIcon className="size-4 mr-2" />
                                        Xóa định dạng
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 items-center pl-6">
                <Avatars />
                <Inbox />

                <Meeting documentId={data._id}/>

                <DocumentHistory
                    documentId={data._id}
                    roomId={roomId}
                    userId={userId}
                    userName={userName}
                />

                <OrganizationSwitcher
                    afterCreateOrganizationUrl={'/'}
                    afterLeaveOrganizationUrl="/"
                    afterSelectOrganizationUrl={'/'}
                    afterSelectPersonalUrl={'/'}
                />
                <UserButton />
            </div>
        </nav>
    )
}