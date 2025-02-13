import { LevelEnum } from "./enum/levelEnum";

export function getVictoryPointByRoomLevel(roomLevel: number) {
  const victoryPoints: Record<number, number> = {
    [LevelEnum.EASY]: 3,
    [LevelEnum.MEDIUM]: 5,
    [LevelEnum.HARD]: 8,
  };

  return victoryPoints[roomLevel] || 0;
}
