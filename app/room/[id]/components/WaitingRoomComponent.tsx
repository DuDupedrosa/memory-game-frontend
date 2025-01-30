"use client";

import { apiService } from "@/app/apiService";
import { socket } from "@/app/socket";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoomDataType } from "@/types/room";
import { UserDataType } from "@/types/user";
import { useEffect, useState } from "react";

export default function WaitingRoomComponent({ id }: { id: number | null }) {
  const [loadingRoomUsers, setLoadingRoomUsers] = useState<boolean>(false);
  const [userLocal, setUserLocal] = useState<UserDataType | null>(null);
  const [roomUsers, setRoomUsers] = useState<UserDataType[] | []>([]);
  const [roomData, setRoomData] = useState<RoomDataType | null>(null);

  async function fetchRoomUsers(room_id?: number) {
    setLoadingRoomUsers(true);
    try {
      const { data } = await apiService.get(`room/${room_id ?? id}/users`);
      const { roomId, users } = data.content;
      setRoomUsers(users);
    } catch (err) {}
    setLoadingRoomUsers(false);
  }

  useEffect(() => {
    const fetchRoom = async (roomId: number) => {
      try {
        const { data } = await apiService.get(`room/${roomId}`);
        setRoomData(data.content);
      } catch (err) {}
    };

    if (id) {
      // Verifica se o valor convertido é um número válido
      fetchRoomUsers();
      fetchRoom(id);
    }
  }, [id]);

  async function handleRequestStartGame() {
    try {
      const user = localStorage.getItem("user");

      if (!user) return;
      const parsedUser = JSON.parse(user);

      socket.emit("requestStartGame", {
        roomId: id,
        playerId: parsedUser.id,
      });
    } catch (err) {}
  }

  useEffect(() => {
    const handleNewPlayerJoined = async (playerId: string, roomId: number) => {
      try {
        const user = localStorage.getItem("user");

        if (!user) return;
        const parsedUser = JSON.parse(user);

        if (parsedUser.id !== playerId) {
          await fetchRoomUsers(roomId);
        }
      } catch (err) {}
    };

    const userLocal = localStorage.getItem("user");

    if (userLocal) {
      const parsedUser = JSON.parse(userLocal);
      setUserLocal(parsedUser);
    }

    // Escuta o evento 'playerJoined' emitido pelo backend
    socket.on("playerJoined", (data: { playerId: string; roomId: string }) => {
      handleNewPlayerJoined(data.playerId, Number(data.roomId));
      console.log("Novo jogador entrou:", data);
    });

    return () => {
      // Remove o listener ao desmontar o componente
      socket.off("playerJoined", handleNewPlayerJoined);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-full items-center justify-center">
      <Card className="max-w-lg">
        <CardHeader className="">
          <CardTitle>Sala: {id}</CardTitle>
          <CardDescription>Status: aguardando jogador</CardDescription>
        </CardHeader>
        <CardContent className="min-w-[420px]">
          {!loadingRoomUsers && roomUsers && roomUsers.length > 0 && (
            <ul className="flex flex-col gap-2">
              {roomUsers.map((user, i) => {
                return (
                  <li key={i}>
                    <span>
                      ({userLocal?.id === user.id ? "Você" : "Adversário"})
                      Jogador: {user.nickName}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {roomData && roomData.ownerId === userLocal?.id && (
            <Button
              className="mt-5 w-full"
              onClick={() => handleRequestStartGame()}
            >
              Iniciar partida
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
