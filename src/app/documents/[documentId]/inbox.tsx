'use client'

import { ClientSideSuspense } from "@liveblocks/react"
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui"
import { useInboxNotifications } from "@liveblocks/react/suspense"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BellIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { LiveblocksUIConfig } from "@liveblocks/react-ui";

export const Inbox = () => {
    return (
        <ClientSideSuspense fallback={
            <>
                <Button variant={'ghost'} disabled className="relative" size={'icon'}>
                    <BellIcon className="size-5" />
                </Button>

                <Separator orientation="vertical" className="h-6" />
            </>
        }>
            <InboxMenu />
        </ClientSideSuspense>
    )
}

const InboxMenu = () => {
    const { inboxNotifications } = useInboxNotifications()

    return (
        <LiveblocksUIConfig overrides={{
            locale: 'vi',
            INBOX_NOTIFICATION_MARK_AS_READ: 'Đánh dấu đã đọc',
            INBOX_NOTIFICATION_DELETE: 'Xoá thông báo',
            INBOX_NOTIFICATION_MORE: 'Thêm',
            INBOX_NOTIFICATION_TEXT_MENTION: (user, room) => {
                return (
                    <>
                        {user} đã nhắc đến bạn trong {room}
                    </>
                )
            },
            INBOX_NOTIFICATION_THREAD_COMMENTS_LIST: (user, room, count) => {
                return (
                    <>
                        {user} đã bình luận trong {room}
                    </>
                )
            },
            INBOX_NOTIFICATION_THREAD_MENTION: (user, room) => {
                return (
                    <>
                        {user} đã nhắc đến bạn trong {room}
                    </>
                )
            },
            USER_SELF: 'Bạn',
            USER_UNKNOWN: 'Ẩn danh',
        }}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} className="relative" size={'icon'}>
                        <BellIcon className="size-5" />
                        {inboxNotifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                {inboxNotifications.length}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-auto">
                    {inboxNotifications.length > 0
                        ? (
                            <InboxNotificationList>
                                {inboxNotifications.map((inboxNotification) => (
                                    <InboxNotification
                                        key={inboxNotification.id}
                                        inboxNotification={inboxNotification}
                                    />
                                ))}
                            </InboxNotificationList>
                        )
                        : (
                            <div className="p-2 w-[400px] text-center text-sm text-muted-foreground">
                                Không có thông báo
                            </div>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />
        </LiveblocksUIConfig>
    )
}