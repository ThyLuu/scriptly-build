// import { NextResponse } from "next/server";

// export async function GET() {
//     const apiKey = process.env.LIVEKIT_API_KEY!;
//     const apiSecret = process.env.LIVEKIT_API_SECRET!;
//     const roomName = "scriptly-room";

//     const res = await fetch(
//         `https://cloud.livekit.io/api/rooms/${roomName}`,
//         {
//             headers: {
//                 Authorization: `Basic ${Buffer.from(apiKey + ":" + apiSecret).toString("base64")}`,
//             },
//         }
//     );

//     if (res.status === 404) {
//         return NextResponse.json({ active: false });
//     }

//     const data = await res.json();
//     return NextResponse.json({ active: true, participants: data.num_participants });
// }

// import { NextResponse } from "next/server";

// export async function GET() {
//     const apiKey = process.env.LIVEKIT_API_KEY!;
//     const apiSecret = process.env.LIVEKIT_API_SECRET!;
//     const roomName = "scriptly-room";

//     const res = await fetch(
//         `https://cloud.livekit.io/api/rooms/${roomName}`,
//         {
//             headers: {
//                 Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
//             },
//         }
//     );

//     if (res.status === 404) {
//         return NextResponse.json({ active: false, participants: 0 });
//     }

//     const data = await res.json();

//     return NextResponse.json({
//         active: (data.num_participants ?? 0) > 0,
//         participants: data.num_participants ?? 0,
//     });
// }

import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");
    if (!meetingId) {
        return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://cloud.livekit.io/api/rooms/${meetingId}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
            },
        });

        if (res.status === 404) {
            return NextResponse.json({ active: false, participants: 0 });
        }

        const data = await res.json();
        return NextResponse.json({
            active: (data.num_participants ?? 0) > 0,
            participants: data.num_participants ?? 0,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ active: false, participants: 0 });
    }
}
