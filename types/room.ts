export type RoomDataType = {
  id: number;
  createdAt: Date;
  ownerId: string;
  guestId?: string;
  players: string[] | [];
  matchRandomNumber: number;
  level: number;
};

export type RoomToSettings = {
  id: number;
  level: number;
  password: string;
  lastAccess: string;
  createdAt: string;
};
