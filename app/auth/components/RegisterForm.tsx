"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { apiService } from "@/app/apiService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { Eye, EyeOff, Gamepad2, Key, Loader2, Mail } from "lucide-react";
import {
  callActionNav,
  eyeInputIconStyle,
  iconInputStyle,
} from "./AuthComponent";
import ptJson from "@/helpers/translation/pt.json";

const formSchema = z.object({
  nickName: z.string().min(1, { message: ptJson.required_field }),
  email: z
    .string()
    .email({ message: ptJson.invalid_format_email })
    .min(1, { message: ptJson.required_field }),
  password: z.string().min(6, { message: ptJson.password_min_length }),
});

export default function RegisterForm({ goToLogin }: { goToLogin: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const payload = { ...values };
      const { data } = await apiService.post("user", payload);
      const { user, token } = data.content;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      router.push("/room");
    } catch (err) {
      handleRequestApiErro(err);
    }
    setLoading(false);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div>
              <FormField
                control={form.control}
                name="nickName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="nickName">{ptJson.nickname}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Gamepad2 className={iconInputStyle} />
                        <Input id="nickName" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {ptJson.nickname_description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">{ptJson.email}</FormLabel>
                    <FormControl>
                      <div className="w-full relative">
                        <Mail className={iconInputStyle} />
                        <Input id="email" {...field} className="pl-10" />
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

          <Button
            disabled={loading}
            className="mt-5 w-full min-w-[220px]"
            type="submit"
          >
            {loading && <Loader2 className="animate-spin" />}
            {ptJson.submit}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center mt-16">
        <span onClick={() => goToLogin()} className={`${callActionNav}`}>
          {ptJson.already_have_account}
          <span className="font-bold">{ptJson.sign_in}</span>
        </span>
      </div>
    </div>
  );
}
