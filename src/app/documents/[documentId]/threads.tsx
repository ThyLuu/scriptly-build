import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import {
    AnchoredThreads,
    FloatingComposer,
    FloatingThreads,
} from "@liveblocks/react-tiptap";
import { Editor } from "@tiptap/react";
import { LiveblocksUIConfig } from "@liveblocks/react-ui";

export const Threads = ({ editor }: { editor: Editor | null }) => {
    return (
        <ClientSideSuspense fallback={null}>
            <ThreadsList editor={editor} />
        </ClientSideSuspense>
    )
}

export function ThreadsList({ editor }: { editor: Editor | null }) {
    const { threads } = useThreads({ query: { resolved: false } });

    return (
        <LiveblocksUIConfig overrides={{
            locale: 'vi',
            USER_UNKNOWN: "Ẩn danh",
            THREAD_COMPOSER_PLACEHOLDER: 'Phản hồi ...',
            THREAD_NEW_INDICATOR: 'Mới',
            COMMENT_ADD_REACTION: 'Thêm phản ứng',
            COMMENT_DELETE: 'Xóa nhận xét',
            COMMENT_EDIT: 'Chỉnh sửa nhận xét',
            THREAD_RESOLVE: 'Đã giải quyết',
            THREAD_COMPOSER_SEND: 'Gửi',
            THREAD_UNRESOLVE: 'Chưa được giải quyết',
            COMPOSER_ATTACH_FILES: 'Đính kèm tập tin',
            COMPOSER_INSERT_EMOJI: 'Chọn biểu tượng cảm xúc',
            COMPOSER_INSERT_MENTION: 'Nhắc đến ai đó',
            COMPOSER_PLACEHOLDER: 'Viết nhận xét ...',
            COMPOSER_SEND: 'Gửi'
        }}>
            <>
                <div className="anchored-threads">
                    <AnchoredThreads editor={editor} threads={threads} />
                </div>

                <FloatingThreads
                    editor={editor}
                    threads={threads}
                    className="floating-threads"
                />

                <FloatingComposer
                    editor={editor}
                    className="floating-composer"
                />
            </>
        </LiveblocksUIConfig>

        // <>
        //     <div className="anchored-threads">
        //         <AnchoredThreads editor={editor} threads={threads} />
        //     </div>

        //     <FloatingThreads
        //         editor={editor}
        //         threads={threads}
        //         className="floating-threads"
        //     />

        //     <FloatingComposer
        //         editor={editor}
        //         className="floating-composer"                
        //     />
        // </>
    );
}