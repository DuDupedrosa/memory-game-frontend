import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function DialogWinOrLose({
  open,
  win,
}: {
  open: boolean;
  win: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  async function handlePlayAgain() {}

  async function handleExitGame() {}

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
