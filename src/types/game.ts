export type RoleId = 'DATA_ENGINEER' | 'DIGITAL_ARCHAEOLOGIST' | 'ENVIRONMENTAL_BIOLOGIST';

export interface RoleInfo {
  id: RoleId;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  iconName: string;
  image: string;
  accentColor: string;
  badge: string;
}

export type AlexaEmotion = 'cold' | 'enthusiastic' | 'critical';

export type MissionPhase = 
  | 'AUTH'
  | 'BRIEFING_M0'
  | 'AVATAR_SELECT'
  | 'BRIEFING_M1A'
  | 'MISSION_1A'
  | 'BRIEFING_M1B'
  | 'MISSION_1B'
  | 'BRIEFING_INT1'
  | 'INTERLUDE_1'
  | 'BRIEFING_M2C'
  | 'MISSION_2C'
  | 'BRIEFING_M3'
  | 'MISSION_3'
  | 'BRIEFING_INT2'
  | 'INTERLUDE_2'
  | 'BRIEFING_M4'
  | 'MISSION_4'
  | 'BRIEFING_M5'
  | 'MISSION_5'
  | 'OUTCOME'
  | 'SECRET_TETRATION'
  | 'TEACHER_PANEL';

export interface MissionScore {
  missionId: string;
  missionName: string;
  correct: number;
  total: number;
  percentage: number;
  xpEarned: number;
}

export interface StudentProgress {
  name: string;
  group: string;
  roleId: RoleId;
  totalXp: number;
  serverIntegrity: number; // 0 - 100
  alexaTrust: number; // 0 - 100
  badges: string[];
  missionScores: Record<string, MissionScore>;
  startedAt: string;
  completedAt?: string;
}

export interface TeacherRecord {
  id: string;
  name: string;
  group: string;
  roleId: RoleId;
  totalXp: number;
  globalPercentage: number;
  m1Pct: number;
  m2cPct: number;
  m3Pct: number;
  m4Pct: number;
  m5Pct: number;
  secretPhaseCompleted: boolean;
  date: string;
}
