import { LevelEnum, LevelEnumType } from "./enum/levelEnum";

export const getRoomLevelText = (level: number) => {
  const literal = {
    [LevelEnum.EASY]: "Fácil",
    [LevelEnum.MEDIUM]: "Médio",
    [LevelEnum.HARD]: "Difícil",
  };

  return literal[level as LevelEnumType];
};
