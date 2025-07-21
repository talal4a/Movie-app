import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChatRoom } from '@/components/ChatRoom';
export default function WatchParty() {
  const { roomId } = useParams();
  const user = useSelector((state) => state.user?.user);
  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Room ID is required. Please join a room using a valid link.
        </div>
      </div>
    );
  }
  return <ChatRoom roomId={roomId} user={user} />;
}
