import { io } from 'socket.io-client'

const SOCKET_URL = 'https://vanvas-an-uttarakhand-homestay.onrender.com'

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
})
