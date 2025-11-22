'use client'

import { Preloaded, usePreloadedQuery } from "convex/react";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";
import { api } from "../../../../convex/_generated/api";
import AiChatPopup from "./ai-chat-popup";
import { TableOfContent } from "./table-of-content";
import { useState } from "react";

import type { Editor as TiptapEditor } from "@tiptap/react";
// import type { TableOfContentData } from "@tiptap/extension-table-of-contents";

interface DocumentProps {
    preloadedDocument: Preloaded<typeof api.documents.getById>
}

interface TocItem {
    id: string;
    textContent: string;
    level: number;
}

export const Document = ({ preloadedDocument }: DocumentProps) => {
    const document = usePreloadedQuery(preloadedDocument)

    const [editor, setEditor] = useState<TiptapEditor | null>(null)
    const [tocItems, setTocItems] = useState<TocItem[]>([])

    return (
        <Room>
            <div className="min-h-screen bg-[#FAFBFD]">

                <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
                    <Navbar data={document} />
                    <Toolbar />

                    <AiChatPopup />
                </div>

                {/* <div className="pt-[114px] print:top-0">
                    <Editor initialContent={document.initialContent} />
                </div> */}

                <div className="pt-[114px] flex relative print:top-0">
                    <TableOfContent editor={editor} items={tocItems} onTocUpdate={setTocItems}/>
                    <div className="flex-1 flex justify-center px-4">
                        <Editor initialContent={document.initialContent} onTocUpdate={setTocItems} onEditorCreate={setEditor} />
                    </div>
                </div>

            </div>
        </Room>
    );
}

