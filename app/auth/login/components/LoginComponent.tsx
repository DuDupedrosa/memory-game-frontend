import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./LoginForm";

export default function LoginComponent() {
  return (
    <div className="w-full  min-h-screen h-full flex flex-col justify-center items-center">
      <Card className="max-w-lg">
        <CardHeader className="">
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para entrar na sua conta
          </CardDescription>
        </CardHeader>

        <CardContent className="min-w-[420px]">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
