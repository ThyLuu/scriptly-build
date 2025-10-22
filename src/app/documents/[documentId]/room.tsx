"use client"

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers, getDocuments } from "./action";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from '@/constants/margins'

type User = {
    id: string;
    name: string;
    avatar: string;
    color: string;
}

export function Room({ children }: { children: ReactNode }) {
    const params = useParams()

    const [users, setUsers] = useState<User[]>([])

    const fetchUsers = useMemo(
        () => async () => {
            try {
                const list = await getUsers()
                setUsers(list)
            }
            catch {
                toast.error('Không thể tìm thấy và nạp người dùng')
            }
        },
        []
    )

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return (
        <LiveblocksProvider
            throttle={16}
            authEndpoint={async () => {
                const endpoint = '/api/liveblocks-auth'
                const room = params.documentId as string

                const reponse = await fetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify({ room }),
                    // mới thêm vào
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })

                return await reponse.json()
            }}
            resolveUsers={({ userIds }) => {
                return userIds.map((userId) => users.find((user) => user.id === userId) ?? undefined)
            }}
            resolveMentionSuggestions={({ text }) => {
                let filteredUser = users

                if (text) {
                    filteredUser = users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase()))
                }

                return filteredUser.map((user) => user.id)
            }}
            resolveRoomsInfo={async ({ roomIds }) => {
                const documents = await getDocuments(roomIds as Id<'documents'>[])

                return documents.map((document) => ({
                    id: document.id,
                    name: document.name
                }))
            }}
        >
            <RoomProvider id={params.documentId as string} initialStorage={{ leftMargin: LEFT_MARGIN_DEFAULT, rightMargin: RIGHT_MARGIN_DEFAULT }}>
                <ClientSideSuspense fallback={<FullscreenLoader label="Đang tải tài liệu ..." />}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}