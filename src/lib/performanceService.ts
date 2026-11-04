import { api } from "./api";

export interface LoggedSet {
  id: string;
  userId?: string;
  exercise: string;
  category: string;
  weight: number;
  reps: number;
  rpe: number;
  estimated1RM: number;
  notes?: string;
  date: string;
}

export interface RunLog {
  id: string;
  userId?: string;
  type: string;
  distance: number;
  minutes: number;
  seconds: number;
  pace: string;
  speed: number;
  hr?: number;
  notes?: string;
  surface?: string;
  elevation?: number;
  cadence?: number;
  intervalStructure?: string;
  intervalRest?: string;
  date: string;
}

export interface HyroxSimulationLog {
  id: string;
  userId?: string;
  category: string;
  stationTimes: Record<number, { min: number; sec: number }>;
  runPaceSecs: number;
  roxtimeSecs: number;
  totalTime: string;
  notes: string;
  date: string;
}

export interface WodLog {
  id: string;
  userId?: string;
  type: string;
  name: string;
  score: string;
  details?: string;
  date: string;
}

export interface AthletePerformanceData {
  userId: string;
  loggedSets: LoggedSet[];
  loggedRuns: RunLog[];
  loggedHyrox: HyroxSimulationLog[];
  loggedWods: WodLog[];
  consigne: string;
  trackingEnabled: boolean;
}

// Get current user ID from storage
export const getCurrentUserId = (): string => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      return u._id || u.id || u.email || "a1";
    }
  } catch (e) {
    console.error("Error reading current user ID", e);
  }
  return "a1";
};

// Key helper for storage fallback
const getStorageKey = (key: string, userId?: string) => {
  const uid = userId || getCurrentUserId();
  return `zm_${key}_${uid}`;
};

// Global Store for all users (for admin sync across sessions)
const ALL_PERF_KEY = "zm_all_athletes_performance";

const getAllAthletesStore = (): Record<string, AthletePerformanceData> => {
  try {
    const raw = localStorage.getItem(ALL_PERF_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveAthleteToStore = (userId: string, data: Partial<AthletePerformanceData>) => {
  const store = getAllAthletesStore();
  const existing = store[userId] || {
    userId,
    loggedSets: [],
    loggedRuns: [],
    loggedHyrox: [],
    loggedWods: [],
    consigne: "",
    trackingEnabled: true,
  };

  store[userId] = { ...existing, ...data };
  localStorage.setItem(ALL_PERF_KEY, JSON.stringify(store));
};

// Fetch User Performance Data (API + Local Storage Sync)
export const fetchUserPerformance = async (
  userId?: string
): Promise<AthletePerformanceData> => {
  const uid = userId || getCurrentUserId();

  // 1. Try Backend API call
  try {
    const res = await api.get(`/performance/user/${uid}`);
    if (res.data) {
      const apiData: AthletePerformanceData = {
        userId: uid,
        loggedSets: res.data.loggedSets || [],
        loggedRuns: res.data.loggedRuns || [],
        loggedHyrox: res.data.loggedHyrox || [],
        loggedWods: res.data.loggedWods || [],
        consigne: res.data.consigne || "",
        trackingEnabled: res.data.trackingEnabled !== false,
      };
      // Cache locally
      saveAthleteToStore(uid, apiData);
      return apiData;
    }
  } catch (err) {
    // API endpoint might not be on backend server or loading error, fallback to local store
  }

  // 2. Local Storage Fallback
  const store = getAllAthletesStore();
  if (store[uid]) {
    return store[uid];
  }

  // Check individual keys
  const savedSets = localStorage.getItem(getStorageKey("logged_sets", uid)) || localStorage.getItem("zm_logged_sets");
  const savedRuns = localStorage.getItem(getStorageKey("logged_runs", uid)) || localStorage.getItem("zm_logged_runs");
  const savedHyrox = localStorage.getItem(getStorageKey("logged_hyrox_sims", uid)) || localStorage.getItem("zm_logged_hyrox_sims");
  const savedWods = localStorage.getItem(getStorageKey("logged_wods", uid)) || localStorage.getItem("zm_logged_wods");
  const savedConsigne = localStorage.getItem(`zm_consigne_${uid}`) || localStorage.getItem("zm_coach_consigne");

  const fallbackData: AthletePerformanceData = {
    userId: uid,
    loggedSets: savedSets ? JSON.parse(savedSets) : [],
    loggedRuns: savedRuns ? JSON.parse(savedRuns) : [],
    loggedHyrox: savedHyrox ? JSON.parse(savedHyrox) : [],
    loggedWods: savedWods ? JSON.parse(savedWods) : [],
    consigne: savedConsigne || "",
    trackingEnabled: true,
  };

  saveAthleteToStore(uid, fallbackData);
  return fallbackData;
};

// Save Logged Set (Musculation & Force)
export const saveLoggedSet = async (set: LoggedSet, userId?: string): Promise<LoggedSet[]> => {
  const uid = userId || getCurrentUserId();
  const current = await fetchUserPerformance(uid);
  const updatedSets = [set, ...current.loggedSets];

  // Try API
  try {
    await api.post(`/performance/set`, { userId: uid, set });
  } catch (e) {
    // Silent fail over to store
  }

  // Sync Local Storage
  localStorage.setItem(getStorageKey("logged_sets", uid), JSON.stringify(updatedSets));
  localStorage.setItem("zm_logged_sets", JSON.stringify(updatedSets));
  saveAthleteToStore(uid, { loggedSets: updatedSets });

  return updatedSets;
};

// Delete Logged Set
export const deleteLoggedSet = async (setId: string, userId?: string): Promise<LoggedSet[]> => {
  const uid = userId || getCurrentUserId();
  const current = await fetchUserPerformance(uid);
  const updatedSets = current.loggedSets.filter((s) => s.id !== setId);

  try {
    await api.delete(`/performance/set/${setId}`);
  } catch (e) {
    // Ignore
  }

  localStorage.setItem(getStorageKey("logged_sets", uid), JSON.stringify(updatedSets));
  localStorage.setItem("zm_logged_sets", JSON.stringify(updatedSets));
  saveAthleteToStore(uid, { loggedSets: updatedSets });

  return updatedSets;
};

// Save Run Log
export const saveRunLog = async (run: RunLog, userId?: string): Promise<RunLog[]> => {
  const uid = userId || getCurrentUserId();
  const current = await fetchUserPerformance(uid);
  const updatedRuns = [run, ...current.loggedRuns];

  try {
    await api.post(`/performance/run`, { userId: uid, run });
  } catch (e) {
    // Ignore
  }

  localStorage.setItem(getStorageKey("logged_runs", uid), JSON.stringify(updatedRuns));
  localStorage.setItem("zm_logged_runs", JSON.stringify(updatedRuns));
  saveAthleteToStore(uid, { loggedRuns: updatedRuns });

  return updatedRuns;
};

// Delete Run Log
export const deleteRunLog = async (runId: string, userId?: string): Promise<RunLog[]> => {
  const uid = userId || getCurrentUserId();
  const current = await fetchUserPerformance(uid);
  const updatedRuns = current.loggedRuns.filter((r) => r.id !== runId);

  try {
    await api.delete(`/performance/run/${runId}`);
  } catch (e) {
    // Ignore
  }

  localStorage.setItem(getStorageKey("logged_runs", uid), JSON.stringify(updatedRuns));
  localStorage.setItem("zm_logged_runs", JSON.stringify(updatedRuns));
  saveAthleteToStore(uid, { loggedRuns: updatedRuns });

  return updatedRuns;
};

// Save Hyrox Simulation
export const saveHyroxSimulation = async (sim: HyroxSimulationLog, userId?: string): Promise<HyroxSimulationLog[]> => {
  const uid = userId || getCurrentUserId();
  const current = await fetchUserPerformance(uid);
  const updatedHyrox = [sim, ...current.loggedHyrox];

  try {
    await api.post(`/performance/hyrox`, { userId: uid, simulation: sim });
  } catch (e) {
    // Ignore
  }

  localStorage.setItem(getStorageKey("logged_hyrox_sims", uid), JSON.stringify(updatedHyrox));
  localStorage.setItem("zm_logged_hyrox_sims", JSON.stringify(updatedHyrox));
  saveAthleteToStore(uid, { loggedHyrox: updatedHyrox });

  return updatedHyrox;
};

// Save WOD Log
export const saveWodLog = async (wod: WodLog, userId?: string): Promise<WodLog[]> => {
  const uid = userId || getCurrentUserId();
  const current = await fetchUserPerformance(uid);
  const updatedWods = [wod, ...current.loggedWods];

  try {
    await api.post(`/performance/wod`, { userId: uid, wod });
  } catch (e) {
    // Ignore
  }

  localStorage.setItem(getStorageKey("logged_wods", uid), JSON.stringify(updatedWods));
  localStorage.setItem("zm_logged_wods", JSON.stringify(updatedWods));
  saveAthleteToStore(uid, { loggedWods: updatedWods });

  return updatedWods;
};

// Save Coach Consigne for Athlete
export const saveCoachConsigne = async (userId: string, consigne: string): Promise<void> => {
  try {
    await api.post(`/performance/consigne`, { userId, consigne });
  } catch (e) {
    // Ignore
  }

  localStorage.setItem(`zm_consigne_${userId}`, consigne);
  localStorage.setItem("zm_coach_consigne", consigne);
  saveAthleteToStore(userId, { consigne });
};

// Toggle Tracking Module Access for Athlete
export const toggleTrackingAccess = async (userId: string, enabled: boolean): Promise<boolean> => {
  try {
    await api.patch(`/performance/toggle-tracking`, { userId, enabled });
  } catch (e) {
    // Ignore
  }

  localStorage.setItem(`zm_tracking_${userId}`, String(enabled));
  saveAthleteToStore(userId, { trackingEnabled: enabled });
  return enabled;
};
