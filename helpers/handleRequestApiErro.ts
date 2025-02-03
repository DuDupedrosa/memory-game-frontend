import { AxiosError, HttpStatusCode } from "axios";
import { toast } from "sonner";
import ptJson from "@/helpers/translation/pt.json";

export function handleRequestApiErro(err: any) {
  if (err instanceof AxiosError) {
    const errorMessage = err.response?.data?.message as keyof typeof ptJson;

    if (err.status !== HttpStatusCode.InternalServerError) {
      if (errorMessage && ptJson[errorMessage]) {
        toast.error(ptJson[errorMessage]);
      } else {
        toast.error(ptJson.default_erro_message);
      }
    }
  }
}
