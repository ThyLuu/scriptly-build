"use client";
import { use, useEffect, useState } from "react";
import CustomVideoConference from "@/components/CustomVideoConference";

export default function MeetingPage({ params }: { params: Promise<{ meetingId: string }> }) {
    const { meetingId } = use(params); // unwrap Promise

    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startMeeting = async () => {
            try {
                const res = await fetch(`/api/livekit?meetingId=${meetingId}`);

                if (!res.ok) throw new Error("Không thể kết nối đến server");
                
                const data = await res.json();
                setToken(data.token);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };
        startMeeting();
    }, [meetingId]);

    if (loading) return <div className="h-screen flex items-center justify-center">Đang kết nối...</div>;
    if (error) return <div className="h-screen flex items-center justify-center text-red-500">Lỗi: {error}</div>;
    if (!token) return <div className="h-screen flex items-center justify-center">Không thể tạo phiên họp</div>;

    return (
        <div className="w-full h-screen">
            <CustomVideoConference
                token={token}
                serverUrl="wss://scriptly-ikd9xmbw.livekit.cloud"
                options={{
                    adaptiveStream: true,
                    dynacast: true,
                    videoCaptureDefaults: { resolution: { width: 1280, height: 720 } },
                }}
            />
        </div>
    );
}
