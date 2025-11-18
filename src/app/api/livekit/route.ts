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
        return NextResponse.json({ error: "LiveKit: Không cấp phép" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");
    if (!meetingId) {
        return NextResponse.json({ error: "LiveKit: Thiếu meetingId" }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

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