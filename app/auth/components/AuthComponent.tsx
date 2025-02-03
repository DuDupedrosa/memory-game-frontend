import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const componentStep = {
  SIGN_IN: 1,
  REGISTER: 2,
};

export const eyeIconStyle =
  "absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500";

export const callActionNav = `flex max-w-max p-1 rounded hover:bg-violet-300 cursor-pointer gap-1 text-sm text-gray-900 font-normal transition-all underline`;

export default function AuthComponent() {
  const [step, setStep] = useState<number>(componentStep.SIGN_IN);

  return (
    <div className="w-full min-h-screen h-full bg-gray-100">
      <div className="flex">
        <div className="h-full ml-auto mr-auto min-h-screen flex flex-col justify-center w-full items-end lg:w-[40%] px-5 lg:px-0 lg:pr-2">
          <Card className="h-full min-h-[95vh] lg:min-h-[98vh] w-full px-5 md:px-12 flex flex-col justify-center">
            <div>
              <CardHeader className="">
                <CardTitle className="text-3xl text-gray-900 font-semibold text-center mb-1">
                  {step === componentStep.SIGN_IN
                    ? "Welcome back!"
                    : "Create account!"}
                </CardTitle>
                <CardDescription className="text-center text-sm font-normal text-gray-900">
                  {step === componentStep.REGISTER
                    ? "Please enter your credentials"
                    : "Please fill the form to register in our platform"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {step === componentStep.SIGN_IN && (
                  <LoginForm
                    goToRegister={() => setStep(componentStep.REGISTER)}
                  />
                )}

                {step === componentStep.REGISTER && (
                  <RegisterForm
                    goToLogin={() => setStep(componentStep.SIGN_IN)}
                  />
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
