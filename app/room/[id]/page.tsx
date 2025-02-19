"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WaitingRoomComponent from "./components/WaitingRoomComponent";
import { socket } from "@/app/socket";
import GameBoard from "./components/game-board/GameBoard";
import { getUserLocal } from "@/helpers/getUserLoca";
import MainHeader from "@/components/MainHeader";
import { toast } from "sonner";
import ptJson from "@/helpers/translation/pt.json";

const componentStep = {
  WAITING_ROOM: 1,
  GAME_BOARD: 2,
};

export default function page() {
  const { id } = useParams();
  const [roomId, setRoomId] = useState<number | null>(null);
  const router = useRouter();
  const [step, setStep] = useState<number>(componentStep.WAITING_ROOM);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    const handleUserLogout = () => {
      try {
        const reload = localStorage.getItem("reload");
        const user = getUserLocal();

        if (!user) {
          localStorage.clear();
          router.push("/auth/login");
          return;
        }

        // o usuário que fez o reload
        if (reload && reload === "true") {
          socket.emit("requestUserLoggedOut", {
            roomId: roomId,
            playerId: user.id,
          });

          localStorage.removeItem("reload");
          router.replace("/room");
        }
      } catch (err) {}
    };

    if (step === componentStep.WAITING_ROOM && isClient) {
      handleUserLogout();
    }
  }, [step, isClient]);

  useEffect(() => {
    if (id) {
      const numericId = Number(id);

      // Verifica se o valor convertido é um número válido
      if (!isNaN(numericId)) {
        setRoomId(numericId);
      } else {
        router.push("/room");
      }
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      localStorage.setItem("reload", "true");
      // Exibe o alerta padrão
      event.preventDefault();
      event.returnValue = ""; // Necessário para o alerta padrão
    };

    const handleStartGame = (data: { roomId: string }) => {
      // Redireciona o jogador para a sala recém-criada
      setStep(componentStep.GAME_BOARD);
    };

    const handleLoggedOut = (data: { roomId: string; playerId: string }) => {
      toast.warning(ptJson.opponent_disconnected);
      router.replace("/room");
    };

    socket.on("startGame", handleStartGame);
    socket.on("userLoggedOut", handleLoggedOut);
    window.addEventListener("beforeunload", handleBeforeUnload);
    setIsClient(true);
    // chama todas as vezes
    return () => {
      // Remove o listener ao desmontar o componente
      socket.off("startGame", handleStartGame);
      socket.off("userLoggedOut", handleLoggedOut);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <MainHeader isGameBoard={true} />
      {step === componentStep.WAITING_ROOM && (
        <WaitingRoomComponent id={roomId} />
      )}

      {step === componentStep.GAME_BOARD && (
        <GameBoard
          id={roomId}
          playAgain={() => setStep(componentStep.WAITING_ROOM)}
        />
      )}
    </div>
  );
}
