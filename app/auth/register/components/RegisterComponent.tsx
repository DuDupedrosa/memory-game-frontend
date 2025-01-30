import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "./RegisterForm";

export default function RegisterComponent() {
  return (
    <div className="w-full  min-h-screen h-full flex flex-col justify-center items-center">
      <Card className="max-w-lg">
        <CardHeader className="">
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent className="min-w-[420px]">
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
