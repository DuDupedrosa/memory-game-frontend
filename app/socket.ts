"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  withCredentials: true, // Permite o envio de cookies e credenciais
  transports: ["websocket"], // Força o uso do WebSocket (se possível)
});
