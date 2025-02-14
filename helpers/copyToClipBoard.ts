import { toast } from "sonner";
import ptJson from "@/helpers/translation/pt.json";

export const copyToClipBoard = (item: any, messageOnSuccess?: string) => {
  navigator.clipboard
    .writeText(item.toString())
    .then(() => toast.success(messageOnSuccess ?? ptJson.item_copied))
    .catch(() => toast.error(ptJson.copy_error));
};
