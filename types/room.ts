export type RoomDataType = {
  id: number;
  createdAt: Date;
  ownerId: string;
  guestId?: string;
  players: string[] | [];
  matchRandomNumber: number;
};
