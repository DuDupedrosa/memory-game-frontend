import MainHeader from "@/components/MainHeader";
import ProfileComponent from "./components/ProfileComponent";

export default function page() {
  return (
    <div className="min-h-screen w-full h-full bg-gray-900">
      <MainHeader />

      <ProfileComponent />
    </div>
  );
}
