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
import { UserDataType } from "@/types/user";
import PageLoader from "@/components/PageLoader";
import { eyeInputIconStyle, iconInputStyle } from "./ProfileComponent";
import { Eye, EyeOff, Key, Loader2 } from "lucide-react";

const formSchema = z.object({
  newPassword: z.string().min(6, { message: ptJson.password_min_length }),
  currentPassword: z.string().min(6, { message: ptJson.password_min_length }),
});

export default function ChangePassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

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
    setSubmitLoading(true);
    try {
      const payload = { ...values };
      await apiService.patch("user/change-password", payload);
      toast.success("Senha alterada com sucesso");
      resetForm();
    } catch (err) {
      handleRequestApiErro(err);
    }
    setSubmitLoading(false);
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
                      Senha atual
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
                    <FormLabel htmlFor="password" className="text-gray-400">
                      Nova senha
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
                          id="password"
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

          <Button
            disabled={submitLoading}
            className="mt-8 sm:w-1/2"
            type="submit"
          >
            {submitLoading && <Loader2 className="animate-spin" />}
            Salvar nova senha
          </Button>
        </form>
      </Form>
    </div>
  );
}
