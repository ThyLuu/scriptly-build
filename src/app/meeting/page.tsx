// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import { CarouselLayout, ConnectionState, ConnectionStateToast, FocusLayout, GridLayout, LiveKitRoom, ParticipantTile, PreJoin, RoomAudioRenderer, VideoConference, useParticipants, useTracks } from '@livekit/components-react';
// // import '@livekit/components-styles';
// // import { useRoomContext, useLocalParticipant } from "@livekit/components-react";
// // import { Button } from "@/components/ui/button";
// // import { Track } from 'livekit-client';
// // import { useUser } from '@clerk/nextjs';

// // function MeetingPage() {
// //     const [token, setToken] = useState<string | null>(null);
// //     const [roomName, setRoomName] = useState<string | null>(null);

// //     const user = useUser();

// //     useEffect(() => {
// //         const startMeeting = async () => {
// //             const res = await fetch('/api/livekit');
// //             const data = await res.json();
// //             setToken(data.token);
// //             setRoomName(data.roomName);
// //         };
// //         startMeeting();
// //     }, []);

// //     if (!token || !roomName) {
// //         return <div className="flex items-center justify-center h-screen">Đang kết nối ...</div>;
// //     }

// //     return (
// //         <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
// //             <div className="w-[90%] h-[90%] rounded-lg shadow-lg overflow-hidden border bg-white">
// //                 <LiveKitRoom
// //                     token={token}
// //                     serverUrl="wss://scriptly-ikd9xmbw.livekit.cloud"
// //                     connect={true}
// //                     className="w-full h-full"
// //                     lang='vi'
// //                     audio={false}
// //                     video={false}
// //                     data-lk-theme="default"
// //                 >
// //                     <RoomAudioRenderer />

// //                     <div className="flex flex-col h-full">
// //                         <div className="p-2 border-b">
// //                             <ParticipantAvatars />
// //                         </div>
// //                         <div className="flex-1">
// //                             <VideoConference />

// //                         </div>
// //                         {/* <ControlBar  /> */}
// //                     </div>
// //                 </LiveKitRoom>
// //             </div>
// //         </div>
// //     );

// //     // return (
// //     //     <LiveKitRoom
// //     //         token={token}
// //     //         serverUrl="wss://scriptly-ikd9xmbw.livekit.cloud"
// //     //         connect={true}
// //     //         className="w-full h-full"
// //     //         data-lk-theme="default"
// //     //     >
// //     //         <RoomAudioRenderer />

// //     //         <div className="flex flex-col h-full">
// //     //             <div className="p-2 border-b">
// //     //                 <ParticipantAvatars />
// //     //             </div>

// //     //             {/* video layout */}
// //     //             <div className="flex-1">
// //     //                 <VideoLayout />
// //     //             </div>

// //     //             {/* control bar custom tiếng Việt */}
// //     //             <div className="p-2 border-t">
// //     //                 <ControlBar />
// //     //             </div>
// //     //         </div>
// //     //     </LiveKitRoom>
// //     // );

// //     // return (
// //     //     <LiveKitRoom
// //     //         token={token}
// //     //         serverUrl="wss://scriptly-ikd9xmbw.livekit.cloud"
// //     //         connect={true}
// //     //         className="w-full h-full"
// //     //         data-lk-theme="default"
// //     //     >
// //     //         <PreJoin lang='vi' micLabel='Micro' userLabel='Nhập tên của bạn ...' joinLabel='Tham gia' defaults={{username: user.user?.fullName || 'Khách'}} />
// //     //         {/* <RoomAudioRenderer /> */}
// //     //         {/* <ParticipantAvatars /> */}
// //     //         {/* <VideoConference /> */}
// //     //     </LiveKitRoom>
// //     // )
// // }
// // export default MeetingPage;

// // function ParticipantAvatars() {
// //     const participants = useParticipants();

// //     return (
// //         <div className="flex gap-2 p-2">
// //             {participants.map((p) => {
// //                 const meta = p.metadata ? JSON.parse(p.metadata) : {};
// //                 return (
// //                     <div key={p.sid} className="flex flex-col items-center">
// //                         <img
// //                             src={meta.avatar || '/default-avatar.png'}
// //                             alt={p.name}
// //                             className="w-12 h-12 rounded-full border"
// //                         />
// //                         <span className="text-xs mt-1">{p.name}</span>
// //                     </div>
// //                 );
// //             })}
// //         </div>
// //     );
// // }

// // function ControlBar() {
// //     const room = useRoomContext();
// //     const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, cameraTrack, microphoneTrack, } = useLocalParticipant();

// //     return (
// //         <div className="flex gap-2">
// //             <Button onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)} className='border-white'>
// //                 {isMicrophoneEnabled ? "Tắt mic" : "Bật mic"}
// //             </Button>

// //             <Button onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}>
// //                 {isCameraEnabled ? "Tắt camera" : "Bật camera"}
// //             </Button>

// //             <Button onClick={() => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)}>
// //                 {isScreenShareEnabled ? "Tắt chia sẻ màn hình" : "Chia sẻ màn hình"}
// //             </Button>

// //             <Button onClick={() => room.disconnect()} className='bg-red-500 hover:bg-red-600 text-white'>
// //                 Thoát
// //             </Button>
// //         </div>
// //     );
// // }

// // function VideoLayout() {
// //     // lấy tất cả track video + screen share
// //     const tracks = useTracks([
// //         { source: Track.Source.Camera, withPlaceholder: true },
// //         { source: Track.Source.ScreenShare, withPlaceholder: false },
// //     ]);

// //     return (
// //         <GridLayout tracks={tracks} className="h-full w-full bg-black">
// //             <ParticipantTile />
// //         </GridLayout>
// //     );
// // }


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import CustomVideoConference from '@/components/CustomVideoConference';

// function MeetingPage() {
//     const [token, setToken] = useState<string | null>(null);
//     const [roomName, setRoomName] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const user = useUser();

//     useEffect(() => {
//         const startMeeting = async () => {
//             try {
//                 setLoading(true);
//                 const res = await fetch('/api/livekit');
                
//                 if (!res.ok) {
//                     throw new Error('Không thể kết nối đến server');
//                 }
                
//                 const data = await res.json();
//                 setToken(data.token);
//                 setRoomName(data.roomName);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
//             } finally {
//                 setLoading(false);
//             }
//         };
        
//         startMeeting();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <div className="text-gray-800 text-xl">Đang kết nối...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <div className="text-red-400 text-xl">Lỗi: {error}</div>
//             </div>
//         );
//     }

//     if (!token || !roomName) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <div className="text-gray-800 text-xl">Không thể tạo phiên họp</div>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full h-screen">
//             <CustomVideoConference 
//                 token={token}
//                 serverUrl="wss://scriptly-ikd9xmbw.livekit.cloud"
//                 options={{
//                     // LiveKit options
//                     adaptiveStream: true,
//                     dynacast: true,
//                     videoCaptureDefaults: {
//                         resolution: {
//                             width: 1280,
//                             height: 720
//                         }
//                     }
//                 }}
//             />
//         </div>
//     );
// }

// export default MeetingPage;