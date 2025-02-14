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
import { useEffect, useState } from "react";
import { getUserLocal } from "@/helpers/getUserLoca";
import { Eye, EyeOff, Key, Loader2, LockKeyholeOpen } from "lucide-react";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { eyeInputIconStyle, iconInputStyle } from "./RoomComponent";
import { getRoomLevelText } from "@/helpers/getRoomLevel";
import { copyToClipBoard } from "@/helpers/copyToClipBoard";
import { FaCircleInfo } from "react-icons/fa6";
import ptJson from "@/helpers/translation/pt.json";

const formSchema = z.object({
  id: z.number().min(1, { message: ptJson.required_field }),
  password: z.string().min(1, { message: ptJson.required_field }),
});

export default function SignInRoomComponent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<{ id: number; level: number }[] | []>([]);

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

  useEffect(() => {
    const fetchRoomsIds = async () => {
      try {
        const { data } = await apiService.get("room/owner-access-recent");
        setRooms(data.content);
      } catch (err) {}
    };

    fetchRoomsIds();
  }, []);

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
                      {ptJson.room_id}
                    </FormLabel>
                    <FormControl>
                      <div className="w-full relative">
                        <LockKeyholeOpen className={iconInputStyle} />
                        <Input
                          className="border-gray-400 text-gray-50 pl-10"
                          type="number"
                          id="id"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
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

      {rooms && rooms.length > 0 && (
        <div className="mt-5">
          <span className="block text-base font-medium text-gray-50">
            {ptJson.my_recent_rooms}:
          </span>
          <span className="flex items-center my-1 gap-2">
            <FaCircleInfo className="text-xs text-blue-600" />
            <span className="text-gray-400 text-xs">
              {ptJson.click_to_copy}
            </span>
          </span>
          <ul className="flex flex-col gap-3 mt-3">
            {rooms.map((room, i) => {
              return (
                <li
                  onClick={() => copyToClipBoard(room.id, ptJson.id_copied)}
                  key={i}
                  className="flex items-center cursor-pointer gap-2 rounded p-1 hover:bg-gray-700"
                >
                  <span className="w-2 h-2 bg-green-600 rounded-full block"></span>
                  <span className="text-base text-gray-400 font-bold flex items-center">
                    {ptJson.room}:{" "}
                    <span className="ml-2 text-primary">{room.id}</span>{" "}
                    <span className="rounded ml-5 block text-sm w-[45px] p-1 bg-gray-600 text-gray-400">
                      {getRoomLevelText(room.level)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
