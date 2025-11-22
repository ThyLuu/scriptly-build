'use client'

import { TextSelection } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";
import { X } from "lucide-react";

interface TocItem {
    id: string;
    textContent: string;
    level: number;
}

interface TableOfContentProps {
    editor: Editor | null;
    items: TocItem[];
    onTocUpdate?: (items: TocItem[]) => void;
}

// interface TableOfContentProps {
//     editor: Editor | null;
//     items: any[];
//     onTocUpdate?: (items: any[]) => void;
// }

export const TableOfContent = ({ editor, items = [], onTocUpdate }: TableOfContentProps) => {

    // const onItemClick = (e: any, id: string) => {
    const onItemClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        if (!editor) return;

        const element = editor.view.dom.querySelector(`[data-toc-id="${id}"]`);
        if (!element) return;

        const pos = editor.view.posAtDOM(element, 0);
        editor.view.dispatch(editor.state.tr.setSelection(
            new TextSelection(editor.state.doc.resolve(pos))
        ));
        editor.view.focus();

        window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 120,
            behavior: "smooth",
        });
    };

    const onRemoveHeading = (id: string) => {
        if (!editor) return;

        const element = editor.view.dom.querySelector(`[data-toc-id="${id}"]`);
        if (!element) return;

        const pos = editor.view.posAtDOM(element, 0);

        editor.view.dispatch(
            editor.state.tr.setSelection(new TextSelection(editor.state.doc.resolve(pos)))
        );
        editor.chain().focus().setParagraph().run();

        onTocUpdate?.(items.filter(item => item.id !== id));
    };

    return (
        <div className="fixed left-2 top-[150px] w-60 h-[calc(100vh-150px)] overflow-auto bg-[#FAFBFD]/80 backdrop-blur p-3 rounded-md shadow-sm">
            <h3 className="text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Mục lục
            </h3>

            {items.length === 0 ? (
                <div className="text-gray-400 text-xs italic pl-1">
                    Chưa có tiêu đề nào
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                            className="group flex items-center justify-between text-sm leading-snug cursor-pointer rounded-sm hover:bg-gray-100 px-1 py-0.5 transition"
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => onItemClick(e, item.id)}
                                className="truncate text-gray-700 hover:text-blue-600"
                            >
                                {item.textContent}
                            </a>

                            <button
                                onClick={() => onRemoveHeading(item.id)}
                                className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500 ml-1"
                                title="Chuyển về văn bản thường"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
