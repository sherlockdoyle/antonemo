import { GameMode } from './engine';
import { WordListType } from './word-graph';

interface Matches {
  e?: number;
  t?: WordListType;
  o?: GameMode;
  n?: number;
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
    e: dayNum,
    t: listType === 'm' || listType === 'd' || listType === 'l' ? listType : undefined,
    o: modeNum === GameMode.e || modeNum === GameMode.t ? modeNum : undefined,
    n: seed ? parseInt(seed) : dayNum,
  };
}
