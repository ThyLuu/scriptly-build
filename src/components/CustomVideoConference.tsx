import React, { useState, useEffect } from 'react';
import { LiveKitRoom, useLocalParticipant, useRemoteParticipants, useTracks, useRoomContext, useConnectionState, VideoTrack, RoomAudioRenderer, useParticipants } from '@livekit/components-react';
import { Track, RemoteParticipant, LocalParticipant, ConnectionState as LiveKitConnectionState } from 'livekit-client';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Phone, MessageSquare, Settings, Users, Copy, } from 'lucide-react';

interface CustomVideoConferenceProps {
    token: string;
    serverUrl: string;
    options?: any;
}

interface ChatMessage {
    id: number;
    message: string;
    participant: string;
    timestamp: Date;
    isLocal?: boolean;
}

interface DeviceList {
    microphones: MediaDeviceInfo[];
    cameras: MediaDeviceInfo[];
}

// Main Custom VideoConference Component
const CustomVideoConference: React.FC<CustomVideoConferenceProps> = ({
    token,
    serverUrl,
    options = {}
}) => {
    return (
        <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            options={options}
            className="h-screen w-full"
            connect={true}
            data-lk-theme="default"
        >
            <VideoConferenceContent />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
};

// Main Conference Content
const VideoConferenceContent = () => {
    const [showChat, setShowChat] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const room = useRoomContext();
    const connectionState = useConnectionState();
    const participants = useParticipants();

    useEffect(() => {
        const handleDataReceived = (payload: Uint8Array, participant?: RemoteParticipant) => {
            try {
                const data = JSON.parse(new TextDecoder().decode(payload));
                if (data.type === 'chat') {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            message: data.message,
                            participant: participant?.name || participant?.identity || 'Ẩn danh',
                            timestamp: new Date(),
                        },
                    ]);

                    if (!showChat) {
                        setUnreadCount(prev => prev + 1);
                    }
                }
            } catch (err) {
                console.error('Lỗi parse tin nhắn:', err);
            }
        };

        room.on('dataReceived', handleDataReceived);
        return () => {
            room.off('dataReceived', handleDataReceived);
        };
    }, [room]);

    useEffect(() => {
        if (showChat) {
            setUnreadCount(0);
        }
    }, [showChat]);

    // Tracks for video layout
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    if (connectionState === LiveKitConnectionState.Connecting) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-800 text-xl">Đang kết nối ...</div>
            </div>
        );
    }

    if (connectionState === LiveKitConnectionState.Disconnected) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-800 text-xl">Đã ngắt kết nối</div>
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with participant count */}
                <div className="p-4 flex justify-between items-center bg-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-gray-700 text-xl font-semibold">Cuộc họp</h1>
                        <div className="text-gray-500 text-sm">
                            {participants.length} người tham gia
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ParticipantAvatars />
                    </div>
                </div>

                {/* Video Grid */}
                <div className="flex-1 p-4 overflow-hidden">
                    <VideoGrid tracks={tracks} />
                </div>

                {/* Control Bar */}
                <div className=" p-4 shrink-0">
                    <ControlBar
                        onToggleChat={() => setShowChat(!showChat)}
                        onToggleSettings={() => setShowSettings(!showSettings)}
                        onToggleParticipants={() => setShowParticipants(!showParticipants)}
                        unreadCount={unreadCount}
                    />
                </div>
            </div>

            {/* Side Panels */}
            {showChat && <ChatPanel onClose={() => setShowChat(false)} messages={messages} onSendMessage={(msg) => {
                const data = JSON.stringify({ type: 'chat', message: msg });
                room.localParticipant.publishData(new TextEncoder().encode(data));
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        message: msg,
                        participant: 'Bạn',
                        timestamp: new Date(),
                        isLocal: true,
                    },
                ]);
            }} />}
            {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
            {showParticipants && <ParticipantsPanel onClose={() => setShowParticipants(false)} />}
        </div>
    );
};

// Participant Avatars
const ParticipantAvatars = () => {
    const participants = useParticipants();

    return (
        <div className="flex -space-x-2">
            {participants.slice(0, 5).map((p) => {
                const meta = p.metadata ? JSON.parse(p.metadata) : {};
                return (
                    <div key={p.sid} className="relative group">
                        <img
                            src={meta.avatar || '/default-avatar.png'}
                            alt={p.name || p.identity}
                            className="w-8 h-8 rounded-full border-2 border-gray-800 hover:border-blue-500 transition-colors"
                        />
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {p.name || p.identity}
                        </div>
                    </div>
                );
            })}
            {participants.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-white text-xs">
                    +{participants.length - 5}
                </div>
            )}
        </div>
    );
};

// Video Grid Component
const VideoGrid = ({ tracks }: { tracks: any[] }) => {
    const screenShareTracks = tracks.filter(
        t => t.source === Track.Source.ScreenShare && t.publication?.track
    );

    const cameraTracks = tracks.filter(t => t.source === Track.Source.Camera);

    if (screenShareTracks.length > 0) {
        const screenTrack = screenShareTracks[0]; // chỉ lấy 1 screen share

        return (
            <div className="flex h-full gap-4">
                {/* Screen share lớn ở bên trái */}
                <div className="flex-1 bg-black rounded-lg overflow-hidden">
                    <CustomParticipantTile track={screenTrack} isSingle={true} />
                </div>

                {/* Sidebar dọc các camera tracks */}
                <div className="flex flex-col gap-4 w-1/4 overflow-y-auto">
                    {cameraTracks.map(track => (
                        <div key={track.participant.sid} className="">
                            <CustomParticipantTile track={track} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Nếu không có screen share → grid bình thường
    const getGridClass = (count: number) => {
        if (count <= 1) return 'grid-cols-1 h-full';
        if (count <= 4) return 'grid-cols-2';
        if (count <= 9) return 'grid-cols-3';
        return 'grid-cols-4';
    };

    return (
        <div className={`grid ${getGridClass(cameraTracks.length)} gap-4 h-full`}>
            {cameraTracks.map(track => (
                <CustomParticipantTile
                    key={`${track.participant.sid}_${track.publication?.trackSid}`}
                    track={track}
                    isSingle={cameraTracks.length === 1}
                />
            ))}
        </div>
    );
};

// Custom Participant Tile
// const CustomParticipantTile = ({ track, isSingle }: { track: any; isSingle?: boolean }) => {
//     const { participant } = track;
//     const isLocal = participant instanceof LocalParticipant;
//     const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
//     const isCameraOn = participant.isCameraEnabled && track.publication?.track;

//     return (
//         <div className={`relative bg-gray-800 rounded-lg overflow-hidden ${isSingle ? "w-full h-full" : "aspect-video"} group`}>
//             {isCameraOn ? (
//                 <VideoTrack
//                     trackRef={track}
//                     className="w-full h-full object-cover"
//                 />
//             ) : (
//                 <div className="flex items-center justify-center h-full bg-gradient-to-br">
//                     {meta.avatar ? (
//                         <img
//                             src={meta.avatar}
//                             alt={participant.name || participant.identity}
//                             className="w-24 h-24 rounded-full border-4 border-white"
//                         />
//                     ) : (
//                         <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
//                             {(participant.name || participant.identity)?.[0]?.toUpperCase()}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Participant Info Overlay */}
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
//                 {participant.name || participant.identity}
//                 {isLocal && ' (Bạn)'}
//             </div>

//             {/* Mute Indicators */}
//             <div className="absolute top-2 right-2 flex gap-1">
//                 {participant.isMicrophoneEnabled === false && (
//                     <div className="bg-red-500 p-1 rounded">
//                         <MicOff size={16} className="text-white" />
//                     </div>
//                 )}
//                 {participant.isCameraEnabled === false && (
//                     <div className="bg-red-500 p-1 rounded">
//                         <VideoOff size={16} className="text-white" />
//                     </div>
//                 )}
//             </div>

//             {/* Connection Quality (optional) */}
//             <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <div className="flex gap-1">
//                     {[1, 2, 3, 4].map((i) => (
//                         <div key={i} className="w-1 h-3 bg-green-500 rounded"></div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

const CustomParticipantTile = ({ track, isSingle }: { track: any; isSingle?: boolean }) => {
    const { participant } = track;
    const isLocal = participant instanceof LocalParticipant;
    const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
    const isCameraTrack = track.source === Track.Source.Camera;
    const isScreenShareTrack = track.source === Track.Source.ScreenShare;
    const hasVideoTrack = track.publication?.track;

    // Điều kiện hiển thị video:
    const shouldShowVideo =
        hasVideoTrack && (isScreenShareTrack || (isCameraTrack && participant.isCameraEnabled));

    return (
        <div
            className={`relative bg-gray-800 rounded-lg overflow-hidden ${isSingle ? "w-full h-full" : "aspect-video"
                } group`}
        >
            {shouldShowVideo ? (
                <VideoTrack trackRef={track} className="w-full h-full object-cover" />
            ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br">
                    {meta.avatar ? (
                        <img
                            src={meta.avatar}
                            alt={participant.name || participant.identity}
                            className="w-24 h-24 rounded-full border-4 border-white"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {(participant.name || participant.identity)?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {participant.name || participant.identity}
                {isLocal && ' (Bạn)'}
            </div>

            {/* Mute Indicators */}
            {isCameraTrack && (
                <div className="absolute top-2 right-2 flex gap-1">
                    {!participant.isMicrophoneEnabled && (
                        <div className="bg-red-500 p-1 rounded">
                            <MicOff size={16} className="text-white" />
                        </div>
                    )}
                    {!participant.isCameraEnabled && (
                        <div className="bg-red-500 p-1 rounded">
                            <VideoOff size={16} className="text-white" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Control Bar Component
const ControlBar = ({ onToggleChat, onToggleSettings, onToggleParticipants, unreadCount }: {
    onToggleChat: () => void;
    onToggleSettings: () => void;
    onToggleParticipants: () => void;
    unreadCount: number;
}) => {
    const { localParticipant } = useLocalParticipant();
    const room = useRoomContext();
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [copied, setCopied] = useState(false);

    const toggleMicrophone = async () => {
        try {
            await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
        } catch (error: any) {
            if (error.name === 'NotAllowedError') {
                setPermissionDenied(true)
                return;
            }
            console.error("Lỗi bật/tắt micro:", error);
        }
    };

    const toggleCamera = async () => {
        try {
            await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
        } catch (error: any) {
            if (error.name === 'NotAllowedError') {
                setPermissionDenied(true)
                return;
            }
            console.error("Lỗi bật/tắt camera:", error);
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (isScreenSharing) {
                await localParticipant.setScreenShareEnabled(false);
                setIsScreenSharing(false);
            } else {
                const result = await localParticipant.setScreenShareEnabled(true);
                console.log("ScreenShare track started:", result);
                setIsScreenSharing(true);
            }
        } catch (error) {
            console.log('Lỗi chia sẻ màn hình:', error);

            // console.error('Lỗi chia sẻ màn hình:', error);
        }
    };

    const handleDisconnect = () => {
        room.disconnect();
        window.close(); // Đóng tab nếu mở trong tab mới
    };

    const copyMeetingLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 5000);
        });
    };

    return (
        <div className="flex justify-between items-center mx-16 py-3 px-6 bg-slate-100 rounded-full">
            {/* Left side - Meeting info */}
            <div className="flex items-center gap-4">
                <button
                    onClick={copyMeetingLink}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Sao chép link cuộc họp"
                >
                    <Copy size={16} />
                    <span className="text-sm">
                        {copied ? "Đã copy" : "Chia sẻ"}
                    </span>
                </button>
            </div>

            {/* Center - Main controls */}
            <div className="flex justify-center items-center gap-4">
                {/* Audio Control */}
                <button
                    onClick={toggleMicrophone}
                    className={`p-3 rounded-full transition-colors ${localParticipant.isMicrophoneEnabled
                        ? 'bg-gray-600 hover:bg-gray-500'
                        : 'bg-red-600 hover:bg-red-500'
                        }`}
                    title={localParticipant.isMicrophoneEnabled ? 'Tắt micro' : 'Bật micro'}
                >
                    {localParticipant.isMicrophoneEnabled ? (
                        <Mic className="text-white" size={20} />
                    ) : (
                        <MicOff className="text-white" size={20} />
                    )}
                </button>

                {/* Video Control */}
                <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-full transition-colors ${localParticipant.isCameraEnabled
                        ? 'bg-gray-600 hover:bg-gray-500'
                        : 'bg-red-600 hover:bg-red-500'
                        }`}
                    title={localParticipant.isCameraEnabled ? 'Tắt camera' : 'Bật camera'}
                >
                    {localParticipant.isCameraEnabled ? (
                        <Video className="text-white" size={20} />
                    ) : (
                        <VideoOff className="text-white" size={20} />
                    )}
                </button>

                {/* Screen Share */}
                <button
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-full transition-colors ${isScreenSharing
                        ? 'bg-blue-600 hover:bg-blue-500'
                        : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                    title={isScreenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}
                >
                    {isScreenSharing ? (
                        <MonitorOff className="text-white" size={20} />
                    ) : (
                        <Monitor className="text-white" size={20} />
                    )}
                </button>

                {/* Disconnect */}
                <button
                    onClick={handleDisconnect}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-500 transition-colors"
                    title="Rời phòng"
                >
                    <Phone className="text-white" size={20} />
                </button>
            </div>

            {/* Right side - Secondary controls */}
            <div className="flex items-center gap-2">
                {/* Chat Toggle */}
                <button
                    onClick={onToggleChat}
                    className="relative p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
                    title="Tin nhắn"
                >
                    <MessageSquare className="text-white" size={18} />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Participants Toggle */}
                <button
                    onClick={onToggleParticipants}
                    className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
                    title="Người tham gia"
                >
                    <Users className="text-white" size={18} />
                </button>

                {/* Settings Toggle */}
                <button
                    onClick={onToggleSettings}
                    className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
                    title="Cài đặt"
                >
                    <Settings className="text-white" size={18} />
                </button>
            </div>

            {permissionDenied && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm text-center">
                        <h2 className="text-lg font-semibold text-red-600 mb-2">Quyền bị chặn</h2>
                        <p className="text-gray-700 text-sm mb-4">
                            Bạn đã chặn quyền truy cập camera hoặc microphone.<br />
                            Vui lòng bật lại trong cài đặt trình duyệt để tiếp tục.
                        </p>
                        <button
                            onClick={() => setPermissionDenied(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

const ChatPanel = ({
    onClose,
    messages,
    onSendMessage,
}: {
    onClose: () => void;
    messages: ChatMessage[];
    onSendMessage: (msg: string) => void;
}) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-semibold">Tin nhắn</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>

            {/* header */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-3">
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-400">{msg.participant}</span>
                            <span className="text-xs text-gray-500">{msg.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <div className="text-white">{msg.message}</div>
                    </div>
                ))}
            </div>

            {/* input */}
            <div className="p-2 border-t border-gray-700">
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Nhập tin nhắn..."
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
};

// Participants Panel
const ParticipantsPanel = ({ onClose }: { onClose: () => void }) => {
    const participants = useRemoteParticipants();
    const { localParticipant } = useLocalParticipant();

    const renderAvatar = (participant: any, size: number = 32) => {
        let avatarUrl: string | null = null;

        if (participant.metadata) {
            try {
                const meta = typeof participant.metadata === 'string' ? JSON.parse(participant.metadata) : participant.metadata;
                avatarUrl = meta.avatar;
            } catch (err) {
                console.error("Lỗi parse metadata:", err);
            }
        }

        if (!avatarUrl && participant.identity) {
            avatarUrl = participant.identityAvatar || null; // Tùy LiveKit setup
        }

        if (avatarUrl) {
            return (
                <img
                    src={avatarUrl}
                    alt={participant.name || participant.identity}
                    style={{ width: size, height: size }}
                    className="rounded-full object-cover"
                />
            );
        } else {
            const fallbackChar = (participant.name || participant.identity || "?")[0].toUpperCase();
            return (
                <div
                    style={{ width: size, height: size }}
                    className="rounded-full bg-gray-500 flex items-center justify-center text-white font-bold"
                >
                    {fallbackChar}
                </div>
            );
        }
    };

    return (
        <div className="w-80 bg-gray-800 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-semibold">Người tham gia ({participants.length + 1})</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>

            <div className="p-4">
                {/* Local Participant */}
                <div className="flex items-center gap-3 mb-3 p-2 bg-gray-700 rounded">
                    {renderAvatar(localParticipant, 32)}

                    {/* <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {(localParticipant.name || localParticipant.identity)[0]}
                    </div> */}

                    <div className="flex-1">
                        <div className="text-white">{localParticipant.name || localParticipant.identity}</div>
                        <div className="text-gray-400 text-sm">Bạn</div>
                    </div>

                    <div className="flex gap-1">
                        {!localParticipant.isMicrophoneEnabled && <MicOff size={16} className="text-red-400" />}
                        {!localParticipant.isCameraEnabled && <VideoOff size={16} className="text-red-400" />}
                    </div>
                </div>

                {/* Remote Participants */}
                {participants.map((participant) => (
                    <div key={participant.sid} className="flex items-center gap-3 mb-3 p-2 hover:bg-gray-700 rounded">
                        {renderAvatar(participant, 32)}

                        {/* <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {(participant.name || participant.identity)[0]}
                        </div> */}

                        <div className="flex-1">
                            <div className="text-white">{participant.name || participant.identity}</div>
                        </div>

                        <div className="flex gap-1">
                            {!participant.isMicrophoneEnabled && <MicOff size={16} className="text-red-400" />}
                            {!participant.isCameraEnabled && <VideoOff size={16} className="text-red-400" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Settings Panel
const SettingsPanel = ({ onClose }: { onClose: () => void }) => {
    const [selectedMic, setSelectedMic] = useState('');
    const [selectedCamera, setSelectedCamera] = useState('');
    const [devices, setDevices] = useState<DeviceList>({
        microphones: [],
        cameras: []
    });

    useEffect(() => {
        const getDevices = async () => {
            try {
                const deviceList = await navigator.mediaDevices.enumerateDevices();
                setDevices({
                    microphones: deviceList.filter(device => device.kind === 'audioinput'),
                    cameras: deviceList.filter(device => device.kind === 'videoinput')
                });
            } catch (error: any) {
                console.error('Lỗi lấy danh sách thiết bị:', error);
            }
        };

        getDevices();
    }, []);

    return (
        <div className="w-80 bg-gray-800 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-semibold">Cài đặt</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>

            <div className="p-4">
                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">Microphone</label>
                    <select
                        value={selectedMic}
                        onChange={(e) => setSelectedMic(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                    >
                        <option value="">Mặc định</option>
                        {devices.microphones.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">Camera</label>
                    <select
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                    >
                        <option value="">Mặc định</option>
                        {devices.cameras.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CustomVideoConference;