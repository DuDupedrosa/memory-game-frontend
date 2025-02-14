import { socket } from "@/app/socket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogBg40";
import { getUserLocal } from "@/helpers/getUserLoca";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GameOver from "@/assets/img/fim-de-jogo.png";
import Image from "next/image";
import Trophy from "@/assets/img/trophy.png";
import ptJson from "@/helpers/translation/pt.json";

export default function DialogWinOrLose({
  open,
  win,
  roomId,
  playAgain,
}: {
  open: boolean;
  win: boolean;
  roomId: number;
  playAgain: () => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  async function handleExitGame() {
    try {
      const user = getUserLocal();
      if (!user) return;
      socket.emit("requestExitGame", {
        roomId,
        playerId: user.id,
      });
    } catch (err) {}
  }

  return (
    <div>
      <Dialog open={isOpen}>
        <DialogContent
          className={`p-6 bg-gray-800 md:w-[520px] w-[320px] border-gray-400 text-white rounded-lg shadow-xl transform transition-all duration-300 `}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-2xl md:text-3xl font-bold text-center ${
                win ? "" : "shake"
              }`}
            >
              {!win && (
                <div className="flex flex-col justify-center items-center mb-5">
                  <Image alt="game-over" src={GameOver} className="w-32 h-32" />
                </div>
              )}
              {win && (
                <div className="flex flex-col justify-center items-center mb-5">
                  <Image alt="win-gane" src={Trophy} className="w-32 h-32" />
                </div>
              )}
              {win ? ptJson.game_result_win : ptJson.game_result_lose}
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg text-center mt-2">
              {win
                ? ptJson.game_result_win_message
                : ptJson.game_result_lose_message}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center flex-col md:flex-row md:items-center mt-6 gap-4">
            {/* Botões estilizados */}
            <Button
              onClick={() => playAgain()}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            >
              {ptJson.play_again}
            </Button>
            <Button
              onClick={() => handleExitGame()}
              variant="secondary"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            >
              {ptJson.exit_game}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
