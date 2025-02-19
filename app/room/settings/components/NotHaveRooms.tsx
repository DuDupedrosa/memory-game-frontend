import { Button } from "@/components/ui/button";
import ptJson from "@/helpers/translation/pt.json";
import { Plus } from "lucide-react";

export default function NotHaveRooms({
  createNewRoom,
}: {
  createNewRoom: () => void;
}) {
  return (
    <div className="w-full bg-gray-800 rounded-lg p-8 mt-5">
      <h3 className="text-center text-gray-50 text-xl md:text-2xl font-medium mb-2">
        {ptJson.not_have_rooms_title}
      </h3>
      <p className="text-base md:text-lg text-center text-gray-400">
        {ptJson.not_have_rooms_subtitle}
      </p>

      <div className="flex flex-col justify-center items-center">
        <Button
          onClick={() => createNewRoom()}
          className="min-w-[180px] mt-5 flex items-center gap-1"
        >
          <Plus size={20} />
          {ptJson.create_room}
        </Button>
      </div>
    </div>
  );
}
