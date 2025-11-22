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

// export const aiGenerate = inngest.createFunction(
//     { id: "ai-generate" },
//     { event: "ai-generate" },
//     async ({ event, step }) => {
//         const userPrompt = event.data.prompt;
//         const chatId = event.data.chatId;
//         const senderId = event.data.senderId;

//         // Gọi Gemini
//         const aiResp = await step.ai.infer("ai-generate-call", {
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
//                                 text: 'Bạn là một AI tạo nội dung. Viết nội dung sáng tạo, chi tiết, rõ ràng dựa trên yêu cầu của người dùng,',
//                             }
//                         ]
//                     },
//                     {
//                         role: "user",
//                         parts: [{ text: userPrompt }],
//                     },
//                 ],
//             },
//         });

//         const aiText = aiResp?.candidates?.[0]?.content?.parts?.[0] && "text" in aiResp.candidates[0].content.parts[0]
//             ? aiResp.candidates[0].content.parts[0].text
//             : "Xin lỗi, hãy thử lại sau.";

//         // Lưu message AI vào Convex
//         // await fetchMutation(api.messages.sendMessage, {
//         //     chatId,
//         //     senderId: "ai", // hoặc "system"
//         //     role: "ai",
//         //     content: aiText,
//         // })

//         return { answer: aiText }
//     }
// )

// export const aiGenerate = inngest.createFunction(
//     { id: "ai-generate" },
//     { event: "ai-generate" },
//     async ({ event, step }) => {
//         const userPrompt = event.data.prompt;

//         const aiResp = await step.ai.infer("ai-generate-call", {
//             model: step.ai.models.gemini({ model: "gemini-2.5-flash", apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! }),
//             body: {
//                 contents: [
//                     { role: "model", parts: [{ text: "Bạn là AI..." }] },
//                     { role: "user", parts: [{ text: userPrompt }] }
//                 ]
//             }
//         });

//         const firstPart = aiResp?.candidates?.[0]?.content?.parts?.[0];

//         let aiText = "Xin lỗi, hãy thử lại sau.";

//         if (firstPart && "text" in firstPart) {
//             aiText = firstPart.text;
//         }

//         console.log("AI Text:", aiText);

//         return { answer: aiText };
//     }
// );
