const Room = require("../models/RoomModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose');

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected to room:", socket.id);
    
    socket.on("create-room", async ({ roomName, hostId = 'system' }) => {
      const roomId = uuidv4();
      socket.join(roomId);
      
      try {
        let hostUserId = null;
        
        // Validate and process host ID if it's not 'system'
        if (hostId !== 'system') {
          if (!mongoose.Types.ObjectId.isValid(hostId)) {
            throw new Error('Invalid host ID format');
          }
          const userExists = await User.findById(hostId);
          if (!userExists) {
            throw new Error('Host user not found');
          }
          hostUserId = hostId;
        }

        const roomData = {
          roomId,
          roomName: roomName || `Room-${roomId.substring(0, 6)}`,
          host: hostUserId,
          hostType: hostId === 'system' ? 'system' : 'user',
          participants: hostId === 'system' ? ['system'] : [hostId]
        };

        const newRoom = await Room.create(roomData);
        
        socket.emit("room-created", { 
          roomId: newRoom.roomId, 
          roomName: newRoom.roomName,
          hostType: newRoom.hostType
        });
        
        console.log(`Room created: ${roomData.roomName} (${roomId})`);
      } catch (err) {
        console.error("Error creating room:", err);
        socket.emit("error", { 
          message: `Room creation failed: ${err.message}` 
        });
      }
    });
    socket.on("join-room", async (data) => {
      try {
        // Validate and set defaults
        if (!data || !data.roomId) {
          throw new Error('Room ID is required');
        }
        
        const { roomId } = data;
        const userId = data.userId || 'system';
        
        const room = await Room.findOne({ roomId });
        if (!room) {
          // If room doesn't exist, create it as a system room
          const defaultRoomName = `Room-${roomId.length > 6 ? roomId.substring(0, 6) : roomId}`;
          
          socket.emit("create-room", { 
            roomId, 
            roomName: data.roomName || defaultRoomName,
            hostId: 'system'
          });
          return;
        }

        // Add user to the room
        socket.join(roomId);
        
        // Only add to participants if not already in the room
        if (!room.participants.includes(userId)) {
          room.participants.push(userId);
          await room.save();
          
          // Notify others in the room
          socket.to(roomId).emit("user-joined", { 
            userId,
            roomId,
            isHost: room.host === userId
          });
        }

        // Get chat history for this room
        const Message = require('../models/messageModel');
        const messages = await Message.find({ roomId })
          .sort({ sentAt: 1 }) // Oldest first
          .limit(50) // Limit to last 50 messages
          .populate('senderId', 'name avatar role');

        // Format messages for the client
        const formattedMessages = messages.map(msg => ({
          _id: msg._id,
          text: msg.text,
          sender: {
            id: msg.senderId?._id || 'system',
            name: msg.senderId?.name || 'System',
            avatar: msg.senderId?.avatar,
            role: msg.senderId?.role
          },
          timestamp: msg.sentAt
        }));

        // Send room info and chat history to the joining user
        socket.emit("room-joined", { 
          roomId,
          roomName: room.roomName,
          hostType: room.hostType,
          participants: room.participants.filter(id => id !== 'system'), // Filter out system user
          isHost: room.host === userId,
          messages: formattedMessages
        });

        console.log(`User ${userId} joined room ${roomId}`);
      } catch (err) {
        console.error("Error in join-room:", err);
        socket.emit("error", { 
          message: `Failed to join room: ${err.message}` 
        });
      }
    });
    socket.on("leave-room", async ({ roomId, userId = 'system' }) => {
      try {
        socket.leave(roomId);
        const room = await Room.findOne({ roomId });
        
        if (!room) {
          console.log(`Room ${roomId} not found when user ${userId} tried to leave`);
          return;
        }

        // Remove user from participants if they're in the room
        const initialCount = room.participants.length;
        room.participants = room.participants.filter(id => id !== userId);
        
        // If the user was actually in the room
        if (initialCount !== room.participants.length) {
          // If the leaving user was the host and there are other participants
          if (room.host && room.host.toString() === userId && room.participants.length > 0) {
            // Find the first non-system participant to be the new host
            const newHost = room.participants.find(id => id !== 'system');
            if (newHost) {
              room.host = newHost;
              room.hostType = newHost === 'system' ? 'system' : 'user';
              io.to(roomId).emit("host-changed", { 
                newHostId: newHost,
                roomId 
              });
            }
          }
          
          // Save changes to the room
          await room.save();
          
          // Notify others in the room
          socket.to(roomId).emit("user-left", { 
            userId,
            roomId,
            newHostId: room.host
          });
        }

        // If no participants left (except system), delete the room
        const nonSystemParticipants = room.participants.filter(id => id !== 'system');
        if (nonSystemParticipants.length === 0) {
          await Room.deleteOne({ roomId });
          io.to(roomId).emit("room-deleted", { roomId });
          return;
        }

        // Acknowledge to the user that they've left
        socket.emit("room-left", { 
          roomId,
          success: true 
        });
        
        console.log(`User ${userId} left room ${roomId}`);
      } catch (err) {
        console.error("Error in leave-room:", err);
        socket.emit("error", { 
          message: `Failed to leave room: ${err.message}` 
        });
      }
    });
  });
};
