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

export default function DialogRemoveUser({
  open,
  onClose,
  nickName,
}: {
  open: boolean;
  onClose: () => void;
  nickName: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  function handleClose() {
    onClose();
    setIsOpen(false);
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

        toast.info(ptJson.player_two_removed);
        router.replace("/room");
      } else {
        toast.error(ptJson.error_exiting_room);
      }
    } catch (err) {}
    setLoading(false);
  }

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div>
      <Dialog open={isOpen}>
        <DialogContent className="bg-gray-800 w-[320px] sm:w-[480px] border-gray-400">
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col justify-center items-center mb-5">
                <GoAlertFill className="text-3xl text-red-600" />
              </div>
              <span className="text-xl text-center mb-2 font-normal block text-gray-50">
                <span>
                  {ptJson.confirm_removal}
                  <span className="font-semibold"> {nickName} </span>
                  {ptJson.remove_from_room}
                </span>
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
