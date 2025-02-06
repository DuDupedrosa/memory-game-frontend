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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { callActionNav, eyeIconStyle } from "./AuthComponent";
import ptJson from "@/helpers/translation/pt.json";
import { toast } from "sonner";

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const payload = { ...values };
      const { data } = await apiService.post("user/sign-in", payload);
      const { user, token } = data.content;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      router.push("/room");
    } catch (err) {
      handleRequestApiErro(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    const unauthorized = localStorage.getItem("unauthorized");

    if (unauthorized && unauthorized === "true") {
      toast.error("Unauthorized! Required Login.");
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
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input id="email" {...field} />
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
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        {!showPassword && (
                          <Eye
                            onClick={() => setShowPassword(!showPassword)}
                            className={`${eyeIconStyle}`}
                          />
                        )}
                        {showPassword && (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                            className={`${eyeIconStyle}`}
                          />
                        )}
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
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
            Log In
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center mt-16">
        <span onClick={() => goToRegister()} className={`${callActionNav}`}>
          Don't have an account?
          <span className="font-bold">Sign Up</span>
        </span>
      </div>
    </div>
  );
}
