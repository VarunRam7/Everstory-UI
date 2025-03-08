import { Socket, io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_FRIENDSHIP_BE_HOST;

export const friendshipSocket: Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

friendshipSocket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
});

friendshipSocket.on('disconnect', () => {
  console.log('❌ Disconnected from WebSocket server');
});
