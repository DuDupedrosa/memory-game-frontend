"use client";

import { apiService } from "@/app/apiService";
import { socket } from "@/app/socket";
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
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { eyeInputIconStyle, iconInputStyle } from "./RoomComponent";
import { LevelEnum } from "@/helpers/enum/levelEnum";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ptJson from "@/helpers/translation/pt.json";

const formSchema = z.object({
  password: z.string().min(3, { message: ptJson.room_password_min_length }),
  level: z.enum(
    [String(LevelEnum.EASY), String(LevelEnum.MEDIUM), String(LevelEnum.HARD)],
    {
      required_error: ptJson.required_field,
    }
  ),
});

export default function CreateRoomComponent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      level: String(LevelEnum.EASY),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userLocal = localStorage.getItem("user");
      if (!userLocal) return;
      const user = JSON.parse(userLocal);
      let payload = {
        password: values.password,
        level: Number(values.level),
      };
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
                name="level"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-400">
                      {ptJson.difficulty_level}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col min-[964px]:flex-row min-[964px]:items-center gap-5"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={String(LevelEnum.EASY)} />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-50 flex flex-col gap-1">
                            <span>{ptJson.easy}</span>
                            <span>{ptJson.difficulty_easy}</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={String(LevelEnum.MEDIUM)} />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-50 flex flex-col gap-1">
                            <span>{ptJson.medium}</span>
                            <span>{ptJson.difficulty_medium}</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={String(LevelEnum.HARD)} />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-50 flex flex-col gap-1">
                            <span>{ptJson.hard}</span>
                            <span>{ptJson.difficulty_hard}</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                      {ptJson.password}
                    </FormLabel>
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
                          className="border-gray-400 text-gray-50 px-10"
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
            {ptJson.submit}
          </Button>
        </form>
      </Form>
    </div>
  );
}
