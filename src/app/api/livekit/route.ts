// import { NextResponse } from "next/server";
// import { currentUser } from "@clerk/nextjs/server";
// import { AccessToken } from "livekit-server-sdk";

// export async function GET() {
//     const user = await currentUser();

//     if (!user) {
//         return NextResponse.json(
//             { error: "Không có quyền truy cập" },
//             { status: 401 }
//         );
//     }

//     const apiKey = process.env.LIVEKIT_API_KEY!;
//     const apiSecret = process.env.LIVEKIT_API_SECRET!;

//     // Room cố định (hoặc bạn có thể random)
//     const roomName = "scriptly-room";

//     // Tạo token
//     const at = new AccessToken(apiKey, apiSecret, {
//         identity: user.id,
//         name: user.fullName || "Ẩn danh",
//     });

//     at.addGrant({
//         room: roomName,
//         roomJoin: true,
//         canPublish: true,
//         canSubscribe: true,
//     });

//     at.metadata = JSON.stringify({ 
//         avatar: user.imageUrl,
//         email: user.primaryEmailAddress?.emailAddress,
//     });

//     const token = await at.toJwt();

//     return NextResponse.json({ token, roomName });
// }


import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: Request) {
    const user = await currentUser();
    // console.log("currentUser:", user);

    if (!user) {
        console.log("LiveKit API: User not authenticated");
        return NextResponse.json({ error: "LiveKit: Không cấp phép, hãy đăng nhập để tham gia cuộc họp" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const meetingId = searchParams.get("meetingId")
    if (!meetingId) {
        console.log("LiveKit API: Missing meetingId")
        return NextResponse.json({ error: "LiveKit: Thiếu meetingId" }, { status: 400 })
    }

    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

    if (!apiKey || !apiSecret) {
        console.error("LiveKit API: Missing environment variables");
        return NextResponse.json({ error: "Cấu hình server không đầy đủ" }, { status: 500 })
    }

    const at = new AccessToken(apiKey, apiSecret, {
        identity: user.id,
        name: user.fullName || "Ẩn danh",
        ttl: 6000, // token sống 6000 giây
    });

    at.addGrant({
        room: meetingId,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
    });

    at.metadata = JSON.stringify({
        avatar: user.imageUrl,
        email: user.primaryEmailAddress?.emailAddress,
    });

    const token = await at.toJwt();
    return NextResponse.json({ token, roomName: meetingId });
}