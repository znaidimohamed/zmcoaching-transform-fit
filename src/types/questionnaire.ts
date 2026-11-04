export type Gender = "homme" | "femme";
export type ActivityLevel = "sedentaire" | "modere" | "actif";
export type PrimaryGoal =
  | "perte-de-gras"
  | "prise-de-muscle"
  | "recomposition"
  | "performance-hyrox"
  | "remise-en-forme"
  | "autre";

export type ExperienceLevel = "debutant" | "intermediaire" | "avance";
export type TrainingHistory =
  | "moins-de-6-mois"
  | "6-12-mois"
  | "1-3-ans"
  | "plus-de-3-ans";

export type HyroxExperience = "jamais" | "en-preparation" | "deja-participe";
export type WorkoutLocation = "salle" | "maison" | "exterieur";
export type FoodBudget = "faible" | "moyen" | "eleve";
export type PreferredContact = "whatsapp" | "email";

export type QuestionnaireStatus = "draft" | "submitted" | "read" | "processed";

export interface ProfileSection {
  age: number;
  gender: Gender;
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  activityLevel: ActivityLevel;
  profession?: string;
  city?: string;
}

export interface GoalSection {
  primaryGoal: PrimaryGoal;
  specificGoal: string;
  timeframe: string; // "4 semaines", "8 semaines", "12 semaines", "16 semaines", "plus"
  motivationLevel: number; // 1-10
  whyNow?: string;
  previousCoaching?: string;
}

export interface LevelSection {
  experienceLevel: ExperienceLevel;
  yearsTraining: TrainingHistory;
  sportsPracticed?: string;
  prs?: {
    squat?: number;
    bench?: number;
    deadlift?: number;
    run5kTime?: string;
  };
  hyroxExperience: HyroxExperience;
}

export interface AvailabilitySection {
  daysPerWeek: number; // 2-7
  durationPerSession: number; // 30, 45, 60, 90 min
  preferredTimeOfDay?: string; // matin, midi, soir
  workoutLocation: WorkoutLocation;
  equipmentAvailable: string[]; // halteres, barre, machines, elastiques, kettlebell, tapis, aucun
  dislikedOrPreferredExercises?: string;
}

export interface HealthSection {
  injuries: string; // "aucune" or details
  jointPains?: string;
  medicalConditions: string; // "aucun" or details
  heartIssues: string; // "non" or details
  pregnancy?: string; // for women
  sleepHoursPerNight: number;
  sleepQualityRating: number; // 1-5
  stressLevel?: number; // 1-10
}

export interface NutritionSection {
  mealsPerDay: number;
  currentDietNotes?: string;
  allergiesOrIntolerances: string; // "aucune" or details
  dislikedOrPreferredFoods?: string;
  dietType?: string; // halal, vegetarien, autre, aucun
  foodBudget: FoodBudget;
  whoCooksDaily?: string;
  waterLitresPerDay?: number;
  alcoholOrTobacco?: string;
  supplementsUsed?: string;
  problematicHabits?: string[]; // grignotage, repas-sautes, sucre, fast-food, autre
}

export interface FinalSection {
  preferredContact: PreferredContact;
  whatsappNumber: string;
  photos?: {
    front?: string;
    profile?: string;
    back?: string;
  };
  dataConsent: boolean;
  consentDate?: string;
}

export interface QuestionnaireData {
  _id?: string;
  user?: any;
  profile: ProfileSection;
  goal: GoalSection;
  level: LevelSection;
  availability: AvailabilitySection;
  health: HealthSection;
  nutrition: NutritionSection;
  final: FinalSection;
  status: QuestionnaireStatus;
  coachNotes?: string;
  submittedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}
