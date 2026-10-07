export type LanguageCode =
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as';

export type VehicleType = 'bike' | 'car' | 'both';

export type GoalType = 'learner_license' | 'challan_proof' | 'both';

export interface StateThreshold {
  stateCode: string;
  name: string;
  passingScore: number; // e.g. 9 or 10 or 12 out of 15
  totalQuestions: number;
}

export interface TrafficSign {
  id: string;
  name: string;
  category: 'mandatory' | 'cautionary' | 'informatory' | 'road_marking' | 'traffic_light';
  description: string;
  whyItMatters: string;
  challanAmount?: string;
  shape: string;
  svgKey: string;
}

export interface LessonSection {
  title: string;
  signId?: string;
  ruleText: string;
  whatItMeans: string;
  whyItMatters: string;
  challanNote?: string;
  fineAmount?: number;
  illustrationType?: 'sign' | 'road_scene' | 'document' | 'signal';
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  category: 'mandatory' | 'cautionary' | 'informatory' | 'rules' | 'challan_proof';
  vehicleType: VehicleType;
  sections: LessonSection[];
  summary: string;
  audioNarrationText: string;
}

export interface QuizQuestion {
  id: string;
  lessonId?: string;
  question: string;
  signSvgKey?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  challanImpact?: string;
  vehicleType?: VehicleType;
}

export interface ChallanOffence {
  id: string;
  offence: string;
  sectionMVA: string;
  fineAmount: number;
  repeatFine?: number;
  courtChallan: boolean;
  licenceSuspensionPossible: boolean;
  category: 'helmet_belt' | 'licence_docs' | 'signals_speed' | 'drunk_dangerous';
  whyRisky: string;
  howToAvoid: string;
  vehicleType: VehicleType;
}

export interface Certificate {
  id: string; // SAR-YYYY-XXXXXX
  candidateName: string;
  state: string;
  vehicleType: VehicleType;
  score: number;
  totalQuestions: number;
  percentage: number;
  issuedAt: string;
  timestamp: number;
  verificationUrl: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  language: LanguageCode;
  vehicleType: VehicleType;
  goal: GoalType;
  selectedState: string;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  completedQuizIds: string[];
  mockTestsTaken: number;
  bestMockScore: number;
  certificates: Certificate[];
  lives: number;
  lastLifeRegen: number;
  xp: number;
  darkMode: boolean;
  audioNarration: boolean;
  isOnboarded: boolean;
}
