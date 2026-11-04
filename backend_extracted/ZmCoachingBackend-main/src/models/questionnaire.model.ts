import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionnaire extends Document {
  user: mongoose.Types.ObjectId;
  profile: {
    age: number;
    gender: "homme" | "femme";
    height: number;
    currentWeight: number;
    targetWeight: number;
    activityLevel: "sedentaire" | "modere" | "actif";
    profession?: string;
    city?: string;
  };
  goal: {
    primaryGoal: string;
    specificGoal: string;
    timeframe: string;
    motivationLevel: number;
    whyNow?: string;
    previousCoaching?: string;
  };
  level: {
    experienceLevel: "debutant" | "intermediaire" | "avance";
    yearsTraining: string;
    sportsPracticed?: string;
    prs?: {
      squat?: number;
      bench?: number;
      deadlift?: number;
      run5kTime?: string;
    };
    hyroxExperience: "jamais" | "en-preparation" | "deja-participe";
  };
  availability: {
    daysPerWeek: number;
    durationPerSession: number;
    preferredTimeOfDay?: string;
    workoutLocation: "salle" | "maison" | "exterieur";
    equipmentAvailable: string[];
    dislikedOrPreferredExercises?: string;
  };
  health: {
    injuries: string;
    jointPains?: string;
    medicalConditions: string;
    heartIssues: string;
    pregnancy?: string;
    sleepHoursPerNight: number;
    sleepQualityRating: number;
    stressLevel?: number;
  };
  nutrition: {
    mealsPerDay: number;
    currentDietNotes?: string;
    allergiesOrIntolerances: string;
    dislikedOrPreferredFoods?: string;
    dietType?: string;
    foodBudget: "faible" | "moyen" | "eleve";
    whoCooksDaily?: string;
    waterLitresPerDay?: number;
    alcoholOrTobacco?: string;
    supplementsUsed?: string;
    problematicHabits?: string[];
  };
  final: {
    preferredContact: "whatsapp" | "email";
    whatsappNumber: string;
    photos?: {
      front?: string;
      profile?: string;
      back?: string;
    };
    dataConsent: boolean;
    consentDate?: Date;
  };
  status: "draft" | "submitted" | "read" | "processed";
  coachNotes?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const questionnaireSchema = new Schema<IQuestionnaire>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    profile: {
      age: { type: Number, required: true },
      gender: { type: String, enum: ["homme", "femme"], default: "homme" },
      height: { type: Number, required: true },
      currentWeight: { type: Number, required: true },
      targetWeight: { type: Number, required: true },
      activityLevel: {
        type: String,
        enum: ["sedentaire", "modere", "actif"],
        default: "modere",
      },
      profession: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    goal: {
      primaryGoal: { type: String, required: true, trim: true },
      specificGoal: { type: String, required: true, trim: true },
      timeframe: { type: String, default: "12 semaines" },
      motivationLevel: { type: Number, default: 8 },
      whyNow: { type: String, trim: true },
      previousCoaching: { type: String, trim: true },
    },
    level: {
      experienceLevel: {
        type: String,
        enum: ["debutant", "intermediaire", "avance"],
        default: "intermediaire",
      },
      yearsTraining: { type: String, default: "1-3-ans" },
      sportsPracticed: { type: String, trim: true },
      prs: {
        squat: { type: Number },
        bench: { type: Number },
        deadlift: { type: Number },
        run5kTime: { type: String },
      },
      hyroxExperience: {
        type: String,
        enum: ["jamais", "en-preparation", "deja-participe"],
        default: "en-preparation",
      },
    },
    availability: {
      daysPerWeek: { type: Number, default: 4 },
      durationPerSession: { type: Number, default: 60 },
      preferredTimeOfDay: { type: String, default: "soir" },
      workoutLocation: {
        type: String,
        enum: ["salle", "maison", "exterieur"],
        default: "salle",
      },
      equipmentAvailable: { type: [String], default: [] },
      dislikedOrPreferredExercises: { type: String, trim: true },
    },
    health: {
      injuries: { type: String, default: "aucune" },
      jointPains: { type: String },
      medicalConditions: { type: String, default: "aucun" },
      heartIssues: { type: String, default: "non" },
      pregnancy: { type: String },
      sleepHoursPerNight: { type: Number, default: 7 },
      sleepQualityRating: { type: Number, default: 4 },
      stressLevel: { type: Number, default: 5 },
    },
    nutrition: {
      mealsPerDay: { type: Number, default: 3 },
      currentDietNotes: { type: String, trim: true },
      allergiesOrIntolerances: { type: String, default: "aucune" },
      dislikedOrPreferredFoods: { type: String, trim: true },
      dietType: { type: String, default: "aucun" },
      foodBudget: {
        type: String,
        enum: ["faible", "moyen", "eleve"],
        default: "moyen",
      },
      whoCooksDaily: { type: String, default: "moi" },
      waterLitresPerDay: { type: Number, default: 2.5 },
      alcoholOrTobacco: { type: String, default: "non" },
      supplementsUsed: { type: String },
      problematicHabits: { type: [String], default: [] },
    },
    final: {
      preferredContact: {
        type: String,
        enum: ["whatsapp", "email"],
        default: "whatsapp",
      },
      whatsappNumber: { type: String, required: true },
      photos: {
        front: { type: String },
        profile: { type: String },
        back: { type: String },
      },
      dataConsent: { type: Boolean, default: true },
      consentDate: { type: Date, default: Date.now },
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "read", "processed"],
      default: "draft",
    },
    coachNotes: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Questionnaire = mongoose.model<IQuestionnaire>(
  "Questionnaire",
  questionnaireSchema
);
