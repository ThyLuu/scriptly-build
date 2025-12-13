import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

// Chuẩn hóa input từ user trước khi gửi cho AI.
// Loại bỏ khoảng trắng thừa, gộp nhiều khoảng trắng liên tiếp thành 1 khoảng trắng duy nhất.
// trim() → xóa khoảng trắng đầu và cuối message
// đây là phần NPL cơ bản để làm sạch dữ liệu đầu vào
function preprocessMessage(message: string) {
    return message.trim().replace(/\s+/g, " ");
}

// Lọc nội dung nhạy cảm, tục tĩu hoặc không hợp lệ từ AI trước khi gửi cho user.
function filterToxic(text: string) {
    const bannedWords = ["badword1", "badword2", "stupid", "idiot"]; // tuỳ chỉnh
    for (const w of bannedWords) if (text.toLowerCase().includes(w)) return "Xin lỗi, tôi không thể trả lời nội dung này.";
    return text;
}

// Gọi API Gemini (AI) để lấy câu trả lời từ message.
// Tự động retry nếu API fail (mạng, timeout, lỗi tạm thời).
async function callGeminiWithRetry(step: unknown, body: unknown, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            // @ts-expect-error - Inngest step types are complex
            return await step.ai.infer("ai-chat-call", body);
        } catch (err) {
            console.error("AI call failed, retrying...", i, err);
            if (i === retries) throw err;
        }
    }
}

interface GeminiCandidate {
    content: {
        parts: Array<{ text?: string }>;
    };
}

export const aiChat = inngest.createFunction(
    { id: "ai-chat" },
    { event: "ai-chat" },
    async ({ event, step }) => {
        const userMessage = preprocessMessage(event.data.message);
        const chatId = event.data.chatId;
        // const senderId = event.data.senderId;

        // Lấy lịch sử chat gần nhất (5 tin nhắn)
        const recentMessages = await fetchQuery(api.messages.getMessages, { chatId });
        const contextMessages = recentMessages.slice(-5).map(m => `${m.role}: ${m.content}`).join("\n");

        // Chuẩn bị body cho Gemini
        const body = {
            model: step.ai.models.gemini({
                model: "gemini-2.5-flash",
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
            }),
            body: {
                contents: [
                    {
                        role: 'model',
                        parts: [
                            { text: 'Bạn là một trợ lý AI. Hãy trả lời ngắn gọn, tự nhiên.' },
                            { text: contextMessages ? `Context:\n${contextMessages}` : "" },
                        ]
                    },
                    {
                        role: "user",
                        parts: [{ text: userMessage }],
                    },
                ],
            },
        };

        // Gọi Gemini với retry
        const aiResp = await callGeminiWithRetry(step, body);

        // Chọn candidate tốt nhất
        const candidates = (aiResp?.candidates ?? []) as GeminiCandidate[];
        let aiText = "Xin lỗi, hãy thử lại sau.";

        if (candidates.length > 0) {
            aiText = candidates.reduce((prev: string, cur: GeminiCandidate) => {
                const text = cur.content.parts[0]?.text ?? "";
                return text.length > prev.length ? text : prev;
            }, "");
        }

        // Filter nội dung nhạy cảm
        aiText = filterToxic(aiText);

        // Logging
        // console.log(`[AI CHAT] chatId: ${chatId}, sender: ${senderId}, messageLength: ${aiText.length}`);

        // Lưu message AI vào Convex
        await fetchMutation(api.messages.sendMessage, {
            chatId,
            senderId: "ai",
            role: "ai",
            content: aiText,
        });

        return { answer: aiText };
    }
);

// export const aiChat = inngest.createFunction(
//     { id: "ai-chat" },
//     { event: "ai-chat" },
//     async ({ event, step }) => {
//         // event sẽ chứa user message
//         const userMessage = event.data.message;
//         const chatId = event.data.chatId;
//         const senderId = event.data.senderId;

//         // Gửi message user vào Convex
//         // await fetchMutation(api.messages.sendMessage, {
//         //     chatId,
//         //     senderId,
//         //     role: "user",
//         //     content: userMessage,
//         // });

//         // Gọi Gemini
//         const aiResp = await step.ai.infer("ai-chat-call", {
//             model: step.ai.models.gemini({
//                 model: "gemini-2.5-flash",
//                 apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
//             }),
//             body: {
//                 contents: [
//                     {
//                         role: 'model',
//                         parts: [
//                             {
//                                 text: 'Bạn là một trợ lý AI. Hãy trả lời ngắn gọn, tự nhiên.',
//                             }
//                         ]
//                     },
//                     {
//                         role: "user",
//                         parts: [{ text: userMessage }],
//                     },
//                 ],
//             },
//         });

//         const aiText = aiResp?.candidates?.[0]?.content?.parts?.[0] && "text" in aiResp.candidates[0].content.parts[0]
//             ? aiResp.candidates[0].content.parts[0].text
//             : "Xin lỗi, hãy thử lại sau.";

//         // Lưu message AI vào Convex
//         await fetchMutation(api.messages.sendMessage, {
//             chatId,
//             senderId: "ai", // hoặc "system"
//             role: "ai",
//             content: aiText,
//         })

//         return { answer: aiText }
//     }
// )

export const aiEditorTools = inngest.createFunction(
    { id: "ai-editor-tools" },
    { event: "ai/editor" },
    async ({ event, step }) => {
        const { selectedText, action, customPrompt, runId } = event.data;

        // Làm sạch input
        const cleanText = preprocessMessage(selectedText);
        if (!cleanText || cleanText.length === 0) {
            await fetchMutation(api.aiEditor.setAiResult, {
                runId,
                result: "Không tìm thấy nội dung nào để xử lý.",
            });
            return { result: "Không tìm thấy nội dung nào để xử lý." };
        }

        // Build prompt theo action
        let prompt = "";
        switch (action) {
            case "summarize":
                prompt = `Tóm tắt đoạn văn sau thật ngắn gọn và tự nhiên:\n\n${cleanText}`;
                break;
            case "rewrite":
                prompt = `Viết lại đoạn văn sau theo cách rõ ràng, mượt và tự nhiên:\n\n${cleanText}`;
                break;
            case "generate":
                prompt = `Dựa trên nội dung sau, hãy tạo thêm ý tưởng hoặc mở rộng nội dung:\n\n${cleanText}`;
                break;
            case "custom":
                prompt = `${customPrompt}\n\nNội dung:\n${cleanText}`;
                break;
            default:
                await fetchMutation(api.aiEditor.setAiResult, {
                    runId,
                    result: "Action không hợp lệ.",
                });
                return { result: "Action không hợp lệ." };
        }

        // Body gửi Gemini
        const body = {
            model: step.ai.models.gemini({
                model: "gemini-2.5-flash",
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
            }),
            body: {
                contents: [
                    {
                        role: "model",
                        parts: [
                            { text: "Bạn là AI chuyên xử lý văn bản. Hãy trả lời đúng yêu cầu." }
                        ]
                    },
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            },
        };

        try {
            // Gọi AI + retry
            const aiResp = await callGeminiWithRetry(step, body);
            const candidates = (aiResp?.candidates ?? []) as GeminiCandidate[];
            let result = "Không thể tạo kết quả.";

            if (candidates.length > 0) {
                result = candidates.reduce((prev: string, cur: GeminiCandidate) => {
                    const text = cur.content.parts[0]?.text ?? "";
                    return text.length > prev.length ? text : prev;
                }, "");
            }

            // Filter nội dung không phù hợp
            result = filterToxic(result);

            // LƯU KẾT QUẢ VÀO CONVEX
            await fetchMutation(api.aiEditor.setAiResult, {
                runId,
                result,
            });

            console.log(`✅ AI Editor completed: runId=${runId}, resultLength=${result.length}`);
            return { answer: result };

        } catch (error) {
            console.error(`❌ AI Editor failed: runId=${runId}`, error);

            // Lưu error status vào DB nếu cần
            const errorMsg = error instanceof Error ? error.message : "Lỗi xử lý";
            await fetchMutation(api.aiEditor.setAiResult, {
                runId,
                result: `Lỗi: ${errorMsg}`,
            });

            throw error;
        }
    }
);