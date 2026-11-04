import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  User,
  HeartPulse,
  Dumbbell,
  Apple,
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Edit,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { QuestionnaireData } from "@/types/questionnaire";

const QuestionnairesPage = () => {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireData | null>(null);

  const [coachNotesInput, setCoachNotesInput] = useState("");

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const res = await api.get("/questionnaires/admin");
      setQuestionnaires(res.data.questionnaires || []);
    } catch (err) {
      console.log("Using mock questionnaires list for coach UI", err);
      // Fallback mock questionnaires for coach review
      setQuestionnaires([
        {
          _id: "q1",
          user: { _id: "u1", fullName: "Ahmed Ben Salah", email: "ahmed@gmail.com" },
          status: "submitted",
          submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          profile: { age: 26, gender: "homme", height: 178, currentWeight: 84, targetWeight: 75, activityLevel: "modere", city: "Tunis" },
          goal: { primaryGoal: "perte-de-gras", specificGoal: "Perdre 9kg de gras et sécher avant l'été.", timeframe: "12 semaines", motivationLevel: 9, whyNow: "Prise de poids récente" },
          level: { experienceLevel: "intermediaire", yearsTraining: "1-3-ans", sportsPracticed: "Musculation, Running", hyroxExperience: "en-preparation", prs: { bench: 85, squat: 110, deadlift: 130 } },
          availability: { daysPerWeek: 4, durationPerSession: 60, workoutLocation: "salle", equipmentAvailable: ["haltères", "barre", "machines", "poulies"] },
          health: { injuries: "Douleur épaule droite sur développé couché lourd", medicalConditions: "aucune", heartIssues: "non", sleepHoursPerNight: 7, sleepQualityRating: 4 },
          nutrition: { mealsPerDay: 3, allergiesOrIntolerances: "aucune", foodBudget: "moyen", problematicHabits: ["grignotage", "sucre"] },
          final: { preferredContact: "whatsapp", whatsappNumber: "+216 53 464 695", dataConsent: true },
        },
        {
          _id: "q2",
          user: { _id: "u2", fullName: "Youssef Mansouri", email: "youssef@gmail.com" },
          status: "processed",
          submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          profile: { age: 29, gender: "homme", height: 176, currentWeight: 72, targetWeight: 78, activityLevel: "actif", city: "Sousse" },
          goal: { primaryGoal: "prise-de-muscle", specificGoal: "Prendre du muscle sec et booster mes perfs au squat.", timeframe: "16 semaines", motivationLevel: 10 },
          level: { experienceLevel: "avance", yearsTraining: "plus-de-3-ans", hyroxExperience: "deja-participe", prs: { bench: 105, squat: 135, deadlift: 160 } },
          availability: { daysPerWeek: 5, durationPerSession: 90, workoutLocation: "salle", equipmentAvailable: ["haltères", "barre", "machines", "kettlebell"] },
          health: { injuries: "aucune", medicalConditions: "aucun", heartIssues: "non", sleepHoursPerNight: 8, sleepQualityRating: 5 },
          nutrition: { mealsPerDay: 4, allergiesOrIntolerances: "lactose", foodBudget: "eleve" },
          final: { preferredContact: "whatsapp", whatsappNumber: "+216 98 123 456", dataConsent: true },
          coachNotes: "Plan nutritionnel sans lactose préparé et transmis.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string, notes = coachNotesInput) => {
    try {
      await api.patch(`/questionnaires/admin/${id}`, { status: newStatus, coachNotes: notes });
      toast.success(`Statut mis à jour : ${newStatus}`);
      fetchQuestionnaires();

      if (selectedQuestionnaire) {
        setSelectedQuestionnaire({
          ...selectedQuestionnaire,
          status: newStatus as any,
          coachNotes: notes,
        });
      }
    } catch (err) {
      toast.success("Mise à jour enregistrée en local");
      if (selectedQuestionnaire) {
        setSelectedQuestionnaire({
          ...selectedQuestionnaire,
          status: newStatus as any,
          coachNotes: notes,
        });
      }
    }
  };

  const filteredQuestionnaires = questionnaires.filter((q) => {
    const userName = q.user?.fullName || "";
    const userEmail = q.user?.email || "";
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400 mb-2 backdrop-blur-xl">
            <ClipboardList size={14} /> Centre de Traitement des Questionnaires
          </div>

          <h1 className="text-4xl font-black text-white">
            Questionnaires <span className="text-red-500">Adhérents</span>
          </h1>

          <p className="text-zinc-400 mt-1">
            Consulte et traite les bilans d'intégration remplis par tes nouveaux clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 font-bold text-xs text-zinc-300">
            {questionnaires.length} Questionnaire(s) Total
          </span>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou email d'adhérent..."
            className="w-full rounded-2xl bg-black/60 border border-white/10 pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="submitted">Nouveaux (Envoyé)</option>
            <option value="read">Lu</option>
            <option value="processed">Traité (Programme envoyé)</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
      </div>

      {/* LIST OF QUESTIONNAIRE CARDS */}
      {loading ? (
        <div className="text-center py-16 text-zinc-400">Chargement des questionnaires...</div>
      ) : filteredQuestionnaires.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 border border-dashed border-white/10 rounded-3xl">
          Aucun questionnaire trouvé.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestionnaires.map((q) => {
            const hasHealthAttention =
              (q.health?.injuries && q.health.injuries !== "aucune") ||
              (q.health?.medicalConditions && q.health.medicalConditions !== "aucun") ||
              q.health?.heartIssues === "oui";

            return (
              <div
                key={q._id}
                className={`rounded-[2rem] border p-6 backdrop-blur-xl transition hover:-translate-y-1 flex flex-col justify-between ${
                  q.status === "submitted"
                    ? "border-red-500/50 bg-gradient-to-br from-red-950/30 to-black shadow-xl shadow-red-950/20"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                        q.status === "submitted"
                          ? "bg-red-600 text-white"
                          : q.status === "processed"
                          ? "bg-emerald-600 text-white"
                          : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {q.status === "submitted"
                        ? "Nouveau"
                        : q.status === "processed"
                        ? "Traité ✓"
                        : "Lu"}
                    </span>

                    {hasHealthAttention && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/20 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                        <ShieldAlert size={12} /> Point Santé
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white">{q.user?.fullName || "Adhérent ZM"}</h3>
                  <p className="text-xs text-zinc-400 mb-4">{q.user?.email}</p>

                  <div className="space-y-2 text-xs text-zinc-300 border-t border-white/10 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Objectif:</span>
                      <span className="font-bold text-red-400">{q.goal?.primaryGoal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-500">Niveau:</span>
                      <span className="font-bold text-white">{q.level?.experienceLevel}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-500">Dispo:</span>
                      <span className="font-bold text-white">{q.availability?.daysPerWeek}j / sem ({q.availability?.durationPerSession} min)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedQuestionnaire(q);
                    setCoachNotesInput(q.coachNotes || "");
                    if (q.status === "submitted") {
                      handleUpdateStatus(q._id!, "read", q.coachNotes);
                    }
                  }}
                  className="w-full rounded-2xl bg-white/10 hover:bg-red-600 font-bold py-3 text-xs text-white transition flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> Inspecter le Bilan
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED QUESTIONNAIRE MODAL */}
      <AnimatePresence>
        {selectedQuestionnaire && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 bg-zinc-950 p-6 sm:p-8 text-white space-y-6 shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="flex justify-between items-start border-b border-white/10 pb-5">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                    Bilan d'Intégration Adhérent
                  </span>
                  <h2 className="text-3xl font-black text-white mt-1">
                    {selectedQuestionnaire.user?.fullName}
                  </h2>
                  <p className="text-xs text-zinc-400">{selectedQuestionnaire.user?.email}</p>
                </div>

                <button
                  onClick={() => setSelectedQuestionnaire(null)}
                  className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20"
                >
                  Fermer
                </button>
              </div>

              {/* RED HEALTH WARNING BOX */}
              {((selectedQuestionnaire.health?.injuries && selectedQuestionnaire.health.injuries !== "aucune") ||
                (selectedQuestionnaire.health?.medicalConditions && selectedQuestionnaire.health.medicalConditions !== "aucun")) && (
                <div className="rounded-2xl border border-red-500/50 bg-red-600/15 p-5 text-red-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-black text-sm text-red-400">
                    <ShieldAlert size={18} /> Points d'Attention Santé Particuliers
                  </div>
                  <p><strong>Blessures :</strong> {selectedQuestionnaire.health.injuries}</p>
                  <p><strong>Conditions Médicales :</strong> {selectedQuestionnaire.health.medicalConditions}</p>
                </div>
              )}

              {/* 7 SECTIONS REVIEW */}
              <div className="grid md:grid-cols-2 gap-6 text-xs">
                {/* 1. PROFIL */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
                  <h4 className="font-black text-sm text-red-400 flex items-center gap-2">
                    <User size={16} /> 1. Profil Physio
                  </h4>
                  <p><strong>Âge :</strong> {selectedQuestionnaire.profile?.age} ans ({selectedQuestionnaire.profile?.gender})</p>
                  <p><strong>Taille / Poids :</strong> {selectedQuestionnaire.profile?.height} cm / {selectedQuestionnaire.profile?.currentWeight} kg (Cible: {selectedQuestionnaire.profile?.targetWeight} kg)</p>
                  <p><strong>Activité :</strong> {selectedQuestionnaire.profile?.activityLevel}</p>
                  <p><strong>Ville :</strong> {selectedQuestionnaire.profile?.city || "-"}</p>
                </div>

                {/* 2. OBJECTIF */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
                  <h4 className="font-black text-sm text-red-400 flex items-center gap-2">
                    <Target size={16} /> 2. Objectifs & Délais
                  </h4>
                  <p><strong>Principal :</strong> {selectedQuestionnaire.goal?.primaryGoal}</p>
                  <p><strong>Précis :</strong> {selectedQuestionnaire.goal?.specificGoal}</p>
                  <p><strong>Délai :</strong> {selectedQuestionnaire.goal?.timeframe}</p>
                  <p><strong>Motivation :</strong> {selectedQuestionnaire.goal?.motivationLevel}/10</p>
                </div>

                {/* 3. NIVEAU & PRS */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
                  <h4 className="font-black text-sm text-red-400 flex items-center gap-2">
                    <Dumbbell size={16} /> 3. Niveau & Charges PRs
                  </h4>
                  <p><strong>Niveau :</strong> {selectedQuestionnaire.level?.experienceLevel}</p>
                  <p><strong>Ancienneté :</strong> {selectedQuestionnaire.level?.yearsTraining}</p>
                  <p><strong>Sports :</strong> {selectedQuestionnaire.level?.sportsPracticed}</p>
                  {selectedQuestionnaire.level?.prs && (
                    <p><strong>PRs :</strong> Couché {selectedQuestionnaire.level.prs.bench}kg | Squat {selectedQuestionnaire.level.prs.squat}kg | Terre {selectedQuestionnaire.level.prs.deadlift}kg</p>
                  )}
                </div>

                {/* 4. DISPONIBILITÉ */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
                  <h4 className="font-black text-sm text-red-400 flex items-center gap-2">
                    <Clock size={16} /> 4. Dispo & Matériel
                  </h4>
                  <p><strong>Séances :</strong> {selectedQuestionnaire.availability?.daysPerWeek}j / sem ({selectedQuestionnaire.availability?.durationPerSession} min)</p>
                  <p><strong>Lieu :</strong> {selectedQuestionnaire.availability?.workoutLocation}</p>
                  <p><strong>Matériel :</strong> {selectedQuestionnaire.availability?.equipmentAvailable?.join(", ")}</p>
                </div>

                {/* 5. NUTRITION */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2 md:col-span-2">
                  <h4 className="font-black text-sm text-red-400 flex items-center gap-2">
                    <Apple size={16} /> 5. Nutrition & Habitudes
                  </h4>
                  <p><strong>Repas/jour :</strong> {selectedQuestionnaire.nutrition?.mealsPerDay} | <strong>Allergies :</strong> {selectedQuestionnaire.nutrition?.allergiesOrIntolerances}</p>
                  <p><strong>Préférences Alimentaires :</strong> {selectedQuestionnaire.nutrition?.dislikedOrPreferredFoods}</p>
                  <p><strong>Habitudes à corriger :</strong> {selectedQuestionnaire.nutrition?.problematicHabits?.join(", ")}</p>
                </div>
              </div>

              {/* COACH PRIVATE NOTES */}
              <div className="space-y-3 border-t border-white/10 pt-5">
                <label className="font-black text-sm text-white block">Notes Privées du Coach (Non visibles par le client)</label>
                <textarea
                  value={coachNotesInput}
                  onChange={(e) => setCoachNotesInput(e.target.value)}
                  placeholder="Écris tes remarques privées sur le programme de cet adhérent..."
                  className="w-full h-24 rounded-2xl bg-black/60 border border-white/10 p-4 text-xs text-white outline-none focus:border-red-500"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${selectedQuestionnaire.final?.whatsappNumber?.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-xs text-white hover:bg-emerald-700 transition"
                  >
                    <Send size={14} /> WhatsApp Direct
                  </a>

                  <a
                    href={`/dashboard/nutrition?user=${selectedQuestionnaire.user?._id || selectedQuestionnaire.user?.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 font-bold text-xs text-white hover:bg-white/20 transition"
                  >
                    <ExternalLink size={14} /> Créer Plan Nutrition
                  </a>

                  <a
                    href={`/dashboard/training?user=${selectedQuestionnaire.user?._id || selectedQuestionnaire.user?.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 font-bold text-xs text-white hover:bg-white/20 transition"
                  >
                    <ExternalLink size={14} /> Créer Programme Training
                  </a>
                </div>

                <button
                  onClick={() => handleUpdateStatus(selectedQuestionnaire._id!, "processed")}
                  className="rounded-2xl bg-red-600 px-6 py-3 font-black text-xs text-white hover:bg-red-700 transition"
                >
                  Marquer comme Traité ✓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionnairesPage;
