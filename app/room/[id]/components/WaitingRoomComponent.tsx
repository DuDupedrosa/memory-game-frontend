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
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";
import { getUserLocal } from "@/helpers/getUserLoca";
import DialogConfirmExitRoom from "./DialogConfirmExitRoom";
import DialogRemoveUser from "./DialogRemoveUser";
import { getRoomLevelText } from "@/helpers/getRoomLevel";
import { copyToClipBoard } from "@/helpers/copyToClipBoard";
import ptJson from "@/helpers/translation/pt.json";

export default function WaitingRoomComponent({ id }: { id: number | null }) {
  // Criar refs com um valor inicial vazio, mas sem null
  const readyToPlaySound = useRef<HTMLAudioElement>(
    new Audio("/sounds/ready-to-play.mp3")
  );

  const [loadingRoomUsers, setLoadingRoomUsers] = useState<boolean>(false);
  const [userLocal, setUserLocal] = useState<UserDataType | null>(null);
  const [roomUsers, setRoomUsers] = useState<UserDataType[] | []>([]);
  const [roomData, setRoomData] = useState<RoomDataType | null>(null);
  const [playerTwoIsReady, setPlayerTwoIsReady] = useState<boolean>(false);
  const [startGameLoading, setStartGameLoading] = useState<boolean>(false);
  const [readyToPlayLoading, setReadyToPlayLoading] = useState<boolean>(false);
  const [dialogExitRoom, setDialogExitRoom] = useState<boolean>(false);
  const [dialogRemoverUser, setDialogRemoveUser] = useState<{
    open: boolean;
    nickname: string;
  }>({ open: false, nickname: "" });

  function playSound(audioRef: React.RefObject<HTMLAudioElement>) {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reinicia o som para evitar delays
      audioRef.current
        .play()
        .catch((err) => console.error(ptJson.audio_playback_error, err));
    }
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

  function handleRemoveUser(nickname: string) {
    setDialogRemoveUser({
      open: true,
      nickname,
    });
  }

  useEffect(() => {
    readyToPlaySound.current.volume = 0.5;
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
        playSound(readyToPlaySound);
        // alertando o dono da sala que ele poder começar o jogo
        if (user.id === data.ownerId) {
          toast.success(ptJson.player_two_confirmed);
        }

        if (user.id !== data.ownerId) {
          toast.success(ptJson.waiting_host);
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
        const { data } = await apiService.get(`room/data/${roomId}`);
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
                    {ptJson.room_id}:
                    <span className="font-semibold text-gray-400"> {id}</span>
                  </span>
                </div>

                <div
                  className="p-1 cursor-pointer"
                  onClick={() =>
                    copyToClipBoard(roomData?.id, ptJson.id_copied)
                  }
                >
                  <FaCopy className="text-primary text-xl" />
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              <div className="grid grid-cols-[14px_1fr] items-center mt-1 md:mt-0 gap-2 mb-5">
                <FaInfoCircle className="text-sm text-blue-600" />

                <p className="text-sm text-gray-400">{ptJson.share_room}</p>
              </div>
              {roomData && (
                <span className="text-base mb-1 font-normal text-gray-50 flex items-center">
                  {ptJson.difficulty_level}:{" "}
                  <span className="rounded p-1 text-gray-50 text-sm ml-1 bg-blue-600 flex items-center gap-2">
                    {getRoomLevelText(roomData.level)}
                  </span>
                </span>
              )}
              <span className="text-base font-normal text-gray-50 flex items-center">
                {ptJson.status}:{" "}
                <span className="rounded p-1 text-gray-400 flex items-center gap-2">
                  {/* dono da sala - jogador 2 com status de pronto */}
                  {playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId === userLocal?.id &&
                    ptJson.ready_to_start}

                  {/* dono da sala - jogador 2 com status de pendente */}
                  {!playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId === userLocal?.id &&
                    ptJson.waiting_for_player_two}

                  {/* visitante - com status de confirmado */}
                  {playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId !== userLocal?.id &&
                    ptJson.waiting_for_player_one}

                  {/* visitante - com status de pendente */}
                  {!playerTwoIsReady &&
                    roomData &&
                    roomData.ownerId !== userLocal?.id &&
                    ptJson.confirm_to_play}

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
                {ptJson.players}:
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
                      <li key={i} className="flex items-center gap-3">
                        <span className="flex text-base text-gray-400">
                          (
                          {userLocal?.id === user.id
                            ? ptJson.you
                            : ptJson.enemy}
                          ) {user.nickName}
                        </span>

                        {user.id !== roomData?.ownerId &&
                          userLocal?.id === roomData?.ownerId && (
                            <Trash2
                              onClick={() => handleRemoveUser(user.nickName)}
                              className="text-red-600 w-5 transition-all hover:text-red-800 cursor-pointer"
                            />
                          )}
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
                  disabled={
                    !playerTwoIsReady || startGameLoading || loadingRoomUsers
                  }
                  className="mt-5 w-full"
                  onClick={() => handleRequestStartGame()}
                >
                  {(startGameLoading || loadingRoomUsers) && (
                    <Loader2 className="animate-spin" />
                  )}
                  {ptJson.start_game}
                </Button>
              )}
            </div>

            {/* player 2 button - confirm to play a  game */}
            <div>
              {roomData && roomData.ownerId !== userLocal?.id && (
                <Button
                  disabled={
                    playerTwoIsReady || readyToPlayLoading || loadingRoomUsers
                  }
                  className="mt-5 w-full"
                  onClick={() => handleReadyToPlayGame()}
                >
                  {(readyToPlayLoading || loadingRoomUsers) && (
                    <Loader2 className="animate-spin" />
                  )}
                  {ptJson.ready_to_play}
                </Button>
              )}
            </div>

            <div>
              <Button
                onClick={() => setDialogExitRoom(true)}
                className="w-full transition-all hover:bg-red-600 hover:text-gray-50 mt-5 bg-transparent border border-red-600 text-red-600"
              >
                {ptJson.exit_room}
              </Button>
            </div>
          </CardContent>
        </Card>

        <DialogConfirmExitRoom
          open={dialogExitRoom}
          onClose={() => setDialogExitRoom(false)}
        />

        <DialogRemoveUser
          open={dialogRemoverUser.open}
          nickName={dialogRemoverUser.nickname}
          onClose={() => setDialogRemoveUser({ open: false, nickname: "" })}
        />
      </div>
    </div>
  );
}
