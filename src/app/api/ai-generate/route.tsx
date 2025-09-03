import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const run = await inngest.send({
            name: "ai-generate",
            data: {
                chatId: body.chatId,
                senderId: body.senderId,
                prompt: body.prompt,
            },
            waitForResponse: true,
        });

        const answer = (run as any).response?.answer || (run as any).result?.answer || "Không có nội dung nào được tạo.";

        // return NextResponse.json({ runId: run.ids?.[0] });
        return NextResponse.json({ answer });
    } catch (error: any) {
        console.error("❌ Error in ai-generate route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
