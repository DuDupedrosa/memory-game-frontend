"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import CreateRoomComponent from "./CreateRoomForm";
import SignInRoomComponent from "./SignInRoomForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const steps = {
  SELECT_OPTION: 1,
  CREATE_ROOM: 2,
  SIGN_IN_ROOM: 3,
};

export const eyeIconStyle =
  "absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500";

export default function RoomComponent() {
  const [step, setStep] = useState<number>(steps.SELECT_OPTION);

  return (
    <div className="w-full  min-h-screen h-full bg-gray-900">
      <div className="min-h-screen flex flex-col justify-center items-center px-5 md:px-0">
        <Card className="w-full md:w-1/2 xl:w-[30%] min-h-[50vh] bg-gray-800 border-purple-800 shadow-none">
          <CardHeader className="">
            <CardTitle className="text-gray-50 text-2xl md:text-3xl font-semibold text-center mb-1">
              Welcome to memory game
            </CardTitle>
            <CardDescription className="text-gray-400 font-normal text-center text-base">
              Select a option to start play a game
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-5">
            <Tabs defaultValue="account">
              <TabsList className="w-full bg-gray-600">
                <TabsTrigger
                  value="account"
                  className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-gray-300 font-medium text-gray-50"
                >
                  Enter a room
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-gray-300 font-medium text-gray-50"
                >
                  Create new room
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
