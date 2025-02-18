import MainHeader from "@/components/MainHeader";
import SettingsComponent from "./components/SettingsComponent";

export default function page() {
  return (
    <div className="min-h-screen w-full h-full bg-gray-900">
      <MainHeader />

      <SettingsComponent />
    </div>
  );
}
