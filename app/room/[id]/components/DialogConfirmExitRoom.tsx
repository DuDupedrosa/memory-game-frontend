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
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { toast } from "sonner";
import ptJson from "@/helpers/translation/pt.json";

export default function DialogConfirmExitRoom({
  open,
  onClose,
  loggedOut,
}: {
  open: boolean;
  onClose: () => void;
  loggedOut?: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean | undefined>(false);

  function handleClose() {
    onClose();
    setIsOpen(false);
    setIsLoggedOut(false);
  }

  function handleExitRoom() {
    setLoading(true);
    try {
      const user = getUserLocal();

      if (user && id) {
        socket.emit("requestUserLoggedOut", {
          playerId: user.id,
          roomId: Number(id),
        });

        // vai sair da sala + deslogar
        if (isLoggedOut) {
          window.localStorage.clear();
          router.push("/auth");

          toast.info(ptJson.disconnected);
        } else {
          // ele só quer sair da sala, ai volta para a /room
          router.replace("/room");
        }
      } else {
        toast.error(ptJson.error_exiting_room);
      }
    } catch (err) {}
    setLoading(false);
  }

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    setIsLoggedOut(loggedOut);
  }, [loggedOut]);

  return (
    <div>
      <Dialog open={isOpen}>
        <DialogContent className="bg-gray-800 w-[320px] sm:w-[480px] border-gray-400">
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col justify-center items-center mb-5">
                <GoAlertFill className="text-3xl text-red-600" />
              </div>
              <span className="text-xl text-center mb-2 font-medium block text-gray-50">
                {isLoggedOut ? ptJson.confirm_logout : ptJson.confirm_exit_room}
              </span>
            </DialogTitle>
            <DialogDescription>
              <p className="text-base mb-5 text-gray-400 text-center font-normal">
                {ptJson.both_players_removed}
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-5 justify-center">
            <Button
              disabled={loading}
              onClick={() => handleExitRoom()}
              className="bg-red-600 transition-all hover:bg-red-800 text-green-50"
            >
              {loading && <Loader2 className="animate-spin" />}
              {ptJson.confirm_yes}
            </Button>
            <Button
              onClick={() => handleClose()}
              className="bg-gray-600 hover:bg-gray-700 text-gray-50"
            >
              {ptJson.confirm_no}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
