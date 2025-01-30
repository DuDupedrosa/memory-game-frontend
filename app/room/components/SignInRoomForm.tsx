"use client";

import { apiService } from "@/app/apiService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect } from "react";
import { getUserLocal } from "@/helpers/getUserLoca";

const formSchema = z.object({
  id: z.number().min(1, { message: "Campo obrigatório" }),
  password: z.string().min(1, { message: "Campo obrigatório" }),
});

export default function SignInRoomComponent({
  createRoom,
}: {
  createRoom: () => void;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      //router.push(`/room/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader className="">
        <CardTitle>Entrar em uma sala</CardTitle>
        <CardDescription>
          Preencha o campo abaixo para entrar em uma sala
        </CardDescription>
      </CardHeader>

      <CardContent className="min-w-[420px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="id">Id</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          id="id"
                          placeholder="id"
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
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Senha</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-1 flex justify-end">
              <span
                onClick={() => createRoom()}
                className="text-sm text-primary underline max-w-max cursor-pointer"
              >
                Criar nova sala
              </span>
            </div>

            <Button className="mt-5" type="submit">
              Entrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
