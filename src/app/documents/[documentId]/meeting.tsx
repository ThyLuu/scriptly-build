// import { Button } from '@/components/ui/button';
// import { Video } from 'lucide-react';
// import { useEffect, useState } from 'react';

// function Meeting() {
//     const [active, setActive] = useState(false);

//     useEffect(() => {
//         const fetchStatus = async () => {
//             try {
//                 const res = await fetch('/api/livekit/status');
//                 if (!res.ok) return;
//                 const data = await res.json();
//                 setActive(data.active && data.participants > 0);
//             } catch (err) {
//                 console.error(err);
//             }
//         };

//         fetchStatus();
//         const interval = setInterval(fetchStatus, 5000); // 5s
//         return () => clearInterval(interval);
//     }, []);

//     const handleClick = () => {
//         window.open('/meeting', '_blank');
//     };

//     return (
//         <Button onClick={handleClick} variant="ghost" className="relative">
//             <Video />
//             {active && (
//                 <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
//             )}
//         </Button>
//     );
// }

// export default Meeting;


import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MeetingButtonProps {
    documentId: string;
}

function Meeting({ documentId }: MeetingButtonProps) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/livekit/status?meetingId=${documentId}`, {
                    credentials: 'include'
                });
                if (!res.ok) return;
                const data = await res.json();
                if (isMounted) setActive(data.active && data.participants > 0);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 100000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [documentId]);

    const handleClick = () => {
        window.open(`/meeting/${documentId}`, '_blank');
    };

    return (
        <Button onClick={handleClick} variant="ghost" className="relative">
            <Video />
            {active && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
            )}
        </Button>
    );
}

export default Meeting;
