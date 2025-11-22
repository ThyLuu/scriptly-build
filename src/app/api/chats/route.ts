import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const chatId = await fetchMutation(api.chats.createChat, {
            ownerId: body.ownerId,
            title: body.title ?? "Chat mới",
        });

        return NextResponse.json({ chatId });
        // } catch (err: any) {
        //     return NextResponse.json({ error: err.message }, { status: 500 });
        // }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "[Chats] Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
