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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";
import { getUserLocal } from "@/helpers/getUserLoca";
import DialogConfirmExitRoom from "./DialogConfirmExitRoom";

export default function WaitingRoomComponent({ id }: { id: number | null }) {
  const [loadingRoomUsers, setLoadingRoomUsers] = useState<boolean>(false);
  const [userLocal, setUserLocal] = useState<UserDataType | null>(null);
  const [roomUsers, setRoomUsers] = useState<UserDataType[] | []>([]);
  const [roomData, setRoomData] = useState<RoomDataType | null>(null);
  const [playerTwoIsReady, setPlayerTwoIsReady] = useState<boolean>(false);
  const [startGameLoading, setStartGameLoading] = useState<boolean>(false);
  const [readyToPlayLoading, setReadyToPlayLoading] = useState<boolean>(false);
  const [dialogExitRoom, setDialogExitRoom] = useState<boolean>(false);

  function handleCopyRoomNumber(room: number) {
    navigator.clipboard
      .writeText(room.toString())
      .then(() => toast.success("Room number copy to clipboard"))
      .catch(() => toast.error("Erro copy room number! try again."));
  }

  async function fetchRoomUsers(room_id?: number) {
    setLoadingRoomUsers(true);
    try {
      const { data } = await apiService.get(`room/${room_id ?? id}/users`);
      const { roomId, users } = data.content;
      setRoomUsers(users);
    } catch (err) {}
    setLoadingRoomUsers(false);
  }

  function handleRequestStartGame() {
    try {
      const user = getUserLocal();

      if (!user) return;
      setStartGameLoading(true);
      socket.emit("requestStartGame", {
        roomId: id,
        playerId: user.id,
      });
    } catch (err) {}
  }

  function handleReadyToPlayGame() {
    try {
      setReadyToPlayLoading(true);
      socket.emit("requestReadyToPlay", {
        roomId: id,
      });
    } catch (err) {}
  }

  useEffect(() => {
    const user = getUserLocal();
    if (user) {
      setUserLocal(user);
    }

    const handleNewPlayerJoined = async (playerId: string, roomId: number) => {
      try {
        const user = getUserLocal();

        if (!user) return;

        if (user.id !== playerId) {
          await fetchRoomUsers(roomId);
        }
      } catch (err) {}
    };

    const handleReadyToPlay = (data: { ownerId: string }) => {
      const user = getUserLocal();

      if (user) {
        // alertando o dono da sala que ele poder começar o jogo
        if (user.id === data.ownerId) {
          toast.success("Player two confirm! You free to start a game.");
        }

        if (user.id !== data.ownerId) {
          toast.success(
            "You're ready! Waiting for the host to start the game..."
          );
        }
      }
      setPlayerTwoIsReady(true);
      setReadyToPlayLoading(false);
    };

    // Escuta o evento 'playerJoined' emitido pelo backend
    socket.on("playerJoined", (data: { playerId: string; roomId: string }) => {
      handleNewPlayerJoined(data.playerId, Number(data.roomId));
    });

    socket.on("readyToPlay", handleReadyToPlay);

    return () => {
      // Remove o listener ao desmontar o componente
      socket.off("playerJoined", handleNewPlayerJoined);
      socket.off("readyToPlay", handleReadyToPlay);
    };
  }, []);

  useEffect(() => {
    const fetchRoom = async (roomId: number) => {
      try {
        const { data } = await apiService.get(`room/${roomId}`);
        const { playerTwoIsReadyToPlay } = data.content;
        setRoomData(data.content);
        setPlayerTwoIsReady(playerTwoIsReadyToPlay);
      } catch (err) {}
    };

    if (id) {
      // Verifica se o valor convertido é um número válido
      fetchRoomUsers();
      fetchRoom(id);
    }
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen h-full bg-gray-900">
      <div className="min-h-screen flex flex-col justify-center items-center px-5 md:px-0">
        <Card className="w-full md:w-1/2 xl:w-[30%] min-h-[50vh] bg-gray-800 border-purple-800 shadow-none flex flex-col">
          <CardHeader className="border-b border-b-solid border-b-gray-400">
            <CardTitle className="">
              <div className="flex items-center gap-2">
                <div>
                  <span className="text-2xl text-gray-50 font-normal">
                    Room number:
                    <span className="font-semibold text-gray-400"> {id}</span>
                  </span>
                </div>

                <div
                  className="p-1 cursor-pointer"
                  onClick={() => handleCopyRoomNumber(Number(id))}
                >
                  <FaCopy className="text-primary text-xl" />
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              <div className="grid grid-cols-[14px_1fr] items-center mt-1 md:mt-0 gap-2 mb-5">
                <FaInfoCircle className="text-sm text-blue-600" />

                <p className="text-sm text-gray-400">
                  Share your room number with a friend to start a game.
                </p>
              </div>
              <span className="text-base font-normal text-gray-50 flex items-center">
                Status:{" "}
                <span className="rounded p-1 text-gray-400 flex items-center gap-2">
                  {/* dono da sala - jogador 2 com status de pronto */}
                  {playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId === userLocal?.id &&
                    "Ready to start game"}

                  {/* dono da sala - jogador 2 com status de pendente */}
                  {!playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId === userLocal?.id &&
                    "Waiting for player 2 confirm"}

                  {/* visitante - com status de confirmado */}
                  {playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId !== userLocal?.id &&
                    "Waiting player 1 start game"}

                  {/* visitante - com status de pendente */}
                  {!playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId !== userLocal?.id &&
                    "Confirm to play a game"}

                  <span className="relative flex size-3">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                        playerTwoIsReady ? "bg-green-600" : "bg-yellow-400"
                      } opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex size-3 rounded-full ${
                        playerTwoIsReady ? "bg-green-600" : "bg-yellow-400"
                      }`}
                    ></span>
                  </span>
                </span>
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 h-full flex-1 flex flex-col">
            <div className="flex-1">
              <h2 className="text-xl text-gray-50 font-medium mb-3">
                Players:
              </h2>
              {loadingRoomUsers && (
                <div>
                  <Loader2 className="animate-spin text-primary" />
                </div>
              )}

              {!loadingRoomUsers && roomUsers && roomUsers.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {roomUsers.map((user, i) => {
                    return (
                      <li key={i}>
                        <span className="flex text-base text-gray-400">
                          ({userLocal?.id === user.id ? "You" : "Enemy"}){" "}
                          {user.nickName}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* player 1 button - start game */}
            <div>
              {roomData && roomData.ownerId === userLocal?.id && (
                <Button
                  disabled={!playerTwoIsReady || startGameLoading}
                  className="mt-5 w-full"
                  onClick={() => handleRequestStartGame()}
                >
                  {startGameLoading && <Loader2 className="animate-spin" />}
                  Iniciar partida
                </Button>
              )}
            </div>

            {/* player 2 button - confirm to play a  game */}
            <div>
              {roomData && roomData.ownerId !== userLocal?.id && (
                <Button
                  disabled={playerTwoIsReady || readyToPlayLoading}
                  className="mt-5 w-full"
                  onClick={() => handleReadyToPlayGame()}
                >
                  {readyToPlayLoading && <Loader2 className="animate-spin" />}
                  I'm ready to play
                </Button>
              )}
            </div>

            <div>
              <Button
                onClick={() => setDialogExitRoom(true)}
                className="w-full transition-all hover:bg-red-600 hover:text-gray-50 mt-5 bg-transparent border border-red-600 text-red-600"
              >
                Exit room
              </Button>
            </div>
          </CardContent>
        </Card>

        <DialogConfirmExitRoom
          open={dialogExitRoom}
          onClose={() => setDialogExitRoom(false)}
        />
      </div>
    </div>
  );
}
