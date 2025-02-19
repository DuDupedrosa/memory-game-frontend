"use client";

import { apiService } from "@/app/apiService";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { copyToClipBoard } from "@/helpers/copyToClipBoard";
import { getRoomLevelText } from "@/helpers/getRoomLevel";
import { LogIn, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { format } from "date-fns";
import ptJson from "@/helpers/translation/pt.json";
import { DialogAdd } from "./DialogAdd";
import DialogEdit from "./DialogEdit";
import { RoomToSettings } from "@/types/room";
import DialogDelete from "./DialogDelete";
import { useRouter } from "next/navigation";
import NotHaveRooms from "./NotHaveRooms";

export const eyeInputIconStyle =
  "absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500";

export const iconInputStyle =
  "absolute  left-3 top-1/2 -translate-y-1/2 text-gray-500";

function RoomIdRow({ id }: { id: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="block text-xl text-gray-50">{ptJson.room_id}:</span>
      <span className="text-xl font-semibold text-gray-400">{id}</span>
      <div className="p-1 cursor-pointer" onClick={() => copyToClipBoard(id)}>
        <FaCopy className="text-primary text-xl" />
      </div>
    </div>
  );
}

function RoomDefaultRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="block text-gray-50 text-base">{label}:</span>
      <span className="block text-gray-400 font-semibold">{value}</span>
    </div>
  );
}

function RoomPasswordRow({ password }: { password: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="block text-gray-50 text-base">{ptJson.password}:</span>
      <span className="block text-gray-400 font-semibold">******</span>
      <div
        className="p-1 cursor-pointer"
        onClick={() => copyToClipBoard(password)}
      >
        <FaCopy className="text-primary text-xl" />
      </div>
    </div>
  );
}

export default function SettingsComponent() {
  const [rooms, setRooms] = useState<RoomToSettings[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialogAddRoom, setOpenDialogAddRoom] = useState<boolean>(false);
  const [openDialogEditRoom, setOpenDialogEditRoom] = useState<boolean>(false);
  const [roomToEdit, setRoomToEdit] = useState<{
    id: number;
    level: number;
  } | null>(null);
  const [openDialogDeleteRoom, setOpenDialogDeleteRoom] =
    useState<boolean>(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState<number>(0);
  const router = useRouter();
  const [userHasRegisterRooms, setUserHasRegisterRooms] =
    useState<boolean>(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data } = await apiService.get("room/get-all");
      setRooms(data.content);

      if (data.content && data.content.length > 0) {
        setUserHasRegisterRooms(true);
      }
    } catch (err) {}
    setLoading(false);
  };

  async function handleSuccessAddRoom() {
    setOpenDialogAddRoom(false);
    await fetchRooms();
  }

  async function handleSuccessEditRoom() {
    setOpenDialogEditRoom(false);
    await fetchRooms();
  }

  function handleSuccessDeleteRoom() {
    setRoomIdToDelete(0);
    setOpenDialogDeleteRoom(false);
  }

  function handleEditRoom(room: RoomToSettings) {
    setRoomToEdit({
      id: room.id,
      level: room.level,
    });
    setOpenDialogEditRoom(true);
  }

  function handleDeleteRoom(id: number) {
    setRoomIdToDelete(id);
    setOpenDialogDeleteRoom(true);
  }

  useEffect(() => {
    if (!rooms || rooms.length === 0) {
      fetchRooms();
    }
  }, []);
  return (
    <div className="px-5 md:px-10 mt-12 pb-12">
      <div className="w-full lg:w-1/2 lg:mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
          <div>
            <h1 className="text-3xl font-medium text-gray-50 mb-2">
              {ptJson.my_rooms}
            </h1>
            <h2 className="block text-lg font-normal text-gray-400">
              {ptJson.my_rooms_subtitle}
            </h2>
          </div>

          {!loading && userHasRegisterRooms && (
            <div className="flex flex-col gap-5">
              <Button
                className="flex-1 min-w-[180px] flex items-center gap-1"
                onClick={() => setOpenDialogAddRoom(true)}
              >
                <Plus size={20} />

                {ptJson.create_room}
              </Button>
              <Button
                className="bg-gray-600 flex-1  hover:bg-gray-700 transition-all flex items-center gap-2"
                onClick={() => router.push("/room")}
              >
                <LogIn size={20} />
                {ptJson.join_room}
              </Button>
            </div>
          )}
        </div>

        {loading && <PageLoader />}

        {!loading && !userHasRegisterRooms && (
          <NotHaveRooms createNewRoom={() => setOpenDialogAddRoom(true)} />
        )}

        {!loading && userHasRegisterRooms && (
          <div className="bg-gray-800 rounded-lg p-5 pt-0 mt-5">
            <ul>
              {rooms.map((room, i) => {
                return (
                  <li
                    key={i}
                    className="border-b relative border-b-gray-400 py-5"
                  >
                    <div className="flex flex-col gap-3">
                      <RoomIdRow id={room.id} />
                      <RoomDefaultRow
                        value={getRoomLevelText(room.level)}
                        label={ptJson.difficulty_level}
                      />
                      <RoomDefaultRow
                        value={format(
                          new Date(room.createdAt),
                          "dd/MM/yyyy - HH:mm' H'"
                        )}
                        label={ptJson.created_at}
                      />
                      <RoomDefaultRow
                        value={format(
                          new Date(room.lastAccess),
                          "dd/MM/yyyy - HH:mm' H'"
                        )}
                        label={ptJson.last_access}
                      />

                      <RoomPasswordRow password={room.password} />
                    </div>

                    {/* actions buttons */}
                    <div className="flex items-center gap-3 mt-3 sm:mt-0 sm:absolute sm:top-5 right-0">
                      <Button
                        onClick={() => handleEditRoom(room)}
                        className="bg-green-600 w-10 h-10 hover:bg-green-800"
                      >
                        <Pencil className="text-gray-50" size={22} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="bg-red-600 w-10 h-10 hover:bg-red-800"
                      >
                        <Trash2 className="text-gray-50" size={22} />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <DialogAdd
        onClose={() => setOpenDialogAddRoom(false)}
        onSuccess={() => handleSuccessAddRoom()}
        open={openDialogAddRoom}
      />

      <DialogEdit
        dataToEdit={roomToEdit}
        onClose={() => setOpenDialogEditRoom(false)}
        onSuccess={() => handleSuccessEditRoom()}
        open={openDialogEditRoom}
      />

      <DialogDelete
        onClose={() => setOpenDialogDeleteRoom(false)}
        onSuccess={() => handleSuccessDeleteRoom()}
        open={openDialogDeleteRoom}
        id={roomIdToDelete}
      />
    </div>
  );
}
