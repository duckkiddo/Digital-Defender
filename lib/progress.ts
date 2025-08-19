export interface GameProgress {
  completed: boolean
  score?: number
  completedAt?: string
  attempts?: number
}

export interface MissionProgress {
  intro: GameProgress
  game1: GameProgress
  game2: GameProgress
  boss: GameProgress
  debrief: GameProgress
  completed: boolean
  badge?: string
  completedAt?: string

}

export interface UserProgress {
  mindfog: MissionProgress
  phisher: MissionProgress
  aitruth: MissionProgress
  certificateUnlocked: boolean
  certificateGenerated: boolean
  totalScore: number
  badges: string[]
  certificates: string[]
  startedAt: string
  lastActivity: string
}

const defaultGameProgress: GameProgress = {
  completed: false,
  score: 0,
  attempts: 0,
}

const defaultMissionProgress: MissionProgress = {
  intro: { ...defaultGameProgress },
  game1: { ...defaultGameProgress },
  game2: { ...defaultGameProgress },
  boss: { ...defaultGameProgress },
  debrief: { ...defaultGameProgress },
  completed: false,
}

const defaultProgress: UserProgress = {
  mindfog: { ...defaultMissionProgress },
  phisher: { ...defaultMissionProgress },
  aitruth: { ...defaultMissionProgress },
  certificateUnlocked: false,
  certificateGenerated: false,
  totalScore: 0,
  badges: [],
  certificates: [],
  startedAt: new Date().toISOString(),
  lastActivity: new Date().toISOString(),
}

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress

  const stored = localStorage.getItem("digital-defenders-progress")
  if (!stored) return defaultProgress

  try {
    const parsedProgress = { ...defaultProgress, ...JSON.parse(stored) };

    // Ensure certificateUnlocked is correctly calculated on retrieval
    parsedProgress.certificateUnlocked = 
      parsedProgress.mindfog.completed &&
      parsedProgress.phisher.completed &&
      parsedProgress.aitruth.completed;

    return parsedProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: Partial<UserProgress>): void {
  if (typeof window === "undefined") return

  const current = getProgress()
  const updated = {
    ...current,
    ...progress,
    lastActivity: new Date().toISOString(),
  }

  localStorage.setItem("digital-defenders-progress", JSON.stringify(updated))
}

export function updateGameProgress(
  mission: "mindfog" | "phisher" | "aitruth",
  game: keyof MissionProgress,
  gameProgress: Partial<GameProgress>,
): void {
  const current = getProgress()
  const gameKeys: Array<keyof Omit<MissionProgress, 'completed' | 'badge' | 'completedAt' | 'certificateEarned'>> = ['intro', 'game1', 'game2', 'boss', 'debrief'];

  let updatedGame: GameProgress;
  if (gameKeys.includes(game as any)) {
    updatedGame = {
      ...(current[mission][game] as GameProgress),
      ...gameProgress,
      completedAt: gameProgress.completed ? new Date().toISOString() : (current[mission][game] as GameProgress).completedAt,
    };
  } else {
    // Handle cases where 'game' is not a GameProgress type, though it shouldn't happen with proper usage
    // For now, we'll just use the gameProgress directly if it's not a recognized game key
    updatedGame = gameProgress as GameProgress;
  }



  const updatedMission = {
    ...current[mission],
    [game]: updatedGame,
  }

  // Check if mission is complete
  const allGamesComplete = gameKeys.every((key) => updatedMission[key]?.completed)

  if (allGamesComplete && !updatedMission.completed) {
    updatedMission.completed = true
    updatedMission.completedAt = new Date().toISOString()
    updatedMission.badge =
      mission === "mindfog" ? "Focus Champion" : mission === "phisher" ? "Scam Spotter" : "Truth Detective"

  }

  const updatedProgress = {
    ...current,
    [mission]: updatedMission,
  }

  // Update badges
  if (updatedMission.badge && !updatedProgress.badges.includes(updatedMission.badge)) {
    updatedProgress.badges.push(updatedMission.badge)
  }

  // Check if all missions are completed to unlock the certificate
  if (updatedProgress.mindfog.completed && updatedProgress.phisher.completed && updatedProgress.aitruth.completed) {
    updatedProgress.certificateUnlocked = true;
  }





  // Update total score
  updatedProgress.totalScore = calculateTotalScore(updatedProgress)

  saveProgress(updatedProgress)
}

function calculateTotalScore(progress: UserProgress): number {
  let total = 0

  // Add scores from mindfog mission
  Object.keys(progress.mindfog).forEach((key) => {
    const game = progress.mindfog[key as keyof MissionProgress];
    if (typeof game === "object" && game !== null && "score" in game && typeof (game as GameProgress).score === 'number') {
      total += (game as GameProgress).score || 0;
    }
  })

  // Add scores from phisher mission
  Object.keys(progress.phisher).forEach((key) => {
    const game = progress.phisher[key as keyof MissionProgress];
    if (typeof game === "object" && game !== null && "score" in game && typeof (game as GameProgress).score === 'number') {
      total += (game as GameProgress).score || 0;
    }
  })

  Object.keys(progress.aitruth).forEach((key) => {
    const game = progress.aitruth[key as keyof MissionProgress];
    if (typeof game === "object" && game !== null && "score" in game && typeof (game as GameProgress).score === 'number') {
      total += (game as GameProgress).score || 0;
    }
  })

  return total
}

export function getMissionProgress(mission: "mindfog" | "phisher" | "aitruth"): number {
  const progress = getProgress()
  const missionData = progress[mission]

  const games = ["intro", "game1", "game2", "boss", "debrief"]
  const completed = games.filter((gameKey) => {
    const game = missionData[gameKey as keyof MissionProgress];
    return typeof game === "object" && game !== null && "completed" in game && (game as GameProgress).completed;
  }).length

  return Math.round((completed / games.length) * 100)
}

export function getOverallProgress(): number {
  const mindfogProgress = getMissionProgress("mindfog")
  const phisherProgress = getMissionProgress("phisher")
  const aitruthProgress = getMissionProgress("aitruth")

  return Math.round((mindfogProgress + phisherProgress + aitruthProgress) / 3)
}
