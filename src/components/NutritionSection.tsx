import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Apple, Sparkles } from "lucide-react";

const DEFAULT_NUTRITION_COURSES = [
  {
    _id: "default-nutri-1",
    title: "Plan Prise de Masse Propre",
    description: "Guide complet de nutrition pour développer de la masse musculaire sans accumuler de graisses inutiles.",
    price: "59 TND",
    isPopular: false,
    features: [
      "Calcul précis des macronutriments (Protéines/Glucides/Lipides)",
      "Exemples de repas sains & faciles à préparer",
      "Guide de supplémentation efficace",
      "Calculateur de besoin calorique journalier",
    ],
  },
  {
    _id: "default-nutri-2",
    title: "Sèche & Définition Musculaire",
    description: "Méthode éprouvée de déficit calorique progressif pour faire sortir la définition musculaire sans perdre de force.",
    price: "69 TND",
    isPopular: true,
    features: [
      "Plan alimentaire personnalisé anti-faim",
      "Recettes brûle-graisses gourmandes",
      "Gestion des cheat meals & sorties",
      "Stratégies d'hydratation et rétention d'eau",
    ],
  },
  {
    _id: "default-nutri-3",
    title: "Guide de Recettes Fitness",
    description: "E-book complet avec plus de 30 recettes protéinées, équilibrées et adaptées à la cuisine quotidienne.",
    price: "35 TND",
    isPopular: false,
    features: [
      "30+ recettes rapides (Sucré & Salé)",
      "Tableau des calories & macros par portion",
      "Liste de courses économiques",
      "Idées de collations et pré-workout",
    ],
  },
];

const NutritionSection = () => {
  const [courses, setCourses] = useState<any[]>(DEFAULT_NUTRITION_COURSES);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses?category=nutrition");
        if (res.data.courses && res.data.courses.length > 0) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.log(err);
        // keep DEFAULT_NUTRITION_COURSES fallback
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

  await api.post("/purchase-requests", {
    itemType,
    itemId: item._id,
    message: `Je veux acheter: ${item.title || item.name}`,
  });

  const whatsappMessage = `Bonjour coach, je veux acheter ${
    item.title || item.name
  } au prix de ${item.price}.`;

  window.open(
    `https://wa.me/21653464695?text=${encodeURIComponent(whatsappMessage)}`,
    "_blank"
  );
};

  return (
    <section id="nutrition" className="py-24 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.18),transparent_30%)]" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-5">
            <Sparkles size={16} />
            Transforme ton alimentation
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Nutrition <span className="text-red-500">Courses</span>
          </h2>

          <p className="text-zinc-400 mt-5 text-lg">
            Des résultats construits avec discipline, nutrition intelligente et
            accompagnement personnalisé.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`relative rounded-[2rem] border p-8 bg-white/[0.04] backdrop-blur-xl ${
                course.isPopular
                  ? "border-red-500 shadow-2xl shadow-red-900/30"
                  : "border-white/10"
              }`}
            >
              {course.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 px-5 py-2 rounded-full text-sm font-bold">
                  Populaire
                </div>
              )}

              <div className="mb-5">
                <Apple className="text-red-500" />
              </div>

              <h3 className="text-2xl font-black">{course.title}</h3>
              <p className="text-zinc-400 mt-2">{course.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-black text-red-500">
                  {course.price}
                </span>
              </div>

              <ul className="space-y-2 mt-6 text-sm">
                {course.features?.map((f: string, i: number) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(course, "course")}
                className="w-full mt-6 rounded-2xl bg-red-600 py-3 font-black hover:bg-red-700"
              >
                Acheter
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NutritionSection;