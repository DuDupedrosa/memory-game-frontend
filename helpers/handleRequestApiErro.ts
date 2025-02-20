import { AxiosError, HttpStatusCode } from "axios";
import { toast } from "sonner";
import ptJson from "@/helpers/translation/pt.json";

export function handleRequestApiErro(err: any, returnErrMessage = false) {
  if (err instanceof AxiosError) {
    const errorMessage = err.response?.data?.message as keyof typeof ptJson;

    if (
      err.status !== HttpStatusCode.InternalServerError &&
      err.status !== HttpStatusCode.Unauthorized
    ) {
      if (errorMessage && ptJson[errorMessage]) {
        if (!returnErrMessage) {
          toast.error(ptJson[errorMessage]);
          return null;
        }

        return ptJson[errorMessage];
      } else {
        toast.error(ptJson.default_error_message);
      }
    }
  }
}
