"use client";

import { apiService } from "@/app/apiService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { socket } from "@/app/socket";
import { useState } from "react";
import { getUserLocal } from "@/helpers/getUserLoca";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { eyeIconStyle } from "./RoomComponent";

const formSchema = z.object({
  id: z.number().min(1, { message: "Campo obrigatório" }),
  password: z.string().min(1, { message: "Campo obrigatório" }),
});

export default function SignInRoomComponent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const user = getUserLocal();
      if (!user) return;
      const payload = { ...values };
      const { data } = await apiService.post("room/sign-in", payload);
      const { id } = data.content;

      socket.emit("joinRoom", {
        roomId: id,
        password: values.password,
        playerId: user.id,
      });

      socket.on("playerJoined", (data: { playerId: string }) => {
        // Redireciona o jogador para a sala recém-criada
        if (data.playerId === user.id) {
          router.push(`/room/${id}`);
        }
      });
    } catch (err) {
      handleRequestApiErro(err);
    }
    setLoading(false);
  }

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-5">
            <div>
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400" htmlFor="id">
                      Room Id
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-400 text-gray-50"
                        type="number"
                        id="id"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
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
                    <FormLabel className="text-gray-400" htmlFor="id">
                      Password
                    </FormLabel>
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
                          className="border-gray-400 text-gray-50 pr-10"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button disabled={loading} className="mt-5 w-full" type="submit">
            {loading && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
