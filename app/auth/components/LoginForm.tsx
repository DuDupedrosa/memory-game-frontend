"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiService } from "@/app/apiService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Key, Loader2, Mail } from "lucide-react";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import {
  callActionNav,
  eyeInputIconStyle,
  iconInputStyle,
} from "./AuthComponent";
import ptJson from "@/helpers/translation/pt.json";
import { toast } from "sonner";
import AlertErro from "@/components/AlertErro";
import { DefaultAlertErroType } from "@/types/alert";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: ptJson.invalid_format_email })
    .min(1, { message: ptJson.required_field }),
  password: z.string().min(1, { message: ptJson.required_field }),
});

export default function LoginForm({
  goToRegister,
}: {
  goToRegister: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [alert, setAlert] = useState<DefaultAlertErroType>({
    open: false,
    message: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setAlert({
        open: false,
        message: "",
      });
      setLoading(true);
      const payload = { ...values };
      const { data } = await apiService.post("user/sign-in", payload);
      const { user, token } = data.content;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      router.push("/room");
    } catch (err) {
      const errMessage = handleRequestApiErro(err, true);

      if (errMessage) {
        setAlert({
          open: true,
          message: errMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unauthorized = localStorage.getItem("unauthorized");

    if (unauthorized && unauthorized === "true") {
      toast.error(ptJson.unauthorized_required_login);
      window.localStorage.removeItem("unauthorized");
    }
  }, []);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="flex flex-col gap-5">
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">{ptJson.email}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Mail className={iconInputStyle} />
                        <Input id="email" className="pl-10" {...field} />
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">{ptJson.password}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        {!showPassword && (
                          <Eye
                            onClick={() => setShowPassword(!showPassword)}
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        {showPassword && (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        <Key className={iconInputStyle} />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pr-10 pl-10"
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
            disabled={loading}
            className="mt-5 w-full min-w-[220px]"
            type="submit"
          >
            {loading && <Loader2 className="animate-spin" />}
            {ptJson.login}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center mt-16">
        <span onClick={() => goToRegister()} className={`${callActionNav}`}>
          {ptJson.no_account}
          <span className="font-bold">{ptJson.sign_up}</span>
        </span>
      </div>
    </div>
  );
}
