import { LevelEnum, LevelEnumType } from "./enum/levelEnum";
import ptJson from "@/helpers/translation/pt.json";

export const getRoomLevelText = (level: number) => {
  const literal = {
    [LevelEnum.EASY]: ptJson.easy,
    [LevelEnum.MEDIUM]: ptJson.medium,
    [LevelEnum.HARD]: ptJson.hard,
  };

  return literal[level as LevelEnumType];
};
