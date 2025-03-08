import { Socket, io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_IMAGE_BE_HOST;

export const imageSocket: Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

imageSocket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
});

imageSocket.on('disconnect', () => {
  console.log('❌ Disconnected from WebSocket server');
});
