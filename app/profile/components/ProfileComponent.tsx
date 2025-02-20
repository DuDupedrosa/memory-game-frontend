"use client";

import MainPageSubtitle from "@/components/MainPageSubtitle";
import MainPageTitle from "@/components/MainPageTitle";
import ptJson from "@/helpers/translation/pt.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicData from "./BasicData";
import { Card } from "@/components/ui/card";
import ChangePassword from "./ChangePassword";
import BreadCrumb from "@/components/BreadCrumb";
import { BreadCrumbType } from "@/types/breadCrumb";

export const iconInputStyle =
  "absolute  left-3 top-1/2 -translate-y-1/2 text-gray-500";

export const eyeInputIconStyle =
  "absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500";

const breadCrumbItems: BreadCrumbType[] = [
  {
    label: ptJson.profile,
    current: true,
    toPath: "/profile",
  },
];

export default function ProfileComponent() {
  return (
    <div className="px-5 md:px-10 mt-12 pb-12">
      <div className="w-full lg:w-1/2 lg:mx-auto">
        <BreadCrumb routes={breadCrumbItems} />

        {/* header */}
        <div>
          <div>
            <MainPageTitle text={ptJson.my_profile} />
            <MainPageSubtitle text={ptJson.choose_option_update_profile} />
          </div>
        </div>

        <Card className="bg-gray-800 border-none px-5 pb-5 pt-1 mt-8">
          <Tabs defaultValue="basicData" className="mt-5">
            <TabsList className="w-full bg-gray-600">
              <TabsTrigger
                value="basicData"
                className="flex-1 data-[state=active]:bg-gray-500 data-[state=active]:text-white font-medium text-gray-50"
              >
                {ptJson.personal_data}
              </TabsTrigger>
              <TabsTrigger
                value="newPassword"
                className="flex-1 data-[state=active]:bg-gray-500 data-[state=active]:text-white font-medium text-gray-50"
              >
                {ptJson.change_password}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basicData">
              <BasicData />
            </TabsContent>
            <TabsContent value="newPassword">
              <ChangePassword />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
