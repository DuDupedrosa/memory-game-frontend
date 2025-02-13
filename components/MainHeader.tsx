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
import DialogConfirmExitRoom from "@/app/room/[id]/components/DialogConfirmExitRoom";

export default function MainHeader({
  showLogo,
  isGameBoard,
}: {
  showLogo?: boolean;
  isGameBoard?: boolean;
}) {
  const router = useRouter();
  const [nickName, setNickName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const { id } = useParams();
  const [dialogConfirmExitRoom, setDialogConfirmExitRoom] =
    useState<boolean>(false);
  const [dialogIsLoggedOut, setDialogIsLoggedOut] = useState<boolean>(false);

  function handleLogout() {
    if (!isGameBoard) {
      localStorage.clear();
      router.push("/auth");

      toast.info("Você foi desconectado. Faça login novamente.", {
        duration: 3000,
      });
    } else {
      setDialogIsLoggedOut(true);
      setDialogConfirmExitRoom(true);
    }
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
    <div className="w-full h-28 sm:h-24 bg-gray-800 border-b-solid border-b-2 border-b-purple-800">
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

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div>
            {isGameBoard && (
              <div>
                <Button
                  onClick={() => {
                    setDialogConfirmExitRoom(true);
                    setDialogIsLoggedOut(false);
                  }}
                  className="bg-red-600 hover:bg-red-800 transition-all text-gray-50"
                >
                  Sair do jogo
                </Button>
              </div>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-transparent border border-solid border-purple-600 flex items-center gap-2">
                {loading && <Loader2 className="animate-spin" />}

                {!loading && (
                  <>
                    {avatar && (
                      <img
                        src={avatar}
                        className="w-7 h-7 rounded-full"
                        alt=""
                      />
                    )}
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

      <DialogConfirmExitRoom
        onClose={() => {
          setDialogConfirmExitRoom(false);
          setDialogIsLoggedOut(false);
        }}
        open={dialogConfirmExitRoom}
        loggedOut={dialogIsLoggedOut}
      />
    </div>
  );
}
