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
            COMMENT_ADD_REACTION: 'Biểu tượng cảm xúc',
            COMMENT_DELETE: 'Xóa nhận xét',
            COMMENT_EDIT: 'Chỉnh sửa nhận xét',
            THREAD_RESOLVE: 'Đã giải quyết',
            THREAD_COMPOSER_SEND: 'Gửi',
            THREAD_UNRESOLVE: 'Chưa được giải quyết',
            COMPOSER_ATTACH_FILES: 'Đính kèm tập tin',
            COMPOSER_INSERT_EMOJI: 'Chọn biểu tượng cảm xúc',
            COMPOSER_INSERT_MENTION: 'Nhắc đến ai đó',
            COMPOSER_PLACEHOLDER: 'Viết nhận xét ...',
            COMPOSER_SEND: 'Gửi',
            COMMENT_MORE: 'Xem thêm',
            COMMENT_EDITED: '(Đã chỉnh sửa)',
            EMOJI_PICKER_SEARCH_PLACEHOLDER: 'Tìm kiếm biểu tượng cảm xúc',
            COMMENT_EDIT_COMPOSER_SAVE: 'Lưu',
            COMMENT_EDIT_COMPOSER_CANCEL: 'Hủy',
            USER_SELF: 'Bạn',
            COMMENT_REACTION_LIST(list, emoji) {
                return (
                    <>
                        {list} đã phản ứng với {emoji}
                    </>
                )
            }
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