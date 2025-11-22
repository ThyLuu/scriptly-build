import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const run = await inngest.send({
            name: "ai-chat",
            data: {
                chatId: body.chatId,     // 🆕 lấy từ body
                senderId: body.senderId, // 🆕 lấy từ body
                message: body.message,   // 🆕 lấy từ body
            },
        });

        return NextResponse.json({ runId: run.ids?.[0] });
        // } catch (error: any) {
        //     console.error("❌ Error in ai-chat route:", error);
        //     return NextResponse.json({ error: error.message }, { status: 500 });
        // }
    } catch (error: unknown) {
        console.error("Error in ai-chat route: ", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
