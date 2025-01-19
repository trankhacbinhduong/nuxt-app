export type SessionUnit = {
  unitId: number
  unitTitle: string
}

export type SessionStatus = {
  value: string
  label?: string
  icon?: string
}

export type Session = {
  completionDate: string | null
  date: string | null
  isScheduled: boolean
  overallIndex: number
  unitIds: number[]
  proficiency: number
  totalProficiency: number
  completed: boolean
  dayOfWeek?: number
  status: SessionStatus
}

export type Missions = {
  totalUnits: number
  totalCups: number
  actualCompletedUnits: number
  expectedCompletedUnits: number
  earnedCups: number
}

export type Level = {
  levelName: string
  duration: number
  remainingDuration: number
  units: SessionUnit[]
  sessions: Session[]
  missions: Missions
}
