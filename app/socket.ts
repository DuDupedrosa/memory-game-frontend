"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "", {
  withCredentials: true, // Permite o envio de cookies e credenciais
  transports: ["websocket"], // Força o uso do WebSocket (se possível)
});
