import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoAlertFill } from "react-icons/go";
import ptJson from "@/helpers/translation/pt.json";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { apiService } from "@/app/apiService";

export default function DialogDelete({
  open,
  onClose,
  onSuccess,
  id,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id: number;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function handleDeleteRoom() {
    setLoading(true);
    try {
      if (!id) return;
      await apiService.delete(`room/${id}`);
      toast.success(ptJson.delete_room_success);
      onSuccess();
    } catch (err) {
      handleRequestApiErro(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-gray-800 w-[320px] sm:w-[480px] border-gray-400">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col justify-center items-center mb-5">
              <GoAlertFill className="text-3xl text-red-600" />
            </div>
            <span className="text-xl text-center mb-2 font-normal block text-gray-50">
              {ptJson.delete_room_title} {id}?
            </span>
          </DialogTitle>
          <DialogDescription>
            <p className="text-base mb-5 text-gray-400 text-center font-normal">
              {ptJson.delete_room_alert}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-5 justify-center">
          <Button
            disabled={loading}
            onClick={() => handleDeleteRoom()}
            className="bg-red-600 transition-all hover:bg-red-800 text-green-50"
          >
            {loading && <Loader2 className="animate-spin" />}
            {ptJson.confirm_delete}
          </Button>
          <Button
            onClick={() => onClose()}
            className="bg-gray-600 hover:bg-gray-700 text-gray-50"
          >
            {ptJson.confirm_no}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
