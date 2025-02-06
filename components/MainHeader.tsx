"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getUserLocal } from "@/helpers/getUserLoca";
import { Loader2 } from "lucide-react";
import { MdLogout } from "react-icons/md";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Logo from "@/assets/icons/memory-game-logo.svg";
import { socket } from "@/app/socket";

export default function MainHeader({ showLogo }: { showLogo?: boolean }) {
  const router = useRouter();
  const [nickName, setNickName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const { id } = useParams();

  function handleLogout() {
    if (pathname.includes("/room/")) {
      const user = getUserLocal();

      if (user && id) {
        socket.emit("requestUserLoggedOut", {
          playerId: user.id,
          roomId: Number(id),
        });
      }
    }

    localStorage.clear();
    router.push("/auth");

    toast.info("Você foi desconectado. Faça login novamente.", {
      duration: 3000,
    });
  }

  useEffect(() => {
    setLoading(true);
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`);
    const user = getUserLocal();
    setLoading(false);
    if (!user) return;
    setNickName(user.nickName);
    setLoading(false);
  }, []);

  return (
    <div className="w-full h-24 bg-gray-800 border-b-solid border-b-2 border-b-purple-800">
      <div className="flex items-center justify-between h-full px-5">
        {showLogo && (
          <div>
            <Image
              className="w-20 h-20 rounded"
              alt="memory-game-logo"
              src={Logo}
            />
          </div>
        )}

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-transparent border border-solid border-purple-600 flex items-center gap-2">
                {loading && <Loader2 className="animate-spin" />}

                {!loading && (
                  <>
                    <img src={avatar} className="w-7 h-7 rounded-full" alt="" />
                    {nickName && nickName.length ? nickName : "Configurações"}
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 mr-2 bg-gray-800 border-gray-400">
              <ul>
                <li
                  onClick={() => handleLogout()}
                  className="flex transition-all hover:bg-primary p-1 rounded items-center gap-2 cursor-pointer"
                >
                  <MdLogout className="text-xl text-gray-400" />
                  <span className="text-gray-50 text-sm font-normal block">
                    Encerrar sessão
                  </span>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
