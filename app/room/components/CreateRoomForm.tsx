"use client";

import { apiService } from "@/app/apiService";
import { socket } from "@/app/socket";
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

const formSchema = z.object({
  password: z.string().min(1, { message: "Campo obrigatório" }),
});

export default function CreateRoomComponent({
  signInRoom,
}: {
  signInRoom: () => void;
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
      const userLocal = localStorage.getItem("user");
      if (!userLocal) return;
      const user = JSON.parse(userLocal);
      const payload = { ...values };
      const { data } = await apiService.post("room", payload);
      const { id } = data.content;

      socket.emit("createRoom", {
        roomId: id,
        password: values.password,
        ownerId: user.id,
      });

      socket.on("roomCreated", (data: { roomId: string }) => {
        // Redireciona o jogador para a sala recém-criada
        router.push(`/room/${data.roomId}`);
      });

      //router.push(`/room/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader className="">
        <CardTitle>Criar sala</CardTitle>
        <CardDescription>
          Preencha o campo abaixo para criar uma sala
        </CardDescription>
      </CardHeader>

      <CardContent className="min-w-[420px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-5">
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
                onClick={() => signInRoom()}
                className="text-sm text-primary underline max-w-max cursor-pointer"
              >
                Entrar em uma sala
              </span>
            </div>

            <Button className="mt-5" type="submit">
              Criar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
