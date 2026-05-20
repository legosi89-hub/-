
export interface LeaderboardEntry {
  name: string;
  level: string;
  time: number;
  createdAt: string;
}

const INITIAL_CHAMPIONS: LeaderboardEntry[] = [
  { name: 'STGE', level: 'light', time: 5.50, createdAt: new Date().toISOString() },
  { name: 'MAST', level: 'light', time: 6.20, createdAt: new Date().toISOString() },
  { name: 'PROG', level: 'sound', time: 12.40, createdAt: new Date().toISOString() },
  { name: 'OSCI', level: 'sound', time: 15.10, createdAt: new Date().toISOString() },
  { name: 'SHOW', level: 'show', time: 8.90, createdAt: new Date().toISOString() }
];

export const saveScore = (name: string, level: string, time: number) => {
  const localScores = JSON.parse(localStorage.getItem('leaderboard') || 'null');
  let scores: LeaderboardEntry[] = localScores || [...INITIAL_CHAMPIONS];

  // Logic: Add new score, sort, if better than existing entry in top 5, it takes the place
  // The user said: "If someone breaks a record, they take the place of the person who was previously in that position... the surpassed is removed"
  // This implies keeping only 5 per level.
  
  const levelScores = scores.filter(s => s.level === level).sort((a, b) => a.time - b.time);
  
  // If we have fewer than 5 or the new time is better than the 5th place
  if (levelScores.length < 5 || time < levelScores[levelScores.length - 1].time) {
    scores.push({
      name: name.slice(0, 4).toUpperCase(),
      level,
      time,
      createdAt: new Date().toISOString()
    });
    
    // Maintain top 5 per level
    const updatedLevelScores = scores
      .filter(s => s.level === level)
      .sort((a, b) => a.time - b.time)
      .slice(0, 5);

    // Filter out all scores for this level from main list and add the new top 5
    const otherLevelsScores = scores.filter(s => s.level !== level);
    scores = [...otherLevelsScores, ...updatedLevelScores];
    
    localStorage.setItem('leaderboard', JSON.stringify(scores));
  }
};

export const getTopScores = (level: string) => {
  const localScores = JSON.parse(localStorage.getItem('leaderboard') || 'null');
  const scores: LeaderboardEntry[] = localScores || [...INITIAL_CHAMPIONS];
  
  return scores
    .filter(s => s.level === level)
    .sort((a, b) => a.time - b.time)
    .slice(0, 5);
};
