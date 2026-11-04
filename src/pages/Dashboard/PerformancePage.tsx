import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Users,
  Search,
  Send,
  Trophy,
  Gauge,
  Clock,
  Zap,
  Flame,
  CheckCircle2,
  XCircle,
  Dumbbell,
  Activity,
  Calendar,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchUserPerformance,
  saveCoachConsigne,
  toggleTrackingAccess,
  AthletePerformanceData,
  LoggedSet,
  RunLog,
  HyroxSimulationLog,
} from "@/lib/performanceService";

interface Athlete {
  id: string;
  fullName: string;
  email: string;
  status: "ACTIF" | "INACTIF";
  trackingEnabled: boolean;
}

const defaultAthletes: Athlete[] = [
  { id: "a1", fullName: "Firas", email: "firas123000@gmail.com", status: "ACTIF", trackingEnabled: true },
  { id: "a2", fullName: "Samir", email: "chaouameri@gmail.com", status: "ACTIF", trackingEnabled: true },
  { id: "a3", fullName: "Faraz Taktak", email: "faeraktaktak911@gmail.com", status: "ACTIF", trackingEnabled: true },
  { id: "a4", fullName: "Fourat Hamid", email: "hamidifourat@gmail.com", status: "ACTIF", trackingEnabled: true },
  { id: "a5", fullName: "Zohra Abdellatif", email: "abdellatif.zohra.al@gmail.com", status: "ACTIF", trackingEnabled: true },
  { id: "a6", fullName: "Salim Hazz", email: "salimhazz@gmail.com", status: "ACTIF", trackingEnabled: true },
  { id: "a7", fullName: "Mahfoudh Maram", email: "mahfoudh.maram@gmail.com", status: "ACTIF", trackingEnabled: true },
  { id: "a8", fullName: "Ahmed Ben Salah", email: "ahmed.bensalah@gmail.com", status: "ACTIF", trackingEnabled: true },
];

const PerformancePage = () => {
  const [athletes, setAthletes] = useState<Athlete[]>(defaultAthletes);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>("a1");
  const [searchQuery, setSearchQuery] = useState("");
  const [consigneText, setConsigneText] = useState("");
  const [loading, setLoading] = useState(false);

  // Performance Data state for selected athlete
  const [athletePerf, setAthletePerf] = useState<AthletePerformanceData>({
    userId: "a1",
    loggedSets: [],
    loggedRuns: [],
    loggedHyrox: [],
    loggedWods: [],
    consigne: "",
    trackingEnabled: true,
  });

  // Load Users List
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users");
        const fetchedUsers = res.data?.users || res.data || [];
        if (Array.isArray(fetchedUsers) && fetchedUsers.length > 0) {
          const mapped: Athlete[] = fetchedUsers.map((u: any, idx: number) => ({
            id: u._id || u.id || `u-${idx}`,
            fullName: u.fullName || u.name || `Athlète ${idx + 1}`,
            email: u.email || "client@zmcoaching.online",
            status: "ACTIF",
            trackingEnabled: u.trackingEnabled !== false,
          }));
          setAthletes(mapped);
          if (!selectedAthleteId) setSelectedAthleteId(mapped[0].id);
        }
      } catch (err) {
        console.log("Using default athlete database", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Load selected athlete's dynamic performance data
  useEffect(() => {
    const loadAthleteData = async () => {
      const data = await fetchUserPerformance(selectedAthleteId);
      setAthletePerf(data);
      if (data.consigne) {
        setConsigneText(data.consigne);
      } else {
        const savedConsigne = localStorage.getItem(`zm_consigne_${selectedAthleteId}`);
        setConsigneText(
          savedConsigne ||
            "Ex: Superbe série au Développé couché ! Pense à garder les coudes rentrés à 45° et à bien verrouiller les omoplates..."
        );
      }
    };

    loadAthleteData();
  }, [selectedAthleteId]);

  const selectedAthlete =
    athletes.find((a) => a.id === selectedAthleteId) || athletes[0];

  const filteredAthletes = athletes.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle Athlete Tracking Access
  const handleToggleTracking = async () => {
    const nextState = !selectedAthlete.trackingEnabled;
    await toggleTrackingAccess(selectedAthleteId, nextState);

    const updated = athletes.map((a) => {
      if (a.id === selectedAthleteId) {
        return { ...a, trackingEnabled: nextState };
      }
      return a;
    });
    setAthletes(updated);

    toast.success(
      `Module tracking ${nextState ? "activé" : "désactivé"} pour ${selectedAthlete.fullName}`
    );
  };

  // Send Consigne Message to Client
  const handleSendConsigne = async () => {
    if (!consigneText.trim()) return;
    await saveCoachConsigne(selectedAthleteId, consigneText);
    toast.success(`Consigne envoyée avec succès à ${selectedAthlete.fullName} !`);
  };

  // Compute Scorecard Metrics
  // 1. SBD Maxes
  const getExerciseMax = (exerciseNames: string[]) => {
    const matching = athletePerf.loggedSets.filter((s) =>
      exerciseNames.some((name) => s.exercise.toLowerCase().includes(name.toLowerCase()))
    );
    if (matching.length === 0) return "--";
    const maxVal = Math.max(...matching.map((s) => s.estimated1RM));
    return `${maxVal} kg`;
  };

  const squatMax = getExerciseMax(["squat"]);
  const benchMax = getExerciseMax(["bench"]);
  const deadliftMax = getExerciseMax(["deadlift"]);

  // 2. Running stats
  const totalKm = athletePerf.loggedRuns.reduce((acc, r) => acc + (r.distance || 0), 0);
  
  const getFastestRun = (targetDist: number) => {
    const runs = athletePerf.loggedRuns.filter((r) => Math.abs(r.distance - targetDist) < 0.5);
    if (runs.length === 0) return "--:--";
    const timesInSecs = runs.map((r) => r.minutes * 60 + r.seconds);
    const minSecs = Math.min(...timesInSecs);
    const m = Math.floor(minSecs / 60);
    const s = minSecs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const fastest5k = getFastestRun(5);
  const fastest10k = getFastestRun(10);

  // 3. Hyrox stats
  const bestHyroxSim = athletePerf.loggedHyrox.length > 0
    ? athletePerf.loggedHyrox[0].totalTime
    : "--:--";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. HEADER */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">
          COACH MOHAMED ZNAIDY
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Suivi des <span className="text-red-500">Performances & PRs</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Contrôle d'accès au module de tracking, consultation des charges maximales, allures running et chrono Hyrox en temps réel.
        </p>
      </div>

      {/* 2. MAIN TOP GRID (ATHLETE LIST & FICHE ATHLETE) */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* TOP LEFT BOX: SÉLECTIONNER UN ATHLÈTE (5 COLS) */}
        <div className="lg:col-span-5 rounded-[2rem] border border-white/10 bg-zinc-950/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col h-[480px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users size={18} className="text-red-500" /> Sélectionner un Athlète
            </h3>
            <span className="text-xs font-bold text-zinc-500">
              {athletes.length} inscrits
            </span>
          </div>

          {/* SEARCH BAR */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3.5 top-3 text-zinc-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom..."
              className="w-full rounded-2xl bg-black/60 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-red-500"
            />
          </div>

          {/* SCROLLABLE ATHLETE LIST */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredAthletes.map((a) => {
              const isSelected = a.id === selectedAthleteId;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAthleteId(a.id)}
                  className={`w-full text-left rounded-2xl p-3.5 transition flex justify-between items-center ${
                    isSelected
                      ? "bg-red-600 text-white shadow-lg shadow-red-950/60 font-bold"
                      : "bg-black/50 text-zinc-300 hover:bg-white/5 border border-white/5"
                  }`}
                >
                  <div>
                    <div className="font-black text-sm">{a.fullName}</div>
                    <div
                      className={`text-[11px] ${
                        isSelected ? "text-red-100" : "text-zinc-500"
                      }`}
                    >
                      {a.email}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {a.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOP RIGHT BOX: FICHE ATHLÈTE (7 COLS) */}
        <div className="lg:col-span-7 rounded-[2rem] border border-white/10 bg-zinc-950/90 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6">
          {/* HEADER & ACCESS CONTROL TOGGLE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-black uppercase text-red-500 tracking-wider">
                FICHE ATHLÈTE
              </p>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {selectedAthlete.fullName}
              </h2>
              <p className="text-xs text-zinc-400">{selectedAthlete.email}</p>
            </div>

            <button
              onClick={handleToggleTracking}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border transition shadow-md ${
                selectedAthlete.trackingEnabled
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
              }`}
            >
              <span>Accès Module Tracking:</span>
              <span className="font-black">
                {selectedAthlete.trackingEnabled ? "Activé pour ce membre" : "Désactivé"}
              </span>
            </button>
          </div>

          {/* MESSAGE & CONSIGNE DU COACH */}
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-2">
                💬 MESSAGE & CONSIGNE DU COACH POUR CET ATHLÈTE
              </span>
              <span className="text-[10px] text-zinc-500 font-bold">
                VISIBLE DIRECTEMENT SUR SON ESPACE CLIENT
              </span>
            </div>

            <textarea
              value={consigneText}
              onChange={(e) => setConsigneText(e.target.value)}
              placeholder="Rédige tes consignes spécifiques pour cet athlète..."
              className="w-full flex-1 min-h-[140px] rounded-2xl bg-black/60 border border-white/10 p-4 text-xs text-white outline-none focus:border-amber-500 leading-relaxed"
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSendConsigne}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-xs font-black text-black shadow-lg shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <Send size={14} /> Envoyer la consigne
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW CARDS (3 CARDS DYNAMICALLY UPDATED FOR ATHLETE) */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* CARD 1: RECORDS PERSONNELS (PRs) */}
        <div className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Trophy size={18} className="text-amber-400" /> Records Personnels (PRs)
            </h3>
            <span className="text-xs font-bold text-amber-400">
              {athletePerf.loggedSets.length} PRs
            </span>
          </div>

          {athletePerf.loggedSets.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Aucun PR enregistré pour cet athlète.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
              {athletePerf.loggedSets.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl bg-black/50 p-3 border border-white/5 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{s.exercise}</span>
                    <span className="text-[10px] text-zinc-500">
                      {s.weight} kg × {s.reps} reps (RPE {s.rpe})
                    </span>
                  </div>
                  <span className="font-black text-amber-400 text-sm">
                    {s.estimated1RM} kg 1RM
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARD 2: RUNNING & ALLURES */}
        <div className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Gauge size={18} className="text-red-500" /> Running & Allures
            </h3>
            <span className="text-xs font-bold text-zinc-500">
              {athletePerf.loggedRuns.length} sorties ({totalKm} km)
            </span>
          </div>

          {athletePerf.loggedRuns.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Aucune sortie de course enregistrée par l'athlète.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
              {athletePerf.loggedRuns.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl bg-black/50 p-3 border border-white/5 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{r.type}</span>
                    <span className="text-[10px] text-zinc-500">
                      {r.distance} km • {r.minutes}:{String(r.seconds).padStart(2, "0")} ({r.pace}/km)
                    </span>
                  </div>
                  <span className="font-black text-red-400 text-xs">
                    {r.speed} km/h
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARD 3: CHRONO HYROX ATHLÈTE */}
        <div className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Clock size={18} className="text-orange-500" /> Chrono Hyrox Athlète
            </h3>
            <span className="text-xs font-bold text-amber-400">
              {athletePerf.loggedHyrox.length} simulations
            </span>
          </div>

          {athletePerf.loggedHyrox.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Aucune simulation Hyrox enregistrée pour cet athlète.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
              {athletePerf.loggedHyrox.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  className="rounded-xl bg-black/50 p-3 border border-amber-500/20 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">
                      Hyrox {h.category}
                    </span>
                    <span className="text-[10px] text-zinc-500">{h.date}</span>
                  </div>
                  <span className="font-black text-amber-400 text-sm">
                    {h.totalTime}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM FULL-WIDTH MATRIX CARD */}
      <div className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Zap size={20} className="text-amber-400" />
            Scorecard Athlète Hybride (Standards ZM Coaching)
          </h3>
          <span className="text-xs text-zinc-400 font-bold">
            Squat / Bench / Deadlift + Running & Hyrox
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Squat / Bench / Deadlift
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-400 tracking-wider">
              {squatMax} / {benchMax} / {deadliftMax}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/60 p-5 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Volume Total / 5km Allure
            </span>
            <div className="text-lg sm:text-xl font-black text-white tracking-wider">
              {totalKm} km / {fastest5k !== "--:--" ? fastest5k : "--"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/60 p-5 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              5 KM / 10 KM Times
            </span>
            <div className="text-lg sm:text-xl font-black text-red-500 tracking-wider">
              {fastest5k} / {fastest10k}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/60 p-5 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Chrono Official Hyrox
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-400 tracking-wider">
              {bestHyroxSim}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
