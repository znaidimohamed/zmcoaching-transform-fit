import { useEffect, useState } from "react";
import {
  Activity,
  Dumbbell,
  Sparkles,
  RefreshCw,
  Plus,
  Flame,
  Search,
  CheckCircle2,
  Trophy,
  Clock,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Zap,
  Info,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Heart,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchUserPerformance,
  saveLoggedSet,
  deleteLoggedSet,
  saveRunLog,
  deleteRunLog,
  saveHyroxSimulation,
  saveWodLog,
  getCurrentUserId,
} from "@/lib/performanceService";

interface LoggedSet {
  id: string;
  exercise: string;
  category: string;
  weight: number;
  reps: number;
  rpe: number;
  estimated1RM: number;
  notes?: string;
  date: string;
}

interface CustomExercise {
  name: string;
  category: string;
}

interface RunLog {
  id: string;
  type: string;
  distance: number;
  minutes: number;
  seconds: number;
  pace: string;
  speed: number;
  hr?: number;
  notes?: string;
  date: string;
}

interface WodLog {
  id: string;
  type: string;
  name: string;
  score: string;
  details?: string;
  date: string;
}

const defaultExercises = [
  // CHEST
  { name: "Barbell Bench Press", category: "Chest", isBigCompound: true },
  { name: "Incline DB Press", category: "Chest", isBigCompound: false },
  { name: "Incline Barbell Press", category: "Chest", isBigCompound: true },
  { name: "Flat DB Bench Press", category: "Chest", isBigCompound: false },
  { name: "Weighted Dips", category: "Chest", isBigCompound: false },
  { name: "Chest Flyes (Cable / DB)", category: "Chest", isBigCompound: false },
  { name: "Pec Deck Machine", category: "Chest", isBigCompound: false },
  { name: "Decline Bench Press", category: "Chest", isBigCompound: true },
  { name: "Push-ups (Weighted)", category: "Chest", isBigCompound: false },
  { name: "Dumbbell Pullover", category: "Chest", isBigCompound: false },

  // BACK
  { name: "Conventional Deadlift", category: "Back", isBigCompound: true },
  { name: "Sumo Deadlift", category: "Back", isBigCompound: true },
  { name: "Barbell Row", category: "Back", isBigCompound: true },
  { name: "Weighted Pull-ups", category: "Back", isBigCompound: false },
  { name: "Lat Pulldown", category: "Back", isBigCompound: false },
  { name: "Seated Cable Row", category: "Back", isBigCompound: false },
  { name: "T-Bar Row", category: "Back", isBigCompound: true },
  { name: "Single-Arm DB Row", category: "Back", isBigCompound: false },
  { name: "Face Pulls", category: "Back", isBigCompound: false },
  { name: "Hyperextensions (Lesté)", category: "Back", isBigCompound: false },

  // LEGS
  { name: "Barbell Back Squat", category: "Legs", isBigCompound: true },
  { name: "Front Squat", category: "Legs", isBigCompound: true },
  { name: "Bulgarian Split Squat", category: "Legs", isBigCompound: false },
  { name: "Romanian Deadlift (RDL)", category: "Legs", isBigCompound: false },
  { name: "Leg Press", category: "Legs", isBigCompound: false },
  { name: "Hack Squat", category: "Legs", isBigCompound: true },
  { name: "Walking Lunges (DB/Barbell)", category: "Legs", isBigCompound: false },
  { name: "Lying Leg Curl", category: "Legs", isBigCompound: false },
  { name: "Leg Extension", category: "Legs", isBigCompound: false },
  { name: "Standing Calf Raises", category: "Legs", isBigCompound: false },
  { name: "Hip Thrust", category: "Legs", isBigCompound: true },

  // SHOULDERS
  { name: "Overhead Press (OHP)", category: "Shoulders", isBigCompound: true },
  { name: "Seated DB Shoulder Press", category: "Shoulders", isBigCompound: false },
  { name: "Lateral Raises (DB/Cable)", category: "Shoulders", isBigCompound: false },
  { name: "Arnold Press", category: "Shoulders", isBigCompound: false },
  { name: "Reverse Pec Deck / Rear Delt Fly", category: "Shoulders", isBigCompound: false },
  { name: "Front DB Raises", category: "Shoulders", isBigCompound: false },
  { name: "Upright Row", category: "Shoulders", isBigCompound: false },

  // ARMS
  { name: "Barbell Biceps Curl", category: "Arms", isBigCompound: false },
  { name: "Incline DB Curl", category: "Arms", isBigCompound: false },
  { name: "Hammer Curls", category: "Arms", isBigCompound: false },
  { name: "Preacher Curl", category: "Arms", isBigCompound: false },
  { name: "Triceps Pushdown (Cable)", category: "Arms", isBigCompound: false },
  { name: "EZ-Bar Skullcrushers", category: "Arms", isBigCompound: false },
  { name: "Close-Grip Bench Press", category: "Arms", isBigCompound: true },
  { name: "Overhead DB Triceps Extension", category: "Arms", isBigCompound: false },

  // CORE & ABS
  { name: "Hanging Leg Raise", category: "Core & Abs", isBigCompound: false },
  { name: "Ab Wheel Rollout", category: "Core & Abs", isBigCompound: false },
  { name: "Cable Crunch / Woodchoppers", category: "Core & Abs", isBigCompound: false },
  { name: "Weighted Decline Sit-ups", category: "Core & Abs", isBigCompound: false },
  { name: "Toes to Bar (T2B)", category: "Core & Abs", isBigCompound: false },

  // CROSS-TRAINING & OLYMPIC & HYROX
  { name: "Thrusters", category: "Cross-training", isBigCompound: true },
  { name: "Kettlebell Swings", category: "Cross-training", isBigCompound: false },
  { name: "Power Clean / Clean & Jerk", category: "Cross-training", isBigCompound: true },
  { name: "Dumbbell Snatch", category: "Cross-training", isBigCompound: false },
  { name: "Wall Balls (6kg/9kg)", category: "Cross-training", isBigCompound: false },
  { name: "Sandbag Lunges", category: "Cross-training", isBigCompound: false },
  { name: "Devil Press", category: "Cross-training", isBigCompound: false },
  { name: "Burpee Broad Jumps", category: "Cross-training", isBigCompound: false },
];

const categoryList = [
  { id: "all", label: "All Exercises" },
  { id: "compounds", label: "🔥 Big Compounds (SBD)" },
  { id: "Chest", label: "Chest" },
  { id: "Back", label: "Back" },
  { id: "Legs", label: "Legs" },
  { id: "Shoulders", label: "Shoulders" },
  { id: "Arms", label: "Arms" },
  { id: "Core & Abs", label: "Core & Abs" },
  { id: "Cross-training", label: "Cross-Training / Hyrox" },
];

interface HyroxSimulationLog {
  id: string;
  category: string;
  stationTimes: Record<number, { min: number; sec: number }>;
  runPaceSecs: number;
  roxtimeSecs: number;
  totalTime: string;
  notes: string;
  date: string;
}

// Category Station Specifications according to Hyrox Official Rules
const hyroxStationSpecs: Record<string, Record<number, { name: string; dist: string; charge: string; targetPro: string; targetOpen: string }>> = {
  "Open Men": {
    1: { name: "#1 1000m SkiErg", dist: "1000 m", charge: "Damper 5-6", targetPro: "< 03:30", targetOpen: "< 04:00" },
    2: { name: "#2 50m Sled Push", dist: "50 m (4 x 12.5m)", charge: "152 kg (including sled)", targetPro: "< 01:40", targetOpen: "< 02:30" },
    3: { name: "#3 50m Sled Pull", dist: "50 m (4 x 12.5m rope)", charge: "103 kg", targetPro: "< 01:40", targetOpen: "< 02:30" },
    4: { name: "#4 80m Burpee Broad Jumps", dist: "80 m", charge: "Bodyweight", targetPro: "< 02:00", targetOpen: "< 03:00" },
    5: { name: "#5 1000m Rowing", dist: "1000 m Row", charge: "Damper 5-6", targetPro: "< 03:15", targetOpen: "< 03:40" },
    6: { name: "#6 200m Farmers Carry", dist: "200 m (kettlebells)", charge: "2 x 24 kg", targetPro: "< 01:20", targetOpen: "< 02:00" },
    7: { name: "#7 100m Sandbag Lunges", dist: "100 m Lunges", charge: "20 kg on shoulders", targetPro: "< 02:40", targetOpen: "< 03:30" },
    8: { name: "#8 100 Wall Balls", dist: "100 reps (Target 3m / 2.7m)", charge: "6 kg (target 3m)", targetPro: "< 03:30", targetOpen: "< 04:40" },
  },
  "Open Women": {
    1: { name: "#1 1000m SkiErg", dist: "1000 m", charge: "Damper 5-6", targetPro: "< 03:45", targetOpen: "< 04:15" },
    2: { name: "#2 50m Sled Push", dist: "50 m (4 x 12.5m)", charge: "102 kg (including sled)", targetPro: "< 01:50", targetOpen: "< 02:45" },
    3: { name: "#3 50m Sled Pull", dist: "50 m (4 x 12.5m rope)", charge: "78 kg", targetPro: "< 01:50", targetOpen: "< 02:45" },
    4: { name: "#4 80m Burpee Broad Jumps", dist: "80 m", charge: "Bodyweight", targetPro: "< 02:15", targetOpen: "< 03:15" },
    5: { name: "#5 1000m Rowing", dist: "1000 m Row", charge: "Damper 5-6", targetPro: "< 03:30", targetOpen: "< 04:00" },
    6: { name: "#6 200m Farmers Carry", dist: "200 m (kettlebells)", charge: "2 x 16 kg", targetPro: "< 01:30", targetOpen: "< 02:15" },
    7: { name: "#7 100m Sandbag Lunges", dist: "100 m Lunges", charge: "10 kg on shoulders", targetPro: "< 02:50", targetOpen: "< 03:45" },
    8: { name: "#8 100 Wall Balls", dist: "100 reps (Target 2.7m)", charge: "4 kg (target 2.7m)", targetPro: "< 03:45", targetOpen: "< 05:00" },
  },
  "Pro Men": {
    1: { name: "#1 1000m SkiErg", dist: "1000 m", charge: "Damper 5-6", targetPro: "< 03:20", targetOpen: "< 03:45" },
    2: { name: "#2 50m Sled Push", dist: "50 m (4 x 12.5m)", charge: "172 kg (including sled)", targetPro: "< 01:30", targetOpen: "< 02:15" },
    3: { name: "#3 50m Sled Pull", dist: "50 m (4 x 12.5m rope)", charge: "153 kg", targetPro: "< 01:30", targetOpen: "< 02:15" },
    4: { name: "#4 80m Burpee Broad Jumps", dist: "80 m", charge: "Bodyweight", targetPro: "< 01:50", targetOpen: "< 02:45" },
    5: { name: "#5 1000m Rowing", dist: "1000 m Row", charge: "Damper 5-6", targetPro: "< 03:05", targetOpen: "< 03:30" },
    6: { name: "#6 200m Farmers Carry", dist: "200 m (kettlebells)", charge: "2 x 32 kg", targetPro: "< 01:15", targetOpen: "< 01:50" },
    7: { name: "#7 100m Sandbag Lunges", dist: "100 m Lunges", charge: "30 kg on shoulders", targetPro: "< 02:30", targetOpen: "< 03:15" },
    8: { name: "#8 100 Wall Balls", dist: "100 reps (Target 3m)", charge: "9 kg (target 3m)", targetPro: "< 03:15", targetOpen: "< 04:15" },
  },
  "Pro Women": {
    1: { name: "#1 1000m SkiErg", dist: "1000 m", charge: "Damper 5-6", targetPro: "< 03:35", targetOpen: "< 04:05" },
    2: { name: "#2 50m Sled Push", dist: "50 m (4 x 12.5m)", charge: "122 kg (including sled)", targetPro: "< 01:40", targetOpen: "< 02:30" },
    3: { name: "#3 50m Sled Pull", dist: "50 m (4 x 12.5m rope)", charge: "103 kg", targetPro: "< 01:40", targetOpen: "< 02:30" },
    4: { name: "#4 80m Burpee Broad Jumps", dist: "80 m", charge: "Bodyweight", targetPro: "< 02:00", targetOpen: "< 03:00" },
    5: { name: "#5 1000m Rowing", dist: "1000 m Row", charge: "Damper 5-6", targetPro: "< 03:20", targetOpen: "< 03:45" },
    6: { name: "#6 200m Farmers Carry", dist: "200 m (kettlebells)", charge: "2 x 24 kg", targetPro: "< 01:20", targetOpen: "< 02:00" },
    7: { name: "#7 100m Sandbag Lunges", dist: "100 m Lunges", charge: "20 kg on shoulders", targetPro: "< 02:40", targetOpen: "< 03:30" },
    8: { name: "#8 100 Wall Balls", dist: "100 reps (Target 3m)", charge: "6 kg (target 3m)", targetPro: "< 03:30", targetOpen: "< 04:30" },
  },
  "Doubles Men": {
    1: { name: "#1 1000m SkiErg", dist: "1000 m (Shared)", charge: "Damper 5-6", targetPro: "< 03:15", targetOpen: "< 03:45" },
    2: { name: "#2 50m Sled Push", dist: "50 m (4 x 12.5m)", charge: "152 kg (including sled)", targetPro: "< 01:30", targetOpen: "< 02:15" },
    3: { name: "#3 50m Sled Pull", dist: "50 m (4 x 12.5m rope)", charge: "103 kg", targetPro: "< 01:30", targetOpen: "< 02:15" },
    4: { name: "#4 80m Burpee Broad Jumps", dist: "80 m (Relay)", charge: "Bodyweight", targetPro: "< 01:50", targetOpen: "< 02:45" },
    5: { name: "#5 1000m Rowing", dist: "1000 m Row (Shared)", charge: "Damper 5-6", targetPro: "< 03:05", targetOpen: "< 03:30" },
    6: { name: "#6 200m Farmers Carry", dist: "200 m (Relay)", charge: "2 x 24 kg", targetPro: "< 01:15", targetOpen: "< 01:50" },
    7: { name: "#7 100m Sandbag Lunges", dist: "100 m Lunges (Relay)", charge: "20 kg on shoulders", targetPro: "< 02:30", targetOpen: "< 03:15" },
    8: { name: "#8 100 Wall Balls", dist: "100 reps (Shared Target 3m)", charge: "6 kg (target 3m)", targetPro: "< 03:00", targetOpen: "< 04:00" },
  },
  "Doubles Women": {
    1: { name: "#1 1000m SkiErg", dist: "1000 m (Shared)", charge: "Damper 5-6", targetPro: "< 03:30", targetOpen: "< 04:00" },
    2: { name: "#2 50m Sled Push", dist: "50 m (4 x 12.5m)", charge: "102 kg (including sled)", targetPro: "< 01:40", targetOpen: "< 02:30" },
    3: { name: "#3 50m Sled Pull", dist: "50 m (4 x 12.5m rope)", charge: "78 kg", targetPro: "< 01:40", targetOpen: "< 02:30" },
    4: { name: "#4 80m Burpee Broad Jumps", dist: "80 m (Relay)", charge: "Bodyweight", targetPro: "< 02:00", targetOpen: "< 03:00" },
    5: { name: "#5 1000m Rowing", dist: "1000 m Row (Shared)", charge: "Damper 5-6", targetPro: "< 03:20", targetOpen: "< 03:45" },
    6: { name: "#6 200m Farmers Carry", dist: "200 m (Relay)", charge: "2 x 16 kg", targetPro: "< 01:20", targetOpen: "< 02:00" },
    7: { name: "#7 100m Sandbag Lunges", dist: "100 m Lunges (Relay)", charge: "10 kg on shoulders", targetPro: "< 02:40", targetOpen: "< 03:30" },
    8: { name: "#8 100 Wall Balls", dist: "100 reps (Shared Target 2.7m)", charge: "4 kg (target 2.7m)", targetPro: "< 03:15", targetOpen: "< 04:15" },
  },
};

const MyPerformancePage = () => {
  const [activeTab, setActiveTab] = useState<
    "musculation" | "hybrid" | "running" | "hyrox" | "timer"
  >("musculation");

  const [userName, setUserName] = useState("Mahfoudh maram");
  const [coachConsigne, setCoachConsigne] = useState<string>("");

  // Log a Set State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("Barbell Bench Press");
  const [weight, setWeight] = useState<number>(80);
  const [reps, setReps] = useState<number>(5);
  const [rpe, setRpe] = useState<number>(8.5);
  const [notes, setNotes] = useState("");

  // Custom Exercise State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Chest");
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);

  // Logged Sets History & PRs
  const [loggedSets, setLoggedSets] = useState<LoggedSet[]>([]);

  // Running State
  const [runType, setRunType] = useState("5K Tempo");
  const [runDistancePreset, setRunDistancePreset] = useState("5km");
  const [runDistance, setRunDistance] = useState<number>(5);
  const [runMinutes, setRunMinutes] = useState<number>(24);
  const [runSeconds, setRunSeconds] = useState<number>(30);
  const [runHr, setRunHr] = useState<number>(165);
  const [runNotes, setRunNotes] = useState("");
  const [runSurface, setRunSurface] = useState("Route");
  const [runElevation, setRunElevation] = useState<number>(45);
  const [runCadence, setRunCadence] = useState<number>(172);
  const [intervalStructure, setIntervalStructure] = useState("8 x 400m");
  const [intervalRest, setIntervalRest] = useState("60s");
  const [loggedRuns, setLoggedRuns] = useState<RunLog[]>([]);

  // Hyrox Simulator State
  const [hyroxCategory, setHyroxCategory] = useState("Open Men");
  const [hyroxStationTimes, setHyroxStationTimes] = useState<Record<number, { min: number; sec: number }>>({
    1: { min: 0, sec: 0 },
    2: { min: 0, sec: 0 },
    3: { min: 0, sec: 0 },
    4: { min: 0, sec: 0 },
    5: { min: 0, sec: 0 },
    6: { min: 0, sec: 0 },
    7: { min: 0, sec: 0 },
    8: { min: 0, sec: 0 },
  });
  const [hyroxRunPaceSecs, setHyroxRunPaceSecs] = useState<number>(260); // 04:20 per km
  const [hyroxRoxzoneSecs, setHyroxRoxzoneSecs] = useState<number>(240); // 04:00 transition
  const [hyroxNotes, setHyroxNotes] = useState<string>("");
  const [loggedHyroxSimulations, setLoggedHyroxSimulations] = useState<HyroxSimulationLog[]>([]);

  // WOD Timer State
  const [timerMode, setTimerMode] = useState<"amrap" | "emom" | "fortime">("amrap");
  const [timerDuration, setTimerDuration] = useState<number>(600);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // WOD Log Form State
  const [wodType, setWodType] = useState("AMRAP");
  const [wodName, setWodName] = useState("");
  const [wodScore, setWodScore] = useState("");
  const [wodDetails, setWodDetails] = useState("");
  const [loggedWods, setLoggedWods] = useState<WodLog[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.fullName) setUserName(u.fullName);
      } catch (e) {
        // fallback
      }
    }

    const loadPerformanceData = async () => {
      const currentUserId = getCurrentUserId();
      const perf = await fetchUserPerformance(currentUserId);
      setLoggedSets(perf.loggedSets);
      setLoggedRuns(perf.loggedRuns);
      setLoggedHyroxSimulations(perf.loggedHyrox);
      setLoggedWods(perf.loggedWods);
      
      const specificConsigne = localStorage.getItem(`zm_consigne_${currentUserId}`) || perf.consigne;
      if (specificConsigne) setCoachConsigne(specificConsigne);
    };

    loadPerformanceData();

    const savedCustoms = localStorage.getItem("zm_custom_exercises");
    if (savedCustoms) {
      try {
        setCustomExercises(JSON.parse(savedCustoms));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast.success("⏱️ Temps écoulé ! Excellent travail !");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Combine default exercises with custom ones
  const allAvailableExercises = [
    ...defaultExercises,
    ...customExercises.map((c) => ({
      name: c.name,
      category: c.category,
      isBigCompound: false,
    })),
  ];

  // Filter exercises
  const filteredExercises = allAvailableExercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory === "all") return true;
    if (selectedCategory === "compounds") return ex.isBigCompound;
    return ex.category === selectedCategory;
  });

  // Calculate Epley Estimated 1RM
  const calculated1RM = Math.round(weight * (1 + reps / 30) * 10) / 10;

  // Existing PR check
  const existingPRsForEx = loggedSets.filter((s) => s.exercise === selectedExercise);
  const currentBest1RM = existingPRsForEx.length > 0
    ? Math.max(...existingPRsForEx.map((s) => s.estimated1RM))
    : 0;
  const isNewPR = calculated1RM > currentBest1RM && currentBest1RM > 0;

  const adjustWeight = (delta: number) => {
    setWeight((prev) => Math.max(0, Math.round((prev + delta) * 10) / 10));
  };

  const handleLogSet = async () => {
    if (!selectedExercise) {
      toast.error("Veuillez sélectionner un exercice.");
      return;
    }
    if (weight <= 0) {
      toast.error("Veuillez indiquer un poids valide.");
      return;
    }

    const currentExObj = allAvailableExercises.find((e) => e.name === selectedExercise);
    const newSet: LoggedSet = {
      id: "set-" + Date.now(),
      exercise: selectedExercise,
      category: currentExObj?.category || "Général",
      weight,
      reps,
      rpe,
      estimated1RM: calculated1RM,
      notes,
      date: new Date().toISOString(),
    };

    const updated = await saveLoggedSet(newSet);
    setLoggedSets(updated);

    if (isNewPR || currentBest1RM === 0) {
      toast.success(`🏆 NOUVEAU RECORD ! 1RM estimé sur ${selectedExercise} : ${calculated1RM} kg !`);
    } else {
      toast.success("Série enregistrée avec succès !");
    }
    setNotes("");
  };

  const handleDeleteSet = async (id: string) => {
    const updated = await deleteLoggedSet(id);
    setLoggedSets(updated);
    toast.info("Série supprimée");
  };

  const handleAddCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newEx = { name: customName.trim(), category: customCategory };
    const updated = [...customExercises, newEx];
    setCustomExercises(updated);
    localStorage.setItem("zm_custom_exercises", JSON.stringify(updated));

    setSelectedExercise(newEx.name);
    setShowCustomModal(false);
    setCustomName("");
    toast.success(`Exercice "${newEx.name}" ajouté avec succès !`);
  };

  // PR Board Map
  const prBoardMap = new Map<string, LoggedSet>();
  loggedSets.forEach((set) => {
    const existing = prBoardMap.get(set.exercise);
    if (!existing || set.estimated1RM > existing.estimated1RM) {
      prBoardMap.set(set.exercise, set);
    }
  });
  const prBoardList = Array.from(prBoardMap.values());

  // Running Calculations
  const totalRunSeconds = runMinutes * 60 + runSeconds;
  const paceSecsPerKm = runDistance > 0 ? totalRunSeconds / runDistance : 0;
  const paceMin = Math.floor(paceSecsPerKm / 60);
  const paceSec = Math.round(paceSecsPerKm % 60);
  const formattedPace = `${paceMin < 10 ? "0" : ""}${paceMin}:${paceSec < 10 ? "0" : ""}${paceSec}`;
  const runSpeedKmH = totalRunSeconds > 0 ? Math.round((runDistance / (totalRunSeconds / 3600)) * 10) / 10 : 0;

  const handleSaveRun = async () => {
    if (runDistance <= 0) {
      toast.error("Veuillez indiquer une distance valide.");
      return;
    }
    const fullNotes = runType === "Intervals"
      ? `[Fract. ${intervalStructure} - Repos ${intervalRest} - Dénivelé +${runElevation}m - Cadence ${runCadence}spm - Surface: ${runSurface}] ${runNotes}`
      : `[Dénivelé +${runElevation}m - Cadence ${runCadence}spm - Surface: ${runSurface}] ${runNotes}`;

    const newRun: RunLog = {
      id: "run-" + Date.now(),
      type: runType,
      distance: runDistance,
      minutes: runMinutes,
      seconds: runSeconds,
      pace: formattedPace,
      speed: runSpeedKmH,
      hr: runHr,
      notes: fullNotes,
      date: new Date().toISOString(),
    };

    const updated = await saveRunLog(newRun);
    setLoggedRuns(updated);
    toast.success("Séance de running enregistrée avec succès !");
    setRunNotes("");
  };

  const handleSaveWod = async () => {
    if (!wodName.trim()) {
      toast.error("Veuillez saisir le nom du WOD.");
      return;
    }
    const newWod: WodLog = {
      id: "wod-" + Date.now(),
      type: wodType,
      name: wodName,
      score: wodScore,
      details: wodDetails,
      date: new Date().toISOString(),
    };

    const updated = await saveWodLog(newWod);
    setLoggedWods(updated);
    toast.success("Score WOD enregistré !");
    setWodName("");
    setWodScore("");
    setWodDetails("");
  };

  // Hyrox Total Computation
  const currentSpecs = hyroxStationSpecs[hyroxCategory] || hyroxStationSpecs["Open Men"];
  
  let totalStationSecs = 0;
  Object.values(hyroxStationTimes).forEach((st) => {
    totalStationSecs += (st.min || 0) * 60 + (st.sec || 0);
  });

  const totalRunSecsCalculated = hyroxRunPaceSecs * 8; // 8 x 1km
  const grandTotalHyroxSecs = totalStationSecs + totalRunSecsCalculated + hyroxRoxzoneSecs;

  const formatSecsToMMSS = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = Math.round(totalSecs % 60);
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    if (hh > 0) {
      return `${hh}h${mm < 10 ? "0" : ""}${mm}:${s < 10 ? "0" : ""}${s}`;
    }
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatPaceSecs = (secPerKm: number) => {
    const m = Math.floor(secPerKm / 60);
    const s = Math.round(secPerKm % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSaveHyroxSimulation = async () => {
    const newSim: HyroxSimulationLog = {
      id: "hyrox-sim-" + Date.now(),
      category: hyroxCategory,
      stationTimes: { ...hyroxStationTimes },
      runPaceSecs: hyroxRunPaceSecs,
      roxtimeSecs: hyroxRoxzoneSecs,
      totalTime: formatSecsToMMSS(grandTotalHyroxSecs),
      notes: hyroxNotes,
      date: new Date().toISOString(),
    };

    const updated = await saveHyroxSimulation(newSim);
    setLoggedHyroxSimulations(updated);
    toast.success(`⚡ Simulation Hyrox enregistrée ! Chrono estimé : ${formatSecsToMMSS(grandTotalHyroxSecs)}`);
    setHyroxNotes("");
  };

  const handleLoadHyroxSimulation = (sim: HyroxSimulationLog) => {
    setHyroxCategory(sim.category);
    setHyroxStationTimes(sim.stationTimes);
    setHyroxRunPaceSecs(sim.runPaceSecs);
    setHyroxRoxzoneSecs(sim.roxtimeSecs);
    setHyroxNotes(sim.notes || "");
    toast.info("Simulation chargée dans le formulaire.");
  };

  const handleDeleteHyroxSimulation = (id: string) => {
    const updated = loggedHyroxSimulations.filter((s) => s.id !== id);
    setLoggedHyroxSimulations(updated);
    localStorage.setItem("zm_logged_hyrox_sims", JSON.stringify(updated));
    toast.info("Simulation supprimée");
  };

  // Timer format
  const timerMins = Math.floor(timeLeft / 60);
  const timerSecs = timeLeft % 60;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* SECTION TITLE & MODULE STATUS BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest">
            PERFORMANCE & RECORDS
          </p>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Mes Performances & <span className="text-[#f59e0b]">PRs</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Suivi en temps réel de tes charges maximales, allures de course et simulateur Hyrox.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#092218] px-4 py-1.5 text-xs font-bold text-[#10b981]">
            <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
            Module Activé
          </span>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS (5 TABS EXACTLY MATCHING SCREENSHOTS) */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 rounded-2xl border border-zinc-800 bg-[#0d0d0f] p-1.5 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab("musculation")}
          className={`whitespace-nowrap rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "musculation"
              ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/50"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Dumbbell size={16} /> Gym & Musculation (PRs)
        </button>

        <button
          onClick={() => setActiveTab("hybrid")}
          className={`whitespace-nowrap rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "hybrid"
              ? "bg-[#f59e0b] text-black shadow-lg shadow-amber-950/50"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Zap size={16} className={activeTab === "hybrid" ? "text-black" : "text-amber-400"} />
          ⚡ Hybrid Athlete Track
        </button>

        <button
          onClick={() => setActiveTab("running")}
          className={`whitespace-nowrap rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "running"
              ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/50"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Gauge size={16} /> Running & Allure (Pace)
        </button>

        <button
          onClick={() => setActiveTab("hyrox")}
          className={`whitespace-nowrap rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "hyrox"
              ? "bg-[#f59e0b] text-black shadow-lg shadow-amber-950/50"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Flame size={16} className={activeTab === "hyrox" ? "text-black" : "text-orange-500"} />
          Hyrox 8 Stations
        </button>

        <button
          onClick={() => setActiveTab("timer")}
          className={`whitespace-nowrap rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "timer"
              ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/50"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Clock size={16} /> WOD & Metcon Timer
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GYM & MUSCULATION (LOG A SET, PR BOARD, HISTORY)  */}
      {/* ========================================================= */}
      {activeTab === "musculation" && (
        <div className="space-y-8">
          {/* CARD 1: LOG A SET FORM */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Log a Set (Musculation & Force)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Toutes les charges en direct avec calcul automatique du 1RM
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-4 py-1.5 rounded-full border border-zinc-800 bg-[#18181b] text-zinc-400">
                {isNewPR
                  ? "🔥 Nouveau PR potentiel !"
                  : currentBest1RM > 0
                  ? `PR Actuel: ${currentBest1RM} kg`
                  : "Aucun PR encore sur cet exercice"}
              </span>
            </div>

            {/* 1. SELECT EXERCISES (ENGLISH DIRECTORY) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  1. SELECT EXERCISES (ENGLISH DIRECTORY)
                </label>

                <button
                  type="button"
                  onClick={() => setShowCustomModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition"
                >
                  <Plus size={14} /> Add Custom Exercise
                </button>
              </div>

              {/* CATEGORY TAGS */}
              <div className="flex flex-wrap gap-2">
                {categoryList.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#dc2626] text-white shadow-md shadow-red-950/50"
                        : "bg-[#18181b] text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* SEARCH & SELECT DROPDOWN */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    placeholder="Search exercise (e.g. Bench, Squat, Pull-ups...)"
                    className="w-full rounded-xl bg-[#121214] border border-zinc-800 pl-10 pr-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="w-full rounded-xl bg-[#121214] border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white font-bold outline-none focus:border-red-500"
                >
                  {filteredExercises.map((ex, idx) => (
                    <option key={idx} value={ex.name}>
                      {ex.name} {ex.isBigCompound ? "[Compound]" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. WEIGHT & REPS CONTROLS */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* WEIGHT SECTION */}
              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    WEIGHT (KG)
                  </span>
                  <span className="text-3xl font-black text-white">
                    {weight} <span className="text-zinc-500 text-sm font-normal">kg</span>
                  </span>
                </div>

                {/* QUICK ADJUSTMENT BUTTONS */}
                <div className="grid grid-cols-6 gap-1.5 text-xs font-bold">
                  {[-5, -2.5, -1, 1, 2.5, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => adjustWeight(val)}
                      className="rounded-lg border border-zinc-800 bg-[#18181b] py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                    >
                      {val > 0 ? `+${val}` : val}
                    </button>
                  ))}
                </div>

                {/* DIRECT NUMBER CONTROL STEPPER */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustWeight(-1)}
                    className="h-10 w-12 rounded-xl bg-zinc-800 text-white font-black hover:bg-zinc-700 transition flex items-center justify-center text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-center rounded-xl bg-black border border-zinc-800 py-2 text-lg font-black text-white outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => adjustWeight(1)}
                    className="h-10 w-12 rounded-xl bg-zinc-800 text-white font-black hover:bg-zinc-700 transition flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* REPS SECTION */}
              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    REPS
                  </span>
                  <span className="text-3xl font-black text-white">
                    {reps} <span className="text-zinc-500 text-sm font-normal">reps</span>
                  </span>
                </div>

                {/* QUICK REPS BUTTONS */}
                <div className="grid grid-cols-6 gap-1.5 text-xs font-bold">
                  {[1, 3, 5, 8, 10, 12].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReps(r)}
                      className={`rounded-lg py-2 transition border ${
                        reps === r
                          ? "bg-[#dc2626] text-white border-red-500 font-bold"
                          : "border-zinc-800 bg-[#18181b] text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* DIRECT STEPPER FOR REPS */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setReps((r) => Math.max(1, r - 1))}
                    className="h-10 w-12 rounded-xl bg-zinc-800 text-white font-black hover:bg-zinc-700 transition flex items-center justify-center text-lg"
                  >
                    -
                  </button>
                  <div className="w-full text-center py-2 text-lg font-black text-white rounded-xl bg-black border border-zinc-800">
                    {reps}
                  </div>
                  <button
                    type="button"
                    onClick={() => setReps((r) => r + 1)}
                    className="h-10 w-12 rounded-xl bg-zinc-800 text-white font-black hover:bg-zinc-700 transition flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 3. RPE SLIDER & EPLEY ESTIMATED 1RM DISPLAY */}
            <div className="grid lg:grid-cols-2 gap-6 pt-2">
              {/* RPE SLIDER */}
              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-zinc-400">
                    RPE (RATE OF PERCEIVED EXERTION)
                  </span>
                  <span className="text-xs font-bold text-red-500">
                    RPE {rpe}
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.5"
                  value={rpe}
                  onChange={(e) => setRpe(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                  <span>6 (Warmup)</span>
                  <span>8 (2 reps in reserve)</span>
                  <span>10 (Absolute failure)</span>
                </div>
              </div>

              {/* ESTIMATED 1RM GOLD BOX */}
              <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-[#0a0a0c] to-black p-5 flex items-center justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 rounded-full bg-amber-500/20 px-2.5 py-0.5 border border-amber-500/30">
                      🔥 Potential New PR !
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    {calculated1RM} <span className="text-[#f59e0b] text-xl">kg</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Formula: Weight × (1 + Reps / 30)
                  </p>
                </div>

                <div className="h-12 w-12 rounded-2xl bg-[#f59e0b] flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20 shrink-0">
                  <Trophy size={24} />
                </div>
              </div>
            </div>

            {/* 4. NOTES & SUBMIT BUTTON */}
            <div className="space-y-4 pt-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes optionnelles (tempo 3-1-1, sans ceinture, sensations...)"
                className="w-full rounded-xl bg-[#08080a] border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={handleLogSet}
                className="w-full rounded-xl bg-[#dc2626] hover:bg-red-700 py-4 font-black text-white text-base transition shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Valider la série & Enregistrer
              </button>
            </div>
          </div>

          {/* CARD 2: PERSONAL RECORDS BOARD (PR BOARD) */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#f59e0b]">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Personal Records Board (PR Board)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tes records personnels enregistrés sur tes mouvements
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#f59e0b]">
                {prBoardList.length} Records enregistrés
              </span>
            </div>

            {prBoardList.length === 0 ? (
              <div className="py-12 border border-dashed border-zinc-800 bg-[#08080a] rounded-2xl text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#f59e0b] mx-auto">
                  <Trophy size={24} />
                </div>
                <h4 className="text-base font-black text-white">
                  Ton PR Board est encore vierge
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Enregistre ta première série ci-dessus pour débloquer automatiquement tes cartes de records personnels et ton 1RM calculé !
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {prBoardList.map((pr) => (
                  <div
                    key={pr.id}
                    className="rounded-2xl border border-amber-500/30 bg-[#08080a] p-5 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">
                          {pr.category}
                        </span>
                        <h4 className="font-black text-white text-base mt-0.5">
                          {pr.exercise}
                        </h4>
                      </div>
                      <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-[#f59e0b] text-xs font-black">
                        1RM
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {pr.estimated1RM} <span className="text-[#f59e0b] text-lg">kg</span>
                      </span>
                      <span className="text-xs text-zinc-400">
                        ({pr.weight}kg × {pr.reps} reps)
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[11px] text-zinc-500">
                      <span>RPE {pr.rpe}</span>
                      <span>
                        {new Date(pr.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CARD 3: HISTORIQUE DES SÉRIES */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Historique des Séries
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Toutes tes séries enregistrées
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-zinc-400">
                {loggedSets.length} séries enregistrées
              </span>
            </div>

            {loggedSets.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                Aucune série enregistrée pour l'instant. Rentre tes barres du jour !
              </div>
            ) : (
              <div className="space-y-3">
                {loggedSets.map((set) => (
                  <div
                    key={set.id}
                    className="rounded-2xl border border-zinc-800 bg-[#08080a] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-white text-base">
                          {set.exercise}
                        </span>
                        <span className="text-[10px] font-bold text-red-400 rounded-full bg-red-500/10 px-2 py-0.5 border border-red-500/20">
                          {set.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-zinc-300 mt-1">
                        <span className="font-bold text-white">
                          {set.weight} kg × {set.reps} reps
                        </span>
                        <span>RPE: {set.rpe}</span>
                        <span className="text-[#f59e0b] font-bold">
                          Est. 1RM: {set.estimated1RM} kg
                        </span>
                      </div>

                      {set.notes && (
                        <p className="text-xs text-zinc-400 mt-1 italic">
                          "{set.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[11px] text-zinc-500">
                        {new Date(set.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <button
                        onClick={() => handleDeleteSet(set.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: HYBRID ATHLETE TRACK                               */}
      {/* ========================================================= */}
      {activeTab === "hybrid" && (
        <div className="space-y-8">
          {/* HEADER BANNER */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-black text-[#f59e0b]">
                  ⚡ HYBRID ATHLETE STANDARDS & SCORECARD
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white">
                  Hybrid Training <span className="text-[#f59e0b]">Track</span>
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Le standard de l'athlète hybride moderne : soulever lourd (Squat, Bench, Deadlift, Tractions lestées) tout en maintenant une vitesse et endurance d'élite (5K, 10K, Semi-Marathon, Hyrox & Rameur).
                </p>
              </div>

              {/* RIGHT STATUT CARD */}
              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-3 min-w-[260px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  STATUT ATHLÈTE HYBRIDE
                </p>
                <h4 className="text-2xl font-black text-white">
                  HYBRID INITIATE
                </h4>
                <p className="text-xs text-zinc-500">
                  Record your first strength & running PRs
                </p>
                <div className="text-sm font-bold text-zinc-300">
                  Total SBD : <span className="text-white">--</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("musculation")}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-800 transition flex items-center justify-center gap-2"
                >
                  ✏️ Mettre à jour mes repères
                </button>
              </div>
            </div>

            {/* PROGRESS BARS AT BOTTOM OF BANNER */}
            <div className="grid sm:grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-300">⚡ Pilier Force & Charges</span>
                  <span className="text-[#f59e0b]">0 / 500 pts</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-[#f59e0b] w-0" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-300">⚡ Pilier Cardio, Running & Hyrox</span>
                  <span className="text-[#f59e0b]">0 / 500 pts</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-red-600 w-0" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: PILIER FORCE ATHLÉTIQUE */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#f59e0b]">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Pilier Force Athlétique (Heavy Strength)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Les 6 mouvements fondamentaux de l'athlète hybride
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-[#f59e0b]">
                Total SBD : 0 kg
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Barbell Back Squat", badge: "LEGS", target: "Objectif Hybride : 1.75x - 2x Poids du corps" },
                { name: "Barbell Bench Press", badge: "CHEST", target: "Objectif Hybride : 1.25x - 1.5x Poids du corps" },
                { name: "Conventional Deadlift", badge: "BACK", target: "Objectif Hybride : 2x - 2.5x Poids du corps" },
                { name: "Overhead Press (OHP)", badge: "SHOULDERS", target: "Objectif Hybride : 0.75x - 1x Poids du corps" },
                { name: "Weighted Pull-ups", badge: "BACK", target: "Objectif Hybride : +30 kg à +45 kg" },
                { name: "Weighted Dips", badge: "CHEST/TRICEPS", target: "Objectif Hybride : +40 kg à +60 kg" },
              ].map((m, idx) => {
                const exPr = prBoardMap.get(m.name);
                return (
                  <div key={idx} className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-zinc-400 rounded-full bg-zinc-800 px-2.5 py-0.5">
                        {m.badge}
                      </span>
                      <Trophy size={16} className="text-[#f59e0b]" />
                    </div>

                    <h4 className="font-black text-white text-base">{m.name}</h4>

                    <div className="text-2xl font-black text-white">
                      {exPr ? `${exPr.estimated1RM} kg` : "-- kg"}
                    </div>

                    <p className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-2">
                      {m.target}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: PILIER RUNNING & CARDIO ENGINE */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
              <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Pilier Running & Cardio Engine
                </h3>
                <p className="text-xs text-zinc-400">
                  Des sprints lactiques aux marathons complets
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: "1 KM Time Trial", target: "Elite: < 3:20" },
                { name: "5 KM Time Trial", target: "Elite: < 20:00" },
                { name: "10 KM Time Trial", target: "Elite: < 43:00" },
                { name: "Half-Marathon (21.1K)", target: "Elite: < 1h35" },
                { name: "Full Marathon (42.2K)", target: "Elite: < 3h45" },
              ].map((r, idx) => (
                <div key={idx} className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-zinc-400 rounded-full bg-zinc-800 px-2.5 py-0.5">
                      RUNNING
                    </span>
                    <Clock size={16} className="text-red-500" />
                  </div>

                  <h4 className="font-black text-white text-sm">{r.name}</h4>

                  <div className="text-xl font-black text-white">--:--</div>

                  <p className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-2">
                    {r.target}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: HYROX RACE & ERGOMETER STANDARDS (GOLD FRAME) */}
          <div className="rounded-[2rem] border border-amber-500/40 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#f59e0b]">
                <Flame size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Hyrox Race & Ergometer Standards
                </h3>
                <p className="text-xs text-zinc-400">
                  Machines d'intensité pure (SkiErg, Rowing & Course officielle)
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-amber-500/50 bg-[#08080a] p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-[#f59e0b] text-xs uppercase">
                    HYROX RACE (CHRONO OFFICIEL)
                  </h4>
                  <Flame size={16} className="text-[#f59e0b]" />
                </div>
                <div className="text-2xl font-black text-white">--:--</div>
                <p className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-2">
                  Standard Elite : &lt; 1h08 | Standard Open : &lt; 1h20
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-white text-xs uppercase">
                    CONCEPT2 2000M ROWING
                  </h4>
                  <Activity size={16} className="text-red-500" />
                </div>
                <div className="text-2xl font-black text-white">--:--</div>
                <p className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-2">
                  Standard Elite : &lt; 6:40 | Bon niveau : &lt; 7:15
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-white text-xs uppercase">
                    CONCEPT2 1000M SKIERG
                  </h4>
                  <Clock size={16} className="text-[#f59e0b]" />
                </div>
                <div className="text-2xl font-black text-white">--:--</div>
                <p className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-2">
                  Standard Elite : &lt; 3:20 | Bon niveau : &lt; 3:55
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: RUNNING & ALLURE (PACE CALCULATOR & LOGS)           */}
      {/* ========================================================= */}
      {activeTab === "running" && (
        <div className="space-y-8">
          {/* TOP 4 METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-zinc-400">
                  VOLUME TOTAL
                </span>
                <MapPin size={16} className="text-red-500" />
              </div>
              <div className="text-2xl font-black text-white">
                {loggedRuns.reduce((acc, r) => acc + r.distance, 0)} <span className="text-sm font-normal text-zinc-400">km</span>
              </div>
              <p className="text-[11px] text-zinc-500">{loggedRuns.length} séances cumulées</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-zinc-400">
                  RECORD 5 KM
                </span>
                <Clock size={16} className="text-[#f59e0b]" />
              </div>
              <div className="text-2xl font-black text-white">
                {loggedRuns.filter(r => r.distance === 5).length > 0 
                  ? `${Math.min(...loggedRuns.filter(r => r.distance === 5).map(r => r.minutes))}:${Math.min(...loggedRuns.filter(r => r.distance === 5).map(r => r.seconds)) < 10 ? '0' : ''}${Math.min(...loggedRuns.filter(r => r.distance === 5).map(r => r.seconds))}`
                  : "--:--"}
              </div>
              <p className="text-[11px] text-[#f59e0b]">
                {loggedRuns.filter(r => r.distance === 5).length > 0 ? "Meilleur chrono" : "Aucun 5k validé"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-zinc-400">
                  RECORD 10 KM
                </span>
                <Clock size={16} className="text-[#f59e0b]" />
              </div>
              <div className="text-2xl font-black text-white">
                {loggedRuns.filter(r => r.distance === 10).length > 0 
                  ? `${Math.min(...loggedRuns.filter(r => r.distance === 10).map(r => r.minutes))}:${Math.min(...loggedRuns.filter(r => r.distance === 10).map(r => r.seconds)) < 10 ? '0' : ''}${Math.min(...loggedRuns.filter(r => r.distance === 10).map(r => r.seconds))}`
                  : "--:--"}
              </div>
              <p className="text-[11px] text-[#f59e0b]">
                {loggedRuns.filter(r => r.distance === 10).length > 0 ? "Meilleur chrono" : "Aucun 10k validé"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-zinc-400">
                  VITESSE MAX MOYENNE
                </span>
                <Zap size={16} className="text-red-500" />
              </div>
              <div className="text-2xl font-black text-white">
                {loggedRuns.length > 0 ? `${Math.max(...loggedRuns.map(r => r.speed))} km/h` : "--"}
              </div>
              <p className="text-[11px] text-zinc-500">
                {loggedRuns.length > 0 ? "Record de vitesse" : "En attente"}
              </p>
            </div>
          </div>

          {/* MAIN CARD: ENREGISTRER UNE SÉANCE DE COURSE */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
              <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Enregistrer une Séance de Course
                </h3>
                <p className="text-xs text-zinc-400">
                  Calcul instantané de ton allure (min/km) et de ta vitesse avec paramétrage détaillé
                </p>
              </div>
            </div>

            {/* TYPE DE SÉANCE */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                TYPE DE SÉANCE
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "1K Sprint",
                  "5K Tempo",
                  "10K",
                  "Half-Marathon (21.1K)",
                  "Full Marathon (42.2K)",
                  "Long Run",
                  "Intervals",
                  "Recovery",
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRunType(t)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      runType === t
                        ? "bg-[#dc2626] text-white shadow-md shadow-red-950/50"
                        : "bg-[#18181b] text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* DISTANCE & DURÉE GRID */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* DISTANCE BOX */}
              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    DISTANCE (KM)
                  </span>
                  <span className="text-3xl font-black text-white">
                    {runDistance} <span className="text-zinc-500 text-sm font-normal">km</span>
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                  {[
                    { label: "3 km", dist: 3 },
                    { label: "5 km", dist: 5 },
                    { label: "10 km", dist: 10 },
                    { label: "Semi", dist: 21.1 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setRunDistancePreset(preset.label);
                        setRunDistance(preset.dist);
                      }}
                      className={`rounded-xl py-2 transition border ${
                        runDistance === preset.dist
                          ? "bg-[#dc2626] text-white border-red-500 font-bold"
                          : "border-zinc-800 bg-[#18181b] text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  step="0.1"
                  value={runDistance}
                  onChange={(e) => setRunDistance(parseFloat(e.target.value) || 0)}
                  className="w-full text-center rounded-xl bg-black border border-zinc-800 py-3 text-xl font-black text-white outline-none focus:border-red-500"
                />
              </div>

              {/* DURÉE BOX */}
              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    DURÉE (CHRONO)
                  </span>
                  <span className="text-3xl font-black text-white">
                    {runMinutes}:{runSeconds < 10 ? "0" : ""}{runSeconds}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      value={runMinutes}
                      onChange={(e) => setRunMinutes(parseInt(e.target.value) || 0)}
                      className="w-full text-center rounded-xl bg-black border border-zinc-800 py-2.5 text-lg font-black text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1">
                      Secondes
                    </label>
                    <input
                      type="number"
                      value={runSeconds}
                      onChange={(e) => setRunSeconds(parseInt(e.target.value) || 0)}
                      className="w-full text-center rounded-xl bg-black border border-zinc-800 py-2.5 text-lg font-black text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* EXTENDED RUN PARAMETERS (INTERVALS, CADENCE, ELEVATION, SURFACE) */}
            {runType === "Intervals" && (
              <div className="rounded-2xl border border-red-500/30 bg-red-950/10 p-5 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-2">
                  <Zap size={16} /> DÉTAILS DE LA SÉANCE DE FRACTIONNÉ / INTERVALLES
                </span>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      Structure des Fractions
                    </label>
                    <input
                      type="text"
                      value={intervalStructure}
                      onChange={(e) => setIntervalStructure(e.target.value)}
                      placeholder="Ex: 8 x 400m, 5 x 1000m, Pyramide..."
                      className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-2.5 text-xs text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      Repos entre Fractions (Rest)
                    </label>
                    <input
                      type="text"
                      value={intervalRest}
                      onChange={(e) => setIntervalRest(e.target.value)}
                      placeholder="Ex: 60 sec marche, 90 sec trotté..."
                      className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-2.5 text-xs text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  Type de Surface
                </label>
                <select
                  value={runSurface}
                  onChange={(e) => setRunSurface(e.target.value)}
                  className="w-full rounded-xl bg-[#08080a] border border-zinc-800 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-red-500"
                >
                  <option value="Route">Route / Asphalte</option>
                  <option value="Piste 400m">Piste Athlétisme (400m)</option>
                  <option value="Trail">Trail / Sentier / Nature</option>
                  <option value="Tapis">Tapis de Course (Treadmill)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  Dénivelé Positif (+m)
                </label>
                <input
                  type="number"
                  value={runElevation}
                  onChange={(e) => setRunElevation(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl bg-[#08080a] border border-zinc-800 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  Cadence Moyenne (SPM)
                </label>
                <input
                  type="number"
                  value={runCadence}
                  onChange={(e) => setRunCadence(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl bg-[#08080a] border border-zinc-800 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* BOTTOM SUMMARY BOXES */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#f59e0b]">
                  <Clock size={14} /> ALLURE MOYENNE (PACE)
                </div>
                <div className="text-3xl font-black text-white">
                  {formattedPace} <span className="text-xs text-[#f59e0b] font-normal">min/km</span>
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-red-400">
                  <Zap size={14} /> VITESSE MOYENNE
                </div>
                <div className="text-3xl font-black text-white">
                  {runSpeedKmH} <span className="text-xs text-red-400 font-normal">km/h</span>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-zinc-400">
                  <Heart size={14} className="text-red-500" /> FRÉQUENCE CARDIAQUE (BPM)
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={runHr}
                    onChange={(e) => setRunHr(parseInt(e.target.value) || 0)}
                    className="w-24 text-center rounded-lg bg-black border border-zinc-800 py-1.5 text-lg font-black text-white outline-none focus:border-red-500"
                  />
                  <span className="text-xs text-zinc-500 font-bold">bpm moyen</span>
                </div>
              </div>
            </div>

            {/* NOTES & SUBMIT */}
            <div className="space-y-4 pt-2">
              <input
                type="text"
                value={runNotes}
                onChange={(e) => setRunNotes(e.target.value)}
                placeholder="Sensations, météo, chaussures, stratégie de course..."
                className="w-full rounded-xl bg-[#08080a] border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={handleSaveRun}
                className="w-full rounded-xl bg-[#dc2626] hover:bg-red-700 py-4 font-black text-white text-base transition shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Enregistrer la séance de running
              </button>
            </div>
          </div>

          {/* HISTORIQUE DES COURSES */}
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Compass size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Historique des Courses
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold text-zinc-400">
                {loggedRuns.length} sorties
              </span>
            </div>

            {loggedRuns.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                Aucune séance de course enregistrée pour le moment. Enregistre ta première sortie ci-dessus !
              </div>
            ) : (
              <div className="space-y-3">
                {loggedRuns.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-zinc-800 bg-[#08080a] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{r.type}</span>
                        <span className="text-xs text-red-400 font-bold">{r.distance} km</span>
                        {r.hr && <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">{r.hr} bpm</span>}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Pace: <span className="text-[#f59e0b] font-bold">{r.pace} min/km</span> | Vitesse: {r.speed} km/h | Durée: {r.minutes}:{r.seconds < 10 ? "0" : ""}{r.seconds}
                      </div>
                      {r.notes && (
                        <p className="text-[11px] text-zinc-500 mt-1 italic">{r.notes}</p>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500">
                      {new Date(r.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: HYROX 8 STATIONS BENCHMARKS (EXACT UI MATCH)       */}
      {/* ========================================================= */}
      {activeTab === "hyrox" && (
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-amber-500/30 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
            
            {/* TOP HEADER SECTION WITH CHRONO CARD EXACTLY MATCHING SCREENSHOT */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 border-b border-zinc-800/80 pb-6">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 px-3.5 py-1 text-[11px] font-black text-[#f59e0b]">
                  <Flame size={12} /> HYROX OFFICIAL 8 STATIONS TRACKER
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Simulateur & Analyse <span className="text-[#f59e0b]">HYROX</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Suis tes chronos sur les 8 stations officielles avec les charges adaptatives à ta catégorie. Analyse tes splits et estime ton chrono final avec les 8x 1km de run.
                </p>

                {/* CATEGORY SELECTOR PILLS */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block">
                    SÉLECTIONNE TA CATÉGORIE HYROX
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Open Men",
                      "Open Women",
                      "Pro Men",
                      "Pro Women",
                      "Doubles Men",
                      "Doubles Women",
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setHyroxCategory(cat)}
                        className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                          hyroxCategory === cat
                            ? "bg-[#f59e0b] text-black font-black shadow-lg shadow-amber-950/60"
                            : "bg-[#18181b] text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ESTIMATED FINAL CHRONO CARD (TOP RIGHT GOLD FRAME MATCHING SCREENSHOT) */}
              <div className="rounded-2xl border border-amber-500/50 bg-[#08080a] p-5 space-y-3 min-w-[300px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f59e0b]">
                    CHRONO FINAL ESTIMÉ
                  </p>
                  <div className="text-4xl sm:text-5xl font-black text-[#f59e0b] mt-1 font-mono tracking-tight">
                    {formatSecsToMMSS(grandTotalHyroxSecs)}
                  </div>
                </div>

                <div className="text-xs text-zinc-300 space-y-1.5 pt-3 border-t border-zinc-800/80 font-bold">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">8 Stations :</span>
                    <span className="text-white font-mono">{formatSecsToMMSS(totalStationSecs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">8x 1km Run :</span>
                    <span className="text-white font-mono">{formatSecsToMMSS(totalRunSecsCalculated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Roxzone (Transit) :</span>
                    <span className="text-white font-mono">{formatSecsToMMSS(hyroxRoxzoneSecs)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* HEADER FOR 8 STATIONS INPUT GRID */}
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-black text-white uppercase tracking-wider text-sm">
                Saisie des 8 Stations Officielles
              </h4>
              <span className="text-[#f59e0b] font-bold">
                Catégorie active : <span className="underline">{hyroxCategory}</span>
              </span>
            </div>

            {/* 8 OFFICIAL STATIONS GRID (2x4 RESPONSIVE GRID MATCHING SCREENSHOT) */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((stId) => {
                const spec = currentSpecs[stId];
                const stTime = hyroxStationTimes[stId] || { min: 0, sec: 0 };

                return (
                  <div
                    key={stId}
                    className="rounded-2xl border border-zinc-800 bg-[#08080a] p-4 sm:p-5 space-y-3.5 hover:border-amber-500/30 transition shadow-lg"
                  >
                    {/* STATION HEADER BADGE */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-black text-[#f59e0b] bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
                        #{stId}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold text-right">
                        {spec.dist}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-black text-white text-sm sm:text-base">
                        {spec.name.replace(/^#\d+\s*/, '')}
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Charge {hyroxCategory} : <span className="text-zinc-200 font-bold">{spec.charge}</span>
                      </p>
                    </div>

                    {/* TIME INPUT VALIDATION (MIN & SEC STEPPERS) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-500 block">
                        Chrono validé :
                      </label>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 flex items-center bg-black border border-zinc-800 rounded-xl px-2 py-1.5 focus-within:border-amber-500">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={stTime.min || ""}
                            placeholder="00"
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setHyroxStationTimes((prev) => ({
                                ...prev,
                                [stId]: { ...prev[stId], min: val },
                              }));
                            }}
                            className="w-full text-center bg-transparent text-sm font-black text-white outline-none"
                          />
                          <span className="text-[10px] text-zinc-500 font-bold pr-1">min</span>
                        </div>

                        <span className="text-zinc-600 font-black text-lg">:</span>

                        <div className="flex-1 flex items-center bg-black border border-zinc-800 rounded-xl px-2 py-1.5 focus-within:border-amber-500">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={stTime.sec || ""}
                            placeholder="00"
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                              setHyroxStationTimes((prev) => ({
                                ...prev,
                                [stId]: { ...prev[stId], sec: val },
                              }));
                            }}
                            className="w-full text-center bg-transparent text-sm font-black text-white outline-none"
                          />
                          <span className="text-[10px] text-zinc-500 font-bold pr-1">sec</span>
                        </div>
                      </div>
                    </div>

                    {/* BENCHMARK TARGETS */}
                    <div className="border-t border-zinc-800/80 pt-2 flex justify-between text-[10px] text-zinc-500">
                      <span>Cible Pro: <strong className="text-amber-400">{spec.targetPro}</strong></span>
                      <span>Cible Open: <strong className="text-zinc-300">{spec.targetOpen}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PARAMÈTRES DE COURSE (8 x 1Km Run) & TRANSITIONS (SLIDERS SECTION) */}
            <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-6 space-y-6">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Activity size={18} className="text-[#f59e0b]" />
                Paramètres de Course (8 x 1Km Run) & Transitions
              </h4>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* PACE SLIDER BOX */}
                <div className="rounded-xl border border-zinc-800/80 bg-black/60 p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-zinc-400">
                      ALLURE MOYENNE COURSES (PACE)
                    </span>
                    <span className="text-lg font-black text-[#f59e0b] font-mono">
                      {formatPaceSecs(hyroxRunPaceSecs)} <span className="text-xs text-zinc-400 font-normal">/km</span>
                    </span>
                  </div>

                  <input
                    type="range"
                    min="180"
                    max="420"
                    step="5"
                    value={hyroxRunPaceSecs}
                    onChange={(e) => setHyroxRunPaceSecs(parseInt(e.target.value))}
                    className="w-full accent-[#f59e0b] cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  />

                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                    <span>Rapide (3:30/km)</span>
                    <span>Moyen (4:45/km)</span>
                    <span>Prudent (7:00/km)</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
                    Temps total de course estimé : <strong className="text-white font-mono">{formatSecsToMMSS(totalRunSecsCalculated)}</strong>
                  </p>
                </div>

                {/* ROXZONE TRANSITIONS SLIDER BOX */}
                <div className="rounded-xl border border-zinc-800/80 bg-black/60 p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-zinc-400">
                      TEMPS TOTAL ROXZONE (TRANSITIONS)
                    </span>
                    <span className="text-lg font-black text-[#f59e0b] font-mono">
                      {formatSecsToMMSS(hyroxRoxzoneSecs)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="120"
                    max="720"
                    step="15"
                    value={hyroxRoxzoneSecs}
                    onChange={(e) => setHyroxRoxzoneSecs(parseInt(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  />

                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                    <span>Rapide (2 min)</span>
                    <span>Moyen (6 min)</span>
                    <span>Prudent (12 min)</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
                    Moyenne observée en compétition Hyrox officielle : 4 à 7 minutes.
                  </p>
                </div>
              </div>

              {/* NOTES & STRATÉGIE DE COURSE */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-zinc-400 block">
                  NOTES & STRATÉGIE DE COURSE
                </label>
                <input
                  type="text"
                  value={hyroxNotes}
                  onChange={(e) => setHyroxNotes(e.target.value)}
                  placeholder="Ex: Stratégie négative split, gestion des bras sur le SkiErg, pas de précipitation sur les Burpees..."
                  className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* SAVE SIMULATION BUTTON */}
              <button
                type="button"
                onClick={handleSaveHyroxSimulation}
                className="w-full rounded-xl bg-gradient-to-r from-[#f59e0b] to-amber-600 hover:from-amber-500 hover:to-amber-700 py-4 font-black text-black text-base transition shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2"
              >
                <Flame size={20} /> Enregistrer cette Simulation Hyrox
              </button>
            </div>

            {/* SAVED HYROX SIMULATIONS HISTORY */}
            {loggedHyroxSimulations.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-6 space-y-4">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Simulations Hyrox Enregistrées ({loggedHyroxSimulations.length})</span>
                  <span className="text-xs text-[#f59e0b]">Sauvegardées localement</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  {loggedHyroxSimulations.map((sim) => (
                    <div
                      key={sim.id}
                      className="rounded-xl border border-zinc-800 bg-black/60 p-4 space-y-3 relative hover:border-amber-500/40 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black text-[#f59e0b] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            Hyrox {sim.category}
                          </span>
                          <div className="text-2xl font-black text-white mt-1 font-mono">
                            {sim.totalTime}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleLoadHyroxSimulation(sim)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                          >
                            Charger
                          </button>
                          <button
                            onClick={() => handleDeleteHyroxSimulation(sim.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-400 space-y-1 border-t border-zinc-800/80 pt-2 font-mono">
                        <div>Pace: {formatPaceSecs(sim.runPaceSecs)}/km | Roxzone: {formatSecsToMMSS(sim.roxtimeSecs)}</div>
                        {sim.notes && <p className="text-zinc-500 italic font-sans text-[10px]">"{sim.notes}"</p>}
                      </div>

                      <div className="text-[10px] text-zinc-600 text-right">
                        {new Date(sim.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: WOD & METCON TIMER                                 */}
      {/* ========================================================= */}
      {activeTab === "timer" && (
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Chronomètre WOD & Intervalles
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Timer pour tes séances AMRAP, EMOM, Tabata et For Time
                  </p>
                </div>
              </div>

              <div className="flex rounded-xl bg-[#08080a] border border-zinc-800 p-1">
                {(["amrap", "emom", "fortime"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setTimerMode(m);
                      setIsTimerRunning(false);
                      const dur = m === "emom" ? 600 : 900;
                      setTimerDuration(dur);
                      setTimeLeft(dur);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
                      timerMode === m ? "bg-[#dc2626] text-white" : "text-zinc-400"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-12 border border-zinc-800 rounded-2xl bg-[#08080a] text-center space-y-6">
              <div className="text-6xl sm:text-8xl font-black text-white tracking-widest font-mono">
                {timerMins < 10 ? "0" : ""}
                {timerMins}:{timerSecs < 10 ? "0" : ""}
                {timerSecs}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`rounded-2xl px-8 py-4 font-black text-white text-base transition flex items-center gap-2 shadow-lg ${
                    isTimerRunning
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-[#dc2626] hover:bg-red-700 shadow-red-950/50"
                  }`}
                >
                  {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                  {isTimerRunning ? "PAUSE" : "DÉMARRER"}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(timerDuration);
                  }}
                  className="rounded-2xl bg-zinc-800 hover:bg-zinc-700 px-6 py-4 font-bold text-white text-base transition flex items-center gap-2"
                >
                  <RotateCcw size={20} /> REINITIALISER
                </button>
              </div>
            </div>

            {/* FORM ENREGISTRER UN SCORE WOD */}
            <div className="rounded-2xl border border-zinc-800 bg-[#08080a] p-6 space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                Enregistrer un Score WOD / Cross-Training
              </h4>

              <div className="grid sm:grid-cols-3 gap-3">
                <select
                  value={wodType}
                  onChange={(e) => setWodType(e.target.value)}
                  className="rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white font-bold outline-none focus:border-red-500"
                >
                  <option value="AMRAP">AMRAP</option>
                  <option value="EMOM">EMOM</option>
                  <option value="For Time">For Time</option>
                  <option value="Tabata">Tabata</option>
                  <option value="Benchmark">Benchmark</option>
                  <option value="Hero WOD">Hero WOD</option>
                </select>

                <input
                  type="text"
                  value={wodName}
                  onChange={(e) => setWodName(e.target.value)}
                  placeholder="Nom du WOD (ex: Cindy, Fran, WOD du Jour)"
                  className="rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
                />

                <input
                  type="text"
                  value={wodScore}
                  onChange={(e) => setWodScore(e.target.value)}
                  placeholder="Score / Résultat (ex: 18 rounds + 5 reps)"
                  className="rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
                />
              </div>

              <input
                type="text"
                value={wodDetails}
                onChange={(e) => setWodDetails(e.target.value)}
                placeholder="Détails mouvements & charges (ex: 5 Pull-ups, 10 Push-ups, 15 Squats...)"
                className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={handleSaveWod}
                className="w-full rounded-xl bg-[#dc2626] hover:bg-red-700 py-3 font-black text-white text-sm transition shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Enregistrer ce WOD
              </button>
            </div>

            {/* WOD HISTORY */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                WODs & Metcons Précédents ({loggedWods.length})
              </h4>
              {loggedWods.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500 border border-zinc-800 rounded-xl bg-[#08080a]">
                  Aucun WOD enregistré pour l'instant. Valide ton premier workout !
                </div>
              ) : (
                <div className="space-y-2">
                  {loggedWods.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-xl border border-zinc-800 bg-[#08080a] p-3 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-red-500 mr-2">[{w.type}]</span>
                        <span className="font-black text-white">{w.name}</span>
                        <span className="text-zinc-400 ml-3">Score: {w.score}</span>
                      </div>
                      <span className="text-zinc-500">
                        {new Date(w.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD CUSTOM EXERCISE */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0c0c0e] p-6 space-y-5 shadow-2xl">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Plus className="text-red-500" size={20} /> Add Custom Exercise
            </h3>

            <form onSubmit={handleAddCustomExercise} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: Bulgarian Split Squat, Muscle-Up..."
                  className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Target Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-red-500"
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Legs">Legs</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                  <option value="Core & Abs">Core & Abs</option>
                  <option value="Cross-training">Cross-Training</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="w-1/2 rounded-xl border border-zinc-800 bg-[#18181b] py-3 text-xs font-bold text-white hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-[#dc2626] hover:bg-red-700 py-3 text-xs font-black text-white transition shadow-md shadow-red-950/50"
                >
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPerformancePage;
