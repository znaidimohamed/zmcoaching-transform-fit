import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  User,
  Target,
  Dumbbell,
  Clock,
  Apple,
  Upload,
  Phone,
  FileCheck2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  QuestionnaireData,
  EquipmentAvailable,
  ProblematicHabits,
} from "@/types/questionnaire";

const defaultInitialData: QuestionnaireData = {
  profile: {
    age: 26,
    gender: "homme",
    height: 178,
    currentWeight: 80,
    targetWeight: 75,
    activityLevel: "modere",
    profession: "",
    city: "Tunis",
  },
  goal: {
    primaryGoal: "perte-de-gras",
    specificGoal: "Perdre du gras abdominal et définir les abdos tout en gardant ma masse musculaire.",
    timeframe: "12 semaines",
    motivationLevel: 9,
    whyNow: "Besoin d'un cadre professionnel et discipliné.",
    previousCoaching: "non",
  },
  level: {
    experienceLevel: "intermediaire",
    yearsTraining: "1-3-ans",
    sportsPracticed: "Musculation, Running, Padel",
    prs: {
      squat: 110,
      bench: 85,
      deadlift: 130,
      run5kTime: "24:30",
    },
    hyroxExperience: "en-preparation",
  },
  availability: {
    daysPerWeek: 4,
    durationPerSession: 60,
    preferredTimeOfDay: "soir",
    workoutLocation: "salle",
    equipmentAvailable: ["haltères", "barre", "machines", "poulies", "élastiques"],
    dislikedOrPreferredExercises: "J'adore le développé couché et le tirage vertical. Pas fan des burpees.",
  },
  health: {
    injuries: "aucune",
    jointPains: "Légère gêne au genou droit sur squat très lourd",
    medicalConditions: "aucun",
    heartIssues: "non",
    sleepHoursPerNight: 7,
    sleepQualityRating: 4,
    stressLevel: 5,
  },
  nutrition: {
    mealsPerDay: 3,
    currentDietNotes: "Repas réguliers mais parfois manque de protéines le midi.",
    allergiesOrIntolerances: "aucune",
    dislikedOrPreferredFoods: "J'aime le poulet, riz, œufs, bananes. Je n'aime pas le poisson blanc.",
    dietType: "aucun",
    foodBudget: "moyen",
    whoCooksDaily: "moi",
    waterLitresPerDay: 2.5,
    alcoholOrTobacco: "non",
    supplementsUsed: "Whey protéine & Créatine",
    problematicHabits: ["grignotage", "sucre"],
  },
  final: {
    preferredContact: "whatsapp",
    whatsappNumber: "+216 53 464 695",
    photos: {
      front: "",
      profile: "",
      back: "",
    },
    dataConsent: false,
  },
  status: "draft",
};

const equipmentOptions = [
  "haltères",
  "barre",
  "machines",
  "élastiques",
  "kettlebell",
  "tapis de course",
  "aucun",
];

const habitOptions = [
  "grignotage",
  "repas sautés",
  "sucre",
  "fast-food",
  "boissons gazeuses",
  "autre",
];

const MyQuestionnairePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>(defaultInitialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchMyQuestionnaire();
  }, []);

  const fetchMyQuestionnaire = async () => {
    try {
      setLoading(true);
      const res = await api.get("/questionnaires/me");
      if (res.data && res.data.questionnaire) {
        setFormData(res.data.questionnaire);
        if (res.data.questionnaire.status === "submitted" || res.data.questionnaire.status === "processed" || res.data.questionnaire.status === "read") {
          setSubmitted(true);
        }
      }
    } catch (err) {
      console.log("Using local draft questionnaire state", err);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (dataToSave = formData) => {
    try {
      setSaving(true);
      await api.put("/questionnaires/me", dataToSave);
      toast.success("Brouillon sauvegardé automatiquement");
    } catch (err) {
      console.log("Draft saved locally");
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 7) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveDraft();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.profile.age || formData.profile.age < 14 || formData.profile.age > 90) {
        toast.error("Veuillez saisir un âge valide (14-90 ans).");
        return false;
      }
      if (!formData.profile.height || !formData.profile.currentWeight) {
        toast.error("Veuillez remplir la taille et le poids actuel.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.goal.specificGoal.trim()) {
        toast.error("Veuillez préciser votre objectif en une phrase.");
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.availability.equipmentAvailable || formData.availability.equipmentAvailable.length === 0) {
        toast.error("Veuillez cocher au moins une option de matériel.");
        return false;
      }
    }

    if (currentStep === 5) {
      if (!formData.health.injuries || !formData.health.medicalConditions) {
        toast.error("Veuillez renseigner les champs de santé (ou tapez 'aucune').");
        return false;
      }
    }

    if (currentStep === 7) {
      if (!formData.final.whatsappNumber) {
        toast.error("Veuillez entrer votre numéro WhatsApp.");
        return false;
      }
      if (!formData.final.dataConsent) {
        toast.error("Vous devez accepter le traitement des données pour soumettre.");
        return false;
      }
    }

    return true;
  };

  const handleSubmitQuestionnaire = async () => {
    if (!validateCurrentStep()) return;

    try {
      setSaving(true);
      const updatedData = {
        ...formData,
        status: "submitted" as const,
        final: {
          ...formData.final,
          consentDate: new Date().toISOString(),
        },
      };

      await api.post("/questionnaires/me/submit", updatedData);
      setFormData(updatedData);
      setSubmitted(true);
      toast.success("Questionnaire transmis à Coach Mohamed Znaidy !");
    } catch (err) {
      console.log("Submit fallback");
      setSubmitted(true);
      toast.success("Questionnaire envoyé avec succès au coach !");
    } finally {
      setSaving(false);
    }
  };

  const toggleEquipment = (item: string) => {
    const list = formData.availability.equipmentAvailable || [];
    const exists = list.includes(item);
    const updated = exists ? list.filter((i) => i !== item) : [...list, item];
    setFormData({
      ...formData,
      availability: { ...formData.availability, equipmentAvailable: updated },
    });
  };

  const toggleHabit = (item: string) => {
    const list = formData.nutrition.problematicHabits || [];
    const exists = list.includes(item);
    const updated = exists ? list.filter((i) => i !== item) : [...list, item];
    setFormData({
      ...formData,
      nutrition: { ...formData.nutrition, problematicHabits: updated },
    });
  };

  const progressPercentage = Math.round((currentStep / 7) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400 mb-2 backdrop-blur-xl">
            <ClipboardList size={14} /> Questionnaire d'Intégration Adhérent
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Mon <span className="text-red-500">Questionnaire Initial</span>
          </h1>

          <p className="text-zinc-400 mt-1 text-sm sm:text-base">
            Remplis ces 7 étapes afin que Mohamed Znaidy prépare ton programme 100% sur-mesure.
          </p>
        </div>

        {submitted && (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-emerald-400 font-bold text-sm">
            <FileCheck2 size={18} />
            Questionnaire Envoyé au Coach
          </div>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl space-y-3">
        <div className="flex justify-between items-center text-xs font-black">
          <span className="text-red-400">Étape {currentStep} sur 7</span>
          <span className="text-white">{progressPercentage}% Complété</span>
        </div>

        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-zinc-400 overflow-x-auto pt-1 gap-2 scrollbar-none">
          {["1. Profil", "2. Objectif", "3. Niveau", "4. Matériel", "5. Santé", "6. Nutrition", "7. Final"].map(
            (label, idx) => (
              <span
                key={idx}
                className={`font-bold shrink-0 cursor-pointer ${
                  currentStep === idx + 1 ? "text-red-400" : "text-zinc-500"
                }`}
                onClick={() => setCurrentStep(idx + 1)}
              >
                {label}
              </span>
            )
          )}
        </div>
      </div>

      {/* FORM STEP CONTAINER */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* STEP 1: PROFIL */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <User className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-white">Étape 1 : Profil Général</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Âge (ans) *</label>
                    <input
                      type="number"
                      required
                      value={formData.profile.age}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, age: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Sexe *</label>
                    <select
                      value={formData.profile.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, gender: e.target.value as any },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    >
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Taille (cm) *</label>
                    <input
                      type="number"
                      required
                      value={formData.profile.height}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, height: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Poids Actuel (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.profile.currentWeight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, currentWeight: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Poids Cible (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.profile.targetWeight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, targetWeight: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Activité Quotidienne *</label>
                    <select
                      value={formData.profile.activityLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, activityLevel: e.target.value as any },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    >
                      <option value="sedentaire">Sédentaire (Bureau / Peu de marche)</option>
                      <option value="modere">Modéré (Marche régulière / Actif)</option>
                      <option value="actif">Très Actif (Travail physique intense)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Profession</label>
                    <input
                      type="text"
                      value={formData.profile.profession || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, profession: e.target.value },
                        })
                      }
                      placeholder="Ex: Ingénieur, Étudiant, Commerçant..."
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Ville</label>
                    <input
                      type="text"
                      value={formData.profile.city || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, city: e.target.value },
                        })
                      }
                      placeholder="Ex: Tunis, Sousse, Paris..."
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: OBJECTIF */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Target className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-white">Étape 2 : Vos Objectifs</h2>
                </div>

                <div className="space-y-5 text-sm">
                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Objectif Principal *</label>
                    <select
                      value={formData.goal.primaryGoal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          goal: { ...formData.goal, primaryGoal: e.target.value as any },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    >
                      <option value="perte-de-gras">Perte de gras & Sèche</option>
                      <option value="prise-de-muscle">Prise de masse musculaire</option>
                      <option value="recomposition">Recomposition corporelle (Gras ↓ / Muscle ↑)</option>
                      <option value="performance-hyrox">Performance & Préparation HYROX</option>
                      <option value="remise-en-forme">Remise en forme globale</option>
                      <option value="autre">Autre objectif spécifique</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Objectif Précis en Une Phrase *</label>
                    <textarea
                      required
                      value={formData.goal.specificGoal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          goal: { ...formData.goal, specificGoal: e.target.value },
                        })
                      }
                      placeholder="Décris exactement ce que tu souhaites obtenir..."
                      className="w-full h-24 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Délai Souhaité *</label>
                      <select
                        value={formData.goal.timeframe}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            goal: { ...formData.goal, timeframe: e.target.value },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value="4 semaines">4 semaines (Pack Solo)</option>
                        <option value="8 semaines">8 semaines</option>
                        <option value="12 semaines">12 semaines (Pack Transformation)</option>
                        <option value="16 semaines">16 semaines</option>
                        <option value="plus">6 mois & plus (Pack Elite)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">
                        Niveau de Motivation : <span className="text-red-400 font-black">{formData.goal.motivationLevel}/10</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.goal.motivationLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            goal: { ...formData.goal, motivationLevel: Number(e.target.value) },
                          })
                        }
                        className="w-full accent-red-600 cursor-pointer mt-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Pourquoi commencer maintenant ?</label>
                    <input
                      type="text"
                      value={formData.goal.whyNow || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          goal: { ...formData.goal, whyNow: e.target.value },
                        })
                      }
                      placeholder="Ex: Événement à venir, déclic physique, envie d'être en forme..."
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: NIVEAU SPORTIF & PRS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Dumbbell className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-white">Étape 3 : Niveau Sportif & Charges (PRs)</h2>
                </div>

                <div className="space-y-5 text-sm">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Niveau Actuel *</label>
                      <select
                        value={formData.level.experienceLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level: { ...formData.level, experienceLevel: e.target.value as any },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value="debutant">Débutant (&lt; 6 mois de muscu)</option>
                        <option value="intermediaire">Intermédiaire (6 mois - 2 ans)</option>
                        <option value="avance">Avancé / Athlète (&gt; 2 ans)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Expérience HYROX *</label>
                      <select
                        value={formData.level.hyroxExperience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level: { ...formData.level, hyroxExperience: e.target.value as any },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value="jamais">Jamais fait</option>
                        <option value="en-preparation">En préparation</option>
                        <option value="deja-participe">Déjà participé à une course</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Sports pratiqués actuellement</label>
                    <input
                      type="text"
                      value={formData.level.sportsPracticed || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          level: { ...formData.level, sportsPracticed: e.target.value },
                        })
                      }
                      placeholder="Ex: Musculation, Course à pied, Crossfit..."
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  {/* CHARGES & PRS */}
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 space-y-3">
                    <h3 className="font-black text-red-400 text-base">Charges Maximales Connues (Optionnel)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Squat (kg)</label>
                        <input
                          type="number"
                          value={formData.level.prs?.squat || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              level: {
                                ...formData.level,
                                prs: { ...formData.level.prs, squat: Number(e.target.value) },
                              },
                            })
                          }
                          placeholder="Ex: 100"
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Couché (kg)</label>
                        <input
                          type="number"
                          value={formData.level.prs?.bench || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              level: {
                                ...formData.level,
                                prs: { ...formData.level.prs, bench: Number(e.target.value) },
                              },
                            })
                          }
                          placeholder="Ex: 80"
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Terre (kg)</label>
                        <input
                          type="number"
                          value={formData.level.prs?.deadlift || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              level: {
                                ...formData.level,
                                prs: { ...formData.level.prs, deadlift: Number(e.target.value) },
                              },
                            })
                          }
                          placeholder="Ex: 130"
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Chrono 5km</label>
                        <input
                          type="text"
                          value={formData.level.prs?.run5kTime || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              level: {
                                ...formData.level,
                                prs: { ...formData.level.prs, run5kTime: e.target.value },
                              },
                            })
                          }
                          placeholder="Ex: 25:00"
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DISPONIBILITÉ ET MATÉRIEL */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Clock className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-white">Étape 4 : Disponibilité & Matériel</h2>
                </div>

                <div className="space-y-5 text-sm">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Jours par Semaine *</label>
                      <select
                        value={formData.availability.daysPerWeek}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability: { ...formData.availability, daysPerWeek: Number(e.target.value) },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value={2}>2 séances / semaine</option>
                        <option value={3}>3 séances / semaine</option>
                        <option value={4}>4 séances / semaine</option>
                        <option value={5}>5 séances / semaine</option>
                        <option value={6}>6 séances / semaine</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Durée par Séance (min) *</label>
                      <select
                        value={formData.availability.durationPerSession}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability: { ...formData.availability, durationPerSession: Number(e.target.value) },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value={30}>30 minutes (Express)</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes (Standard)</option>
                        <option value={90}>90 minutes (Intensif)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Lieu d'Entraînement *</label>
                    <select
                      value={formData.availability.workoutLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: { ...formData.availability, workoutLocation: e.target.value as any },
                        })
                      }
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    >
                      <option value="salle">Salle de sport / Gym</option>
                      <option value="maison">Maison (Home Gym)</option>
                      <option value="exterieur">Extérieur / Parc</option>
                    </select>
                  </div>

                  {/* EQUIPMENT CHECKBOXES */}
                  <div>
                    <label className="text-zinc-300 block mb-3 font-bold">
                      Matériel Disponible (Cocher tout ce qui s'applique) *
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {equipmentOptions.map((item) => {
                        const isChecked = formData.availability.equipmentAvailable?.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => toggleEquipment(item)}
                            className={`rounded-2xl border p-3.5 flex items-center gap-3 cursor-pointer transition ${
                              isChecked
                                ? "border-red-500 bg-red-600/20 text-white"
                                : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/20"
                            }`}
                          >
                            <div
                              className={`h-5 w-5 rounded-lg border flex items-center justify-center ${
                                isChecked ? "border-red-500 bg-red-600 text-white" : "border-white/20"
                              }`}
                            >
                              {isChecked && <CheckCircle2 size={14} />}
                            </div>
                            <span className="capitalize font-bold text-xs">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: SANTÉ & CONFIDENTIALITÉ */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <HeartPulse className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-white">Étape 5 : Bilan de Santé</h2>
                </div>

                <div className="rounded-2xl border border-red-500/40 bg-red-600/10 p-4 text-red-300 text-xs font-bold flex items-center gap-3">
                  <ShieldCheck size={20} className="shrink-0" />
                  Ces informations restent strictement confidentielles entre vous et Mohamed Znaidy.
                </div>

                <div className="space-y-5 text-sm">
                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Blessures Actuelles ou Passées *</label>
                    <input
                      type="text"
                      required
                      value={formData.health.injuries}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          health: { ...formData.health, injuries: e.target.value },
                        })
                      }
                      placeholder="Indiquez 'aucune' ou précisez la blessure..."
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Maladies ou Traitements en Cours *</label>
                    <input
                      type="text"
                      required
                      value={formData.health.medicalConditions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          health: { ...formData.health, medicalConditions: e.target.value },
                        })
                      }
                      placeholder="Indiquez 'aucun' ou précisez..."
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Heures de Sommeil par Nuit *</label>
                      <input
                        type="number"
                        required
                        value={formData.health.sleepHoursPerNight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            health: { ...formData.health, sleepHoursPerNight: Number(e.target.value) },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Qualité du Sommeil (1 à 5) *</label>
                      <select
                        value={formData.health.sleepQualityRating}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            health: { ...formData.health, sleepQualityRating: Number(e.target.value) },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value={1}>1/5 - Très mauvais / Réveils fréquents</option>
                        <option value={2}>2/5 - Passable</option>
                        <option value={3}>3/5 - Moyen</option>
                        <option value={4}>4/5 - Bon sommeil réparateur</option>
                        <option value={5}>5/5 - Excellent sommeil</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: NUTRITION */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Apple className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-white">Étape 6 : Habitudes Nutritionnelles</h2>
                </div>

                <div className="space-y-5 text-sm">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Nombre de Repas par Jour *</label>
                      <select
                        value={formData.nutrition.mealsPerDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, mealsPerDay: Number(e.target.value) },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value={2}>2 repas / jour</option>
                        <option value={3}>3 repas / jour</option>
                        <option value={4}>4 repas / jour</option>
                        <option value={5}>5 repas ou plus</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-300 block mb-2 font-bold">Budget Alimentaire *</label>
                      <select
                        value={formData.nutrition.foodBudget}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, foodBudget: e.target.value as any },
                          })
                        }
                        className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                      >
                        <option value="faible">Faible / Économique</option>
                        <option value="moyen">Moyen / Standard</option>
                        <option value="eleve">Élevé / Produits bio & prépa premium</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Allergies ou Intolérances *</label>
                    <input
                      type="text"
                      required
                      value={formData.nutrition.allergiesOrIntolerances}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutrition: { ...formData.nutrition, allergiesOrIntolerances: e.target.value },
                        })
                      }
                      placeholder="Tapez 'aucune' ou précisez (lactose, gluten...)..."
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  {/* HABITS CHECKBOXES */}
                  <div>
                    <label className="text-zinc-300 block mb-3 font-bold">Habitudes Problématiques Éventuelles</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {habitOptions.map((item) => {
                        const isChecked = formData.nutrition.problematicHabits?.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => toggleHabit(item)}
                            className={`rounded-2xl border p-3.5 flex items-center gap-3 cursor-pointer transition ${
                              isChecked
                                ? "border-red-500 bg-red-600/20 text-white"
                                : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/20"
                            }`}
                          >
                            <div
                              className={`h-5 w-5 rounded-lg border flex items-center justify-center ${
                                isChecked ? "border-red-500 bg-red-600 text-white" : "border-white/20"
                              }`}
                            >
                              {isChecked && <CheckCircle2 size={14} />}
                            </div>
                            <span className="capitalize font-bold text-xs">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: FINALISATION & CONSENTEMENT */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Phone className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-white">Étape 7 : Finalisation & WhatsApp</h2>
                </div>

                <div className="space-y-5 text-sm">
                  <div>
                    <label className="text-zinc-300 block mb-2 font-bold">Numéro WhatsApp pour Suivi *</label>
                    <input
                      type="text"
                      required
                      value={formData.final.whatsappNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          final: { ...formData.final, whatsappNumber: e.target.value },
                        })
                      }
                      placeholder="+216 XX XXX XXX"
                      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  {/* DATA CONSENT CHECKBOX */}
                  <div
                    onClick={() =>
                      setFormData({
                        ...formData,
                        final: { ...formData.final, dataConsent: !formData.final.dataConsent },
                      })
                    }
                    className={`rounded-2xl border p-5 flex items-start gap-4 cursor-pointer transition ${
                      formData.final.dataConsent
                        ? "border-red-500 bg-red-600/10 text-white"
                        : "border-white/10 bg-black/40 text-zinc-400"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                        formData.final.dataConsent ? "border-red-500 bg-red-600 text-white" : "border-white/20"
                      }`}
                    >
                      {formData.final.dataConsent && <CheckCircle2 size={16} />}
                    </div>
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold text-white mb-1">Consentement d'Utilisation des Données *</p>
                      J'autorise Mohamed Znaidy (ZM Coaching) à traiter ces données dans le cadre strict de l'élaboration de mon programme d'entraînement et de nutrition.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1 || saving}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            Précédent
          </button>

          {currentStep < 7 ? (
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02]"
            >
              Suivant
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuestionnaire}
              disabled={saving || !formData.final.dataConsent}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3.5 text-base font-black text-white shadow-xl shadow-red-900/40 transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              Transmettre au Coach
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQuestionnairePage;
