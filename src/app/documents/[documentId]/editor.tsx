'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
// import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useEditorStore } from '@/store/use-editor-store'
import Underline from '@tiptap/extension-underline'
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { fontSizeExtension } from '@/extensions/font-size'
import { LineHeightExtension } from '@/extensions/line-height'
import { Ruler } from './ruler'
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { Threads } from './threads'
import { useStorage } from '@liveblocks/react'
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from '@/constants/margins'
// import CodeBlock from '@tiptap/extension-code-block'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
// import Blockquote from '@tiptap/extension-blockquote'
import Youtube from '@tiptap/extension-youtube'
import Math from '@tiptap/extension-mathematics'
import 'katex/dist/katex.min.css'
// import { Dropcursor } from '@tiptap/extensions'

const lowlight = createLowlight(all)

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', javascript)
lowlight.register('ts', typescript)

interface EditorProps {
    initialContent?: string | undefined
}

export const Editor = ({ initialContent }: EditorProps) => {
    const liveblocks = useLiveblocksExtension({
        initialContent,
        offlineSupport_experimental: true,
    })

    const { setEditor } = useEditorStore()

    const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT
    const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT

    const editor = useEditor({
        onCreate({ editor }) {
            setEditor(editor)
        },
        onDestroy() {
            setEditor(null)
        },
        onUpdate({ editor }) {
            setEditor(editor)
        },
        onSelectionUpdate({ editor }) {
            setEditor(editor)
        },
        onTransaction({ editor }) {
            setEditor(editor)
        },
        onFocus({ editor }) {
            setEditor(editor)
        },
        onBlur({ editor }) {
            setEditor(editor)
        },
        onContentError({ editor }) {
            setEditor(editor)
        },
        editorProps: {
            attributes: {
                style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
                class: 'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text'
            }
        },
        extensions: [
            liveblocks,
            // Dropcursor.configure({
            //     color: '#3B82F6',
            //     width: 2
            // }),
            Math.configure({
                katexOptions: {
                    throwOnError: false
                }
            }),
            Youtube,
            // Blockquote,
            // CodeBlockLowlight.configure({
            //     lowlight
            // }),
            StarterKit.configure({
                history: false,
            }),
            LineHeightExtension.configure({
                types: ['heading', 'paragraph'],
                defaultLineHeight: 'normal'
            }),
            fontSizeExtension,
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https'
            }),
            Color,
            Highlight.configure({
                multicolor: true
            }),
            TextStyle,
            FontFamily,
            Underline,
            // Image,
            ImageResize,
            Table,
            TableCell,
            TableRow,
            TableHeader,
            TaskList,
            TaskItem.configure({
                nested: true
            }),
        ],
        immediatelyRender: false,
        autofocus: true,
    })

    return (
        <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible'>
            <Ruler />

            <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
                <EditorContent editor={editor} />
                <Threads editor={editor} />
            </div>
        </div>
    )
}