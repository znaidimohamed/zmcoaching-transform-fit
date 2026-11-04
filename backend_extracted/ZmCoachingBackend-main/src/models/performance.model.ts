import mongoose, { Document, Schema } from "mongoose";

// --- Set (Musculation & Force) ---
export interface IPerformanceSet extends Document {
  user: mongoose.Types.ObjectId;
  exercise: string;
  category?: string;
  weight: number;
  reps: number;
  rpe?: number;
  estimated1RM?: number;
  notes?: string;
  date: Date;
  isPR?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const performanceSetSchema = new Schema<IPerformanceSet>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    exercise: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "Musculation",
    },
    weight: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    rpe: {
      type: Number,
      default: 8,
    },
    estimated1RM: {
      type: Number,
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isPR: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// --- Run Log (Allure & Sorties Running) ---
export interface IRunLog extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  distance: number;
  minutes: number;
  seconds: number;
  pace?: string;
  speed?: number;
  hr?: number;
  notes?: string;
  surface?: string;
  elevation?: number;
  cadence?: number;
  intervalStructure?: string;
  intervalRest?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const runLogSchema = new Schema<IRunLog>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      default: "5K Tempo",
      trim: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
    seconds: {
      type: Number,
      default: 0,
    },
    pace: {
      type: String,
    },
    speed: {
      type: Number,
    },
    hr: {
      type: Number,
    },
    notes: {
      type: String,
      trim: true,
    },
    surface: {
      type: String,
      trim: true,
    },
    elevation: {
      type: Number,
    },
    cadence: {
      type: Number,
    },
    intervalStructure: {
      type: String,
      trim: true,
    },
    intervalRest: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// --- Hyrox Simulation Log (8 Stations) ---
export interface IHyroxLog extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  stationTimes: Record<string, any>;
  runPaceSecs?: number;
  roxtimeSecs?: number;
  totalTime: string;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const hyroxLogSchema = new Schema<IHyroxLog>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: "Open Men",
      trim: true,
    },
    stationTimes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    runPaceSecs: {
      type: Number,
    },
    roxtimeSecs: {
      type: Number,
    },
    totalTime: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// --- WOD / Metcon Log ---
export interface IWodLog extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  name: string;
  score: string;
  details?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const wodLogSchema = new Schema<IWodLog>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      default: "AMRAP",
    },
    name: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// --- Coach Consigne ---
export interface ICoachConsigne extends Document {
  user: mongoose.Types.ObjectId;
  coach?: mongoose.Types.ObjectId;
  content: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const coachConsigneSchema = new Schema<ICoachConsigne>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// --- Tracking Access Setting ---
export interface IPerformanceAccess extends Document {
  user: mongoose.Types.ObjectId;
  trackingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const performanceAccessSchema = new Schema<IPerformanceAccess>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    trackingEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PerformanceSet = mongoose.model<IPerformanceSet>(
  "PerformanceSet",
  performanceSetSchema
);

export const RunLog = mongoose.model<IRunLog>("RunLog", runLogSchema);

export const HyroxLog = mongoose.model<IHyroxLog>("HyroxLog", hyroxLogSchema);

export const WodLog = mongoose.model<IWodLog>("WodLog", wodLogSchema);

export const CoachConsigne = mongoose.model<ICoachConsigne>(
  "CoachConsigne",
  coachConsigneSchema
);

export const PerformanceAccess = mongoose.model<IPerformanceAccess>(
  "PerformanceAccess",
  performanceAccessSchema
);
