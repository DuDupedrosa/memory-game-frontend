import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ptJson from "@/helpers/translation/pt.json";
import { Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { z } from "zod";
import { LevelEnum } from "@/helpers/enum/levelEnum";
import { apiService } from "@/app/apiService";
import { handleRequestApiErro } from "@/helpers/handleRequestApiErro";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { eyeInputIconStyle, iconInputStyle } from "./SettingsComponent";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function NewPassword({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formSchema = z.object({
    password: z.string().min(3, { message: ptJson.room_password_min_length }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  function resetForm() {
    form.setValue("password", "");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      let payload = {
        password: values.password,
      };
      await apiService.patch("room/change-password", payload);
      toast.success(ptJson.update_room_password_success);
      onSuccess();
      resetForm();
    } catch (err) {
      handleRequestApiErro(err);
    }
    setLoading(false);
  }

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-gray-400"
                      htmlFor="id"
                    ></FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        {!showPassword && (
                          <Eye
                            onClick={() => setShowPassword(!showPassword)}
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        {showPassword && (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                            className={`${eyeInputIconStyle}`}
                          />
                        )}
                        <Key className={iconInputStyle} />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="border-gray-400 text-gray-50 px-10"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 mt-12">
            <Button
              type="submit"
              disabled={loading}
              className="text-green-50 w-full"
            >
              {loading && <Loader2 className="animate-spin" />}
              {ptJson.save_new_password}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="bg-gray-600 w-full hover:bg-gray-700 text-gray-50"
            >
              {ptJson.cancel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function NewLevel({
  onSuccess,
  onClose,
  currentLevel,
}: {
  onSuccess: () => void;
  onClose: () => void;
  currentLevel: number;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [valueLoading, setValueLoading] = useState<boolean>(true);

  const formSchema = z.object({
    level: z.enum(
      [
        String(LevelEnum.EASY),
        String(LevelEnum.MEDIUM),
        String(LevelEnum.HARD),
      ],
      {
        required_error: ptJson.required_field,
      }
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: String(LevelEnum.EASY),
    },
  });

  function resetForm() {
    form.setValue("level", String(LevelEnum.EASY));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      let payload = {
        level: Number(values.level),
      };
      await apiService.patch("room/change-level", payload);
      toast.success(ptJson.update_level_success);
      onSuccess();
      resetForm();
    } catch (err) {
      handleRequestApiErro(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (currentLevel) {
      form.setValue("level", String(currentLevel));
      setValueLoading(false);
    }
  }, [currentLevel]);

  return (
    <div className="mt-5">
      {!valueLoading && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-gray-400"></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row sm:items-center gap-5"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={String(LevelEnum.EASY)} />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-50 flex flex-col gap-1">
                              <span>{ptJson.easy}</span>
                              <span>{ptJson.difficulty_easy}</span>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value={String(LevelEnum.MEDIUM)}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-50 flex flex-col gap-1">
                              <span>{ptJson.medium}</span>
                              <span>{ptJson.difficulty_medium}</span>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={String(LevelEnum.HARD)} />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-50 flex flex-col gap-1">
                              <span>{ptJson.hard}</span>
                              <span>{ptJson.difficulty_hard}</span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-5 mt-12">
              <Button
                type="submit"
                disabled={loading}
                className="text-green-50 w-full"
              >
                {loading && <Loader2 className="animate-spin" />}
                {ptJson.save_new_level}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="bg-gray-600 w-full hover:bg-gray-700 text-gray-50"
              >
                {ptJson.cancel}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

interface DataToEdit {
  id: number;
  level: number;
}
export default function DialogEdit({
  open,
  onClose,
  onSuccess,
  dataToEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataToEdit: DataToEdit | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <div>
      <Dialog open={isOpen}>
        {dataToEdit && (
          <DialogContent className="bg-gray-800 w-[320px] sm:w-[480px] border-gray-400">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-50 font-medium">
                {ptJson.edit_room}: {dataToEdit.id}
              </DialogTitle>
              <DialogDescription>
                <p className="text-gray-400 text-base">
                  {ptJson.edit_room_subtitle}
                </p>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="level" className="mt-5">
              <TabsList className="w-full bg-gray-600">
                <TabsTrigger
                  value="level"
                  className="flex-1 data-[state=active]:bg-gray-500 data-[state=active]:text-white font-medium text-gray-50"
                >
                  {ptJson.change_level}
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex-1 data-[state=active]:bg-gray-500 data-[state=active]:text-white font-medium text-gray-50"
                >
                  {ptJson.new_password}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="level">
                <NewLevel
                  currentLevel={dataToEdit.level}
                  onSuccess={() => onSuccess()}
                  onClose={() => onClose()}
                />
              </TabsContent>
              <TabsContent value="password">
                <NewPassword
                  onSuccess={() => onSuccess()}
                  onClose={() => onClose()}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
