import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Dumbbell, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_TRAINING_COURSES = [
  {
    _id: "default-course-1",
    title: "Full Body Débutant",
    description: "Programme complet sur 4 semaines pour construire des bases solides et apprendre l'exécution parfaite des mouvements.",
    level: "Débutant",
    duration: "4 Semaines",
    price: "49 TND",
    isPopular: false,
    features: [
      "Programme PDF & Vidéos guidées",
      "Structure 3 séances / semaine",
      "Guide d'échauffement & étirements",
      "Conseils de surcharge progressive",
    ],
  },
  {
    _id: "default-course-2",
    title: "PPL + Arnold Split (5 Jours)",
    description: "Combinaison ultime Push-Pull-Legs & Arnold Split pour maximiser l'hypertrophie musculaire et la masse physique.",
    level: "Intermédiaire",
    duration: "8 Semaines",
    price: "89 TND",
    isPopular: true,
    features: [
      "Programme intensif 5 jours",
      "Techniques d'amplification d'intensité",
      "Fiche de suivi des charges",
      "Accès aux fiches de mouvements PDF",
    ],
  },
  {
    _id: "default-course-3",
    title: "HIIT Fat Burn & Cardio",
    description: "Entraînement cardio métabolique à haute intensité pour brûler un maximum de graisses et booster ton endurance.",
    level: "Tous Niveaux",
    duration: "3 Semaines",
    price: "39 TND",
    isPopular: false,
    features: [
      "Séances rapides de 20-30 min",
      "Exercices sans matériel ou léger",
      "Plan de cardio adaptatif",
      "Fiche d'intensité cardiaque",
    ],
  },
];

const TrainingSection = () => {
  const [courses, setCourses] = useState<any[]>(DEFAULT_TRAINING_COURSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError("");
        const res = await api.get("/courses?category=training");
        if (res.data.courses && res.data.courses.length > 0) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.log(err);
        // keep DEFAULT_TRAINING_COURSES fallback
      }
    };

    fetchCourses();
  }, []);

  const handleBuy = async (item: any, itemType: "course" | "pack") => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      await api.post("/purchase-requests", {
        itemType,
        itemId: item._id,
        message: `Je veux acheter: ${item.title || item.name}`,
      });

      const whatsappMessage = `Bonjour coach, je veux acheter ${
        item.title || item.name
      } au prix de ${item.price}.`;

      window.open(
        `https://wa.me/21653464695?text=${encodeURIComponent(
          whatsappMessage
        )}`,
        "_blank"
      );
    } catch {
      alert("Erreur lors de la demande.");
    }
  };

  return (
    <section
      id="entrainement"
      className="relative overflow-hidden py-24 bg-black text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.12),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-5 backdrop-blur-xl">
            <Sparkles size={16} />
            Choisis ton programme
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Training <span className="text-red-500">Courses</span>
          </h2>

          <p className="text-zinc-400 mt-5 text-lg leading-relaxed">
            Des résultats construits avec discipline, nutrition intelligente et
            accompagnement personnalisé.
          </p>
        </motion.div>

        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[420px] rounded-[2rem] border border-white/10 bg-white/[0.03] animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-400 text-lg">
            {error}
          </div>
        )}

        {!loading && !courses.length && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">
              Aucun programme disponible pour le moment.
            </p>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group relative rounded-[2rem] border p-8 bg-white/[0.04] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-red-500/40 hover:bg-white/[0.06] ${
                  course.isPopular
                    ? "border-red-500 shadow-2xl shadow-red-900/30"
                    : "border-white/10"
                }`}
              >
                {course.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                    Populaire
                  </div>
                )}

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                  <Dumbbell className="text-red-500" />
                </div>

                <h3 className="text-2xl font-black">
                  {course.title}
                </h3>

                <p className="text-zinc-400 mt-3 leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-4 flex gap-3 text-sm text-zinc-400">
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>

                <div className="mt-6">
                  <span className="text-4xl font-black text-red-500">
                    {course.price}
                  </span>
                </div>

                <ul className="space-y-3 mt-6 text-sm text-zinc-200">
                  {course.features?.map((f: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-red-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(course, "course")}
                  className="w-full mt-8 rounded-2xl bg-red-600 py-3 font-black transition-all duration-300 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Acheter
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrainingSection;