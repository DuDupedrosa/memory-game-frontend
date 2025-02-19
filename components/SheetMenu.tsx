import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import {
  FaBars,
  FaGamepad,
  FaGear,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { UserDataType } from "@/types/user";
import { getUserLocal } from "@/helpers/getUserLoca";
import ptJson from "@/helpers/translation/pt.json";

const menuItems = [
  { href: "/room", icon: FaGamepad, label: ptJson.play },
  { href: "/room/settings", icon: FaGear, label: ptJson.rooms },
  { href: "/profile", icon: FaUser, label: ptJson.profile },
];

export default function SheetMenu({ logout }: { logout: () => void }) {
  const [user, setUser] = useState<UserDataType | null>(null);

  useEffect(() => {
    const userLocal = getUserLocal();
    if (userLocal) {
      setUser(userLocal);
    }
  }, []);
  return (
    <Sheet>
      <SheetTrigger title="Abrir menu" aria-label="Abrir menu">
        <FaBars className="text-4xl text-gray-50" />
      </SheetTrigger>
      <SheetContent className="bg-gray-800 flex flex-col h-full" side="left">
        <SheetHeader className="border-b border-gray-400 pb-5">
          <SheetTitle className="text-gray-50 text-start text-xl font-medium">
            {user ? `${ptJson.hello}, ${user.nickName}` : ptJson.hello_player}
          </SheetTitle>
          <SheetDescription className="text-gray-400 text-start text-sm">
            {ptJson.menu_description}
          </SheetDescription>
        </SheetHeader>

        <nav role="navigation" className="mt-2 flex flex-col gap-3">
          {menuItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded p-2 transition-all hover:bg-gray-600"
            >
              <Icon className="text-gray-400 text-xl" />
              <span className="text-lg font-medium text-gray-300">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Botão de Logout no final */}
        <div className="mt-auto border-t border-gray-600 pt-5">
          <Button
            className="flex bg-transparent bg-gray-600 hover:bg-gray-700 items-center gap-3 w-full p-2 rounded transition-all"
            onClick={() => logout()}
          >
            <FaRightFromBracket className="text-gray-50 text-xl" />
            <span className="text-gray-50 text-lg font-medium">
              {ptJson.logout}
            </span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
