import { z } from "zod";
import ptJson from "@/helpers/translation/pt.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { apiService } from "@/app/apiService";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gamepad2, Loader2, Mail } from "lucide-react";
import { UserDataType } from "@/types/user";
import PageLoader from "@/components/PageLoader";
import { iconInputStyle } from "./ProfileComponent";
import AlertErro from "@/components/AlertErro";
import { DefaultAlertErroType } from "@/types/alert";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: ptJson.invalid_format_email })
    .min(1, { message: ptJson.required_field }),
  nickName: z.string().min(1, { message: ptJson.required_field }),
});

export default function BasicData() {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<DefaultAlertErroType>({
    open: false,
    message: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: "",
      email: "",
    },
  });

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await apiService.get("user");
      setUser(data.content);
    } catch (err) {}
    setLoading(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setAlert({
        open: false,
        message: "",
      });
      setSubmitLoading(true);
      const payload = { ...values };
      await apiService.put("user", payload);
      toast.success(ptJson.updated_info_success);
      await fetchUser();
    } catch (err) {
      const errMessage = handleRequestApiErro(err, true);

      if (errMessage) {
        setAlert({
          open: true,
          message: errMessage,
        });
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email);
      form.setValue("nickName", user.nickName);
    }
  }, [user]);

  return (
    <div className="mt-8">
      {loading && <PageLoader />}
      {!loading && user && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="relative">
                <FormField
                  control={form.control}
                  name="nickName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="nickName" className="text-gray-400">
                        {ptJson.nickname}
                      </FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Gamepad2 className={iconInputStyle} />
                          <Input
                            id="nickName"
                            {...field}
                            className="pl-10 text-gray-50 border-gray-400"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-300">
                        {ptJson.nickname_description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="relative">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email" className="text-gray-400">
                        {ptJson.email}
                      </FormLabel>
                      <FormControl>
                        <div className="w-full relative">
                          <Mail className={iconInputStyle} />
                          <Input
                            id="email"
                            {...field}
                            className="pl-10 text-gray-50 border-gray-400"
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <AlertErro
              open={alert.open}
              message={alert.message}
              onClose={() => setAlert({ open: false, message: "" })}
            />

            <Button
              disabled={submitLoading}
              className="mt-8 sm:w-1/2"
              type="submit"
            >
              {submitLoading && <Loader2 className="animate-spin" />}
              {ptJson.update_info}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
