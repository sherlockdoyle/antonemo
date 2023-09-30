import { GameMode } from './engine';
import { WordListType } from './word-graph';

interface Matches {
  day?: number;
  listType?: WordListType;
  mode?: GameMode;
  seed?: number;
}
export function parseParam(param: string): Matches {
  const matches = param.match(/(\d+)?([a-z]+)?(\d)?(\d*)?/);
  if (!matches) {
    return {};
  }
  const day = matches[1],
    listType = matches[2],
    mode = matches[3],
    seed = matches[4];
  const dayNum = day ? parseInt(day) : undefined,
    modeNum = mode ? parseInt(mode) : undefined;
  return {
    day: dayNum,
    listType: listType === 'large' || listType === 'default' || listType === 'manual' ? listType : undefined,
    mode: modeNum === GameMode.Easy || modeNum === GameMode.Hard ? modeNum : undefined,
    seed: seed ? parseInt(seed) : dayNum,
  };
}
