import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const runId = searchParams.get("runId");

        if (!runId) {
            return NextResponse.json(
                { error: "Missing runId parameter" },
                { status: 400 }
            );
        }

        // Query AI job từ Convex
        const result = await fetchQuery(api.aiEditor.getAiResult, { runId });

        if (!result) {
            return NextResponse.json(
                { result: null, status: "pending" },
                { status: 200 }
            );
        }

        return NextResponse.json({
            result: result.result,
            status: result.status,
        });

    } catch (error: unknown) {
        console.error("❌ Error in ai-editor-result route:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}