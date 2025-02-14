import { toast } from "sonner";

export const copyToClipBoard = (item: any, messageOnSuccess?: string) => {
  navigator.clipboard
    .writeText(item.toString())
    .then(() =>
      toast.success(messageOnSuccess ?? "Item copiado para o clipboard")
    )
    .catch(() => toast.error("Erro copy room number! try again."));
};
