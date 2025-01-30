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

const steps = {
  SELECT_OPTION: 1,
  CREATE_ROOM: 2,
  SIGN_IN_ROOM: 3,
};

export default function RoomComponent() {
  const [step, setStep] = useState<number>(steps.SELECT_OPTION);

  return (
    <div className="w-full  min-h-screen h-full flex flex-col justify-center items-center">
      {step === steps.SELECT_OPTION && (
        <Card className="max-w-lg">
          <CardHeader className="">
            <CardTitle>Entrar/Criar sala</CardTitle>
            <CardDescription>
              Selecione uma opção para acessar uma sala
            </CardDescription>
          </CardHeader>

          <CardContent className="min-w-[420px]">
            <div className="flex flex-col gap-5">
              <Button onClick={() => setStep(steps.CREATE_ROOM)}>
                Criar sala
              </Button>
              <Button onClick={() => setStep(steps.SIGN_IN_ROOM)}>
                Entrar em uma sala
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === steps.CREATE_ROOM && (
        <CreateRoomComponent signInRoom={() => setStep(steps.SIGN_IN_ROOM)} />
      )}

      {step === steps.SIGN_IN_ROOM && (
        <SignInRoomComponent createRoom={() => setStep(steps.CREATE_ROOM)} />
      )}
    </div>
  );
}
