export type GameLevel = 'menu' | 'light' | 'sound' | 'show' | 'finished' | 'leaderboard';

export interface GameState {
  level: GameLevel;
  isMarathon: boolean;
}
