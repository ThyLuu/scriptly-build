import { fetchMutation } from "convex/nextjs";
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

export const aiChat = inngest.createFunction(
    { id: "ai-chat" },
    { event: "ai-chat" },
    async ({ event, step }) => {
        // event sẽ chứa user message
        const userMessage = event.data.message;
        const chatId = event.data.chatId;
        const senderId = event.data.senderId;

        // Gửi message user vào Convex
        // await fetchMutation(api.messages.sendMessage, {
        //     chatId,
        //     senderId,
        //     role: "user",
        //     content: userMessage,
        // });

        // Gọi Gemini
        const aiResp = await step.ai.infer("ai-chat-call", {
            model: step.ai.models.gemini({
                model: "gemini-2.5-flash",
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
            }),
            body: {
                contents: [
                    {
                        role: 'model',
                        parts: [
                            {
                                text: 'Bạn là một trợ lý AI. Hãy trả lời ngắn gọn, tự nhiên.',
                            }
                        ]
                    },
                    {
                        role: "user",
                        parts: [{ text: userMessage }],
                    },
                ],
            },
        });

        const aiText = aiResp?.candidates?.[0]?.content?.parts?.[0] && "text" in aiResp.candidates[0].content.parts[0]
            ? aiResp.candidates[0].content.parts[0].text
            : "Xin lỗi, hãy thử lại sau.";

        // Lưu message AI vào Convex
        await fetchMutation(api.messages.sendMessage, {
            chatId,
            senderId: "ai", // hoặc "system"
            role: "ai",
            content: aiText,
        })

        return { answer: aiText }
    }
)

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
