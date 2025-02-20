import { z } from "zod";
import ptJson from "@/helpers/translation/pt.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { apiService } from "@/app/apiService";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { eyeInputIconStyle, iconInputStyle } from "./ProfileComponent";
import { Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DefaultAlertErroType } from "@/types/alert";
import AlertErro from "@/components/AlertErro";

const formSchema = z.object({
  newPassword: z.string().min(6, { message: ptJson.password_min_length }),
  currentPassword: z.string().min(6, { message: ptJson.password_min_length }),
});

export default function ChangePassword() {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const router = useRouter();
  const [alert, setAlert] = useState<DefaultAlertErroType>({
    open: false,
    message: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  function resetForm() {
    form.setValue("newPassword", "");
    form.setValue("currentPassword", "");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setAlert({
        open: false,
        message: "",
      });
      setSubmitLoading(true);
      const payload = { ...values };
      await apiService.patch("user/change-password", payload);
      toast.success(ptJson.updated_password_success);
      window.localStorage.clear();
      router.push("/auth");
    } catch (err) {
      const errMessage = handleRequestApiErro(err, true);

      if (errMessage) {
        setAlert({
          open: true,
          message: errMessage,
        });
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  useEffect(() => {
    resetForm();
  }, []);

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="relative">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password" className="text-gray-400">
                      {ptJson.current_password}
                    </FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        {!showCurrentPassword && (
                          <Eye
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        {showCurrentPassword && (
                          <EyeOff
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        <Key className={iconInputStyle} />
                        <Input
                          id="password"
                          type={showCurrentPassword ? "text" : "password"}
                          {...field}
                          className="pr-10 pl-10 text-gray-50"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="relative">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="newPassword" className="text-gray-400">
                      {ptJson.new_password}
                    </FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        {!showNewPassword && (
                          <Eye
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        {showNewPassword && (
                          <EyeOff
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        <Key className={iconInputStyle} />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          {...field}
                          className="pr-10 pl-10 text-gray-50"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <AlertErro
            open={alert.open}
            message={alert.message}
            onClose={() => setAlert({ open: false, message: "" })}
          />

          <Button
            disabled={submitLoading}
            className="mt-8 sm:w-1/2"
            type="submit"
          >
            {submitLoading && <Loader2 className="animate-spin" />}
            {ptJson.save_new_password}
          </Button>
        </form>
      </Form>
    </div>
  );
}
