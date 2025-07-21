import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketProvider';
export const ChatRoom = ({ roomId, user }) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);
  useEffect(() => {
    if (!socket) {
      setConnectionStatus('Socket not available');
      return;
    }
    if (!isConnected) {
      setConnectionStatus('Connecting to chat service...');
      return;
    }
    const handleNewMessage = (msg) => {
      console.log('Received message:', msg);

      const messageText = msg.message !== undefined ? msg.message : msg.text;
      if (messageText === undefined) {
        console.error('Invalid message format - missing message/text:', msg);
        return null;
      }

      const sender = msg.sender || {};
      const messageData = {
        id: msg._id || `msg-${Date.now()}`,
        text: messageText,
        user: {
          id: sender.id || msg.senderId || 'system',
          name: sender.name || 'User',
          avatar: sender.avatar,
          role: sender.role,
        },
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      };

      console.log('Adding new message to state:', messageData);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (m) =>
            (m.id && m.id === messageData.id) ||
            (m.text === messageData.text && m.user.id === messageData.user.id)
        );

        if (messageExists) {
          console.log(
            'Message already exists, not adding duplicate:',
            messageData
          );
          return prevMessages;
        }

        console.log('Adding new message to chat:', messageData);
        return [...prevMessages, messageData];
      });

      return messageData;
    };
    const handleRoomJoined = (data) => {
      console.log('Successfully joined room:', data);
      setConnectionStatus(`Connected to room: ${data.roomId}`);
      if (data.messages && Array.isArray(data.messages)) {
        console.log(
          `Received ${data.messages.length} messages in room history`
        );
        setMessages(
          data.messages.map((msg) => ({
            id: msg._id || Date.now(),
            text: msg.text || msg.message,
            user: {
              id: msg.sender?.id || 'system',
              name: msg.sender?.name || 'System',
              avatar: msg.sender?.avatar,
              role: msg.sender?.role,
            },
            timestamp: msg.timestamp || new Date(),
          }))
        );
      }
    };

    const handleRoomError = (error) => {
      console.error('Room error:', error);
      setConnectionStatus(`Error: ${error.message || 'Unknown error'}`);
    };

    const handleRoomCreated = (data) => {
      console.log('Room created:', data);
      setConnectionStatus(`Created and joined room: ${data.roomName}`);
    };

    socket.on('receive-message', handleNewMessage);
    socket.on('room-joined', handleRoomJoined);
    socket.on('room-created', handleRoomCreated);
    socket.on('error', handleRoomError);
    const debugHandler = (event, ...args) => {
      console.log(`Socket event: ${event}`, args);
    };
    socket.onAny(debugHandler);
    const initializeRoom = async () => {
      try {
        if (!roomId) {
          setConnectionStatus('No room ID provided');
          return;
        }
        setConnectionStatus(`Joining room ${roomId}...`);
        const joinData = {
          roomId: roomId,
          roomName: `Chat Room ${roomId.substring(0, 6)}`,
          userId: user?.id || 'system',
        };
        console.log('Attempting to join room with data:', joinData);
        socket.emit('join-room', joinData);
      } catch (error) {
        console.error('Error initializing room:', error);
        setConnectionStatus(`Error: ${error.message}`);
      }
    };
    initializeRoom();
    return () => {
      socket.off('receive-message', handleNewMessage);
      socket.off('room-joined', handleRoomJoined);
      socket.off('room-created', handleRoomCreated);
      socket.off('error', handleRoomError);
      socket.offAny(debugHandler);
    };
  }, [socket, isConnected, roomId, user]);
  const sendMessage = () => {
    if (!socket || !isConnected || input.trim() === '') return;
    if (!roomId) {
      setConnectionStatus('Error: No room ID provided');
      return;
    }
    const messageData = {
      roomId,
      message: input.trim(),
      senderId: user?.id || 'anonymous',
    };
    console.log('Sending message:', messageData);
    socket.emit('send-message', messageData);
    setInput('');
  };
  if (!socket) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Chat is not available. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="mb-2 text-sm text-gray-600">
        Status: {connectionStatus} | Room: {roomId} | User:{' '}
        {user?.id || 'anonymous'}
      </div>
      <div className="flex-1 overflow-y-auto mb-4 border rounded bg-white p-2">
        {!isConnected ? (
          <div className="text-center text-gray-500 p-4">
            Connecting to chat...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No messages yet. Say hello!
          </div>
        ) : (
          <div className="space-y-2" id="chat-messages">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                try {
                  if (!msg || !msg.text) {
                    console.warn('Invalid message format:', msg);
                    return null;
                  }

                  const messageKey = msg.id || `msg-${index}`;
                  const senderName = msg.user?.name || 'User';
                  const messageTime = msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString()
                    : 'Just now';

                  return (
                    <div
                      key={messageKey}
                      className="p-3 rounded shadow-sm bg-gray-50 border border-gray-200"
                      data-message-id={messageKey}
                    >
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <strong className="text-blue-600 truncate">
                              {senderName}:
                            </strong>
                            <span className="ml-2 whitespace-pre-wrap break-words text-black">
                              {msg.text}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {messageTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.error('Error rendering message:', error, msg);
                  return null;
                }
              })
            ) : (
              <div className="text-center text-gray-500 p-4">
                No messages found in this room.
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={
            isConnected ? 'Type your message...' : 'Connecting to chat...'
          }
          disabled={!isConnected}
          className={`flex-1 p-2 border rounded-l text-black ${
            !isConnected ? 'bg-gray-100' : ''
          }`}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};
