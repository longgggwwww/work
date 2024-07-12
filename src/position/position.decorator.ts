import { SetMetadata } from '@nestjs/common';
import { Position } from './position.enum';

export const POSITION_KEY = 'position';
export const RequirePositions = (...positions: Position[]) =>
  SetMetadata(POSITION_KEY, positions);
