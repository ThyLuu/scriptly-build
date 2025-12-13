import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { runId, selectedText, action, customPrompt, ownerId } = body;

        // Validate input
        if (!runId || !selectedText || !action) {
            return NextResponse.json(
                { error: "Missing required fields: runId, selectedText, action" },
                { status: 400 }
            );
        }

        // ✅ STEP 1: Lưu record vào Convex với status "pending"
        try {
            await fetchMutation(api.aiEditor.createAiJob, {
                runId,
                ownerId: ownerId || "unknown",
                selectedText,
                action,
                customPrompt: customPrompt || "",
            });
            console.log(`📝 Created AI job record: runId=${runId}`);
        } catch (dbError) {
            console.error("❌ Failed to create AI job record:", dbError);
            return NextResponse.json(
                { error: "Failed to create job record" },
                { status: 500 }
            );
        }

        // ✅ STEP 2: Trigger Inngest event
        try {
            const run = await inngest.send({
                name: "ai/editor",
                data: {
                    runId,
                    selectedText,
                    action,
                    customPrompt: customPrompt || "",
                },
            });

            console.log(`🚀 Inngest event triggered: runId=${runId}, inngestId=${run.ids?.[0]}`);

            return NextResponse.json({
                runId,
                inngestId: run.ids?.[0],
                message: "AI job started successfully"
            });

        } catch (inngestError) {
            console.error("❌ Failed to trigger Inngest:", inngestError);
            return NextResponse.json(
                { error: "Failed to trigger AI job" },
                { status: 500 }
            );
        }

    } catch (error: unknown) {
        console.error("❌ Error in ai-editor route:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}