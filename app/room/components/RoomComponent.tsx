"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateRoomComponent from "./CreateRoomForm";
import SignInRoomComponent from "./SignInRoomForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Logo from "@/assets/icons/memory-game-logo.svg";
import ptJson from "@/helpers/translation/pt.json";

export const eyeInputIconStyle =
  "absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500";

export const iconInputStyle =
  "absolute  left-3 top-1/2 -translate-y-1/2 text-gray-500";

export default function RoomComponent() {
  return (
    <div className="w-full py-5  min-h-screen h-full bg-gray-900">
      <div className="min-h-screen flex flex-col justify-center items-center px-5 md:px-0">
        <Card className="w-full md:w-1/2 xl:w-[30%] min-h-[50vh] bg-gray-800 border-purple-800 shadow-none">
          <CardHeader className="">
            <div className="ml-auto mr-auto mb-5">
              <Image
                src={Logo}
                className="w-28 h-28 rounded"
                alt="memory-game-log"
              />
            </div>
            <CardTitle className="text-gray-50 text-2xl md:text-3xl font-semibold text-center mb-1">
              {ptJson.welcome_message_play_game}
            </CardTitle>
            <CardDescription className="text-gray-400 font-normal text-center text-base">
              {ptJson.select_option_to_play_game}
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-5">
            <Tabs defaultValue="account">
              <TabsList className="w-full bg-gray-600">
                <TabsTrigger
                  value="account"
                  className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-gray-300 font-medium text-gray-50"
                >
                  {ptJson.enter_room}
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-gray-300 font-medium text-gray-50"
                >
                  {ptJson.create_room}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <SignInRoomComponent />
              </TabsContent>
              <TabsContent value="password">
                <CreateRoomComponent />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
