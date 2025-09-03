'use client'

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function useSyncUser() {
    const { user } = useUser();
    const syncUser = useMutation(api.users.createUser)

    useEffect(() => {
        if (user) {
            syncUser({
                userId: user.id,
                email: user.primaryEmailAddress?.emailAddress || '',
                name: user.fullName || user.username || '',
                imageUrl: user.imageUrl || '',
            })
        }
    }, [user, syncUser])
}