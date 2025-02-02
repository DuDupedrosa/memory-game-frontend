import { socket } from "@/app/socket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserLocal } from "@/helpers/getUserLoca";
import { useEffect, useState } from "react";

export default function DialogWinOrLose({
  open,
  win,
  roomId,
}: {
  open: boolean;
  win: boolean;
  roomId: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  async function handlePlayAgain() {}

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {win
                ? "Parabéns você ganhou!"
                : "Poxa, você perdeu! não foi dessa vez"}
            </DialogTitle>
            <DialogDescription>
              {win ? "Ganhou, monstro!!" : "Perdeu, melhore!!"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-5 justify-end">
            <Button onClick={() => handlePlayAgain()}>Jogar novamente</Button>
            <Button onClick={() => handleExitGame()} variant={"secondary"}>
              Sair do jogo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
