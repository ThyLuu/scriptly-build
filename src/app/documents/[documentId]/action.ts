'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { Id } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function getDocuments(ids: Id<'documents'>[]) {
    return await convex.query(api.documents.getByIds, { ids })
}

export async function getUsers() {
    const { sessionClaims } = await auth()
    const clerk = await clerkClient()

    // if (!sessionClaims) return []

    // const orgId = (sessionClaims as any).o?.id

    // if (!orgId) {
    //     return []
    // }

    const response = await clerk.users.getUserList({
        // organizationId: [sessionClaims?.org_id as string],
        // organizationId: [orgId as string],
        organizationId: [(sessionClaims?.o as { id?: string })?.id as string],
    })

    const users = response.data.map((user) => ({
        id: user.id,
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Ẩn danh",
        avatar: user.imageUrl,
        color: '',
    }))

    return users
}