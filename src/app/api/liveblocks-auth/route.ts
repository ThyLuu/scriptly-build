import { Liveblocks } from '@liveblocks/node'
import { ConvexHttpClient } from 'convex/browser'
import { auth, currentUser } from '@clerk/nextjs/server'
import { api } from '../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export async function POST(req: Request) {
    const { sessionClaims } = await auth()

    // if (!sessionClaims) {
    //     return new Response('Không được cấp phép', { status: 401 })
    // }

    if (!sessionClaims) {
        return Response.json({ error: "Không được cấp phép" }, { status: 401 });
    }

    const user = await currentUser()

    console.log("Session Claims:", sessionClaims)

    // if (!user) {
    //     return new Response('Không được cấp phép', { status: 401 })
    // }

    if (!user) {
        return Response.json({ error: "Không được cấp phép" }, { status: 401 });
    }

    const { room } = await req.json()

    const document = await convex.query(api.documents.getById, { id: room })

    // if (!document) {
    //     return new Response('Không được cấp phép', { status: 401 })
    // }

    if (!document) {
        return Response.json({ error: "Không được cấp phép" }, { status: 401 });
    }

    const orgId = (sessionClaims as any).o?.id

    const isOwner = document.ownerId === user.id
    const isOrganizationMember = !!(document.organizationId && document.organizationId === orgId)
    // const isOrganizationMember = !!(document.organizationId && document.organizationId === sessionClaims.org_id)

    // console.log({isOwner, isOrganizationMember})

    // if (!isOwner && !isOrganizationMember) {
    //     return new Response('Không được cấp phép', { status: 401 })
    // }

    if (!isOwner && !isOrganizationMember) {
        return Response.json({ error: "Không được cấp phép" }, { status: 401 });
    }

    const name = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Ẩn danh'
    const nameToNumber = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hue = Math.abs(nameToNumber) % 360
    const color = `hsl(${hue}, 80%, 60%)`

    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
            name,
            avatar: user.imageUrl,
            color,
        }
    })

    session.allow(room, session.FULL_ACCESS)

    const { body, status } = await session.authorize()

    console.log("document", document)
    console.log("orgId from claims", orgId)

    const role = (sessionClaims as any).o?.rol
    console.log("role", role)

    // return new Response(body, { status })
    return new Response(body, {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
