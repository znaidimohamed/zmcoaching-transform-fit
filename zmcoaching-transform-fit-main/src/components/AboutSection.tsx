import {
  Award,
  Dumbbell,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";

const stats = [
  {
    value: "250+",
    label: "Clients transformés",
  },
  {
    value: "5+",
    label: "Années d’expérience",
  },
  {
    value: "100%",
    label: "Suivi personnalisé",
  },
];

const features = [
  {
    icon: <Target size={22} />,
    title: "Coaching personnalisé",
    description:
      "Chaque programme est adapté selon ton objectif, ton niveau et ton mode de vie.",
  },
  {
    icon: <Dumbbell size={22} />,
    title: "Training intelligent",
    description:
      "Des entraînements structurés pour maximiser tes résultats efficacement.",
  },
  {
    icon: <Flame size={22} />,
    title: "Nutrition optimisée",
    description:
      "Une alimentation claire, simple et adaptée à ta transformation.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Suivi réel",
    description:
      "Analyse de progression, motivation et accompagnement continu.",
  },
];

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative py-28 bg-black text-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.15),transparent_30%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-6">
              <Sparkles size={16} />
              À propos du coach
            </div>

            <h2 className="text-5xl md:text-6xl font-black leading-tight">
              Transforme ton
              <span className="block text-red-500">
                physique & ton mindset
              </span>
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed mt-8 max-w-2xl">
              Je ne propose pas juste des programmes.
              <br />
              Je t’aide à construire une vraie transformation durable grâce à
              un coaching structuré, humain et orienté résultats.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 text-center"
                >
                  <h3 className="text-3xl font-black text-red-500">
                    {stat.value}
                  </h3>

                  <p className="text-sm text-zinc-400 mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("packs")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-4 font-black hover:scale-[1.03] transition shadow-lg shadow-red-900/30"
              >
                Commencer maintenant
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("transformations")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-black hover:bg-white/10 transition"
              >
                Voir résultats
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/25 blur-3xl rounded-full" />

            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-2xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950/40 to-black">
                <img
                  src="/lovable-uploads/65076046-0d01-48b5-a21b-9d5815dfd5bb.png"
                  alt="Mohamed Znaidy Coach"
                  className="w-full h-[560px] object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                <div className="absolute left-6 right-6 bottom-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-black mb-4">
                    <Trophy size={16} />
                    Transformation Coach
                  </div>

                  <h3 className="text-4xl font-black">
                    Mohamed <span className="text-red-500">Znaidy</span>
                  </h3>

                  <p className="text-zinc-300 mt-3 text-lg max-w-md">
                    Coach fitness spécialisé dans les transformations physiques, la
                    discipline, la nutrition et le suivi personnalisé.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center">
                      <p className="text-2xl font-black text-red-500">250+</p>
                      <p className="text-xs text-zinc-400">Clients</p>
                    </div>

                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center">
                      <p className="text-2xl font-black text-red-500">5+</p>
                      <p className="text-xs text-zinc-400">Années</p>
                    </div>

                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center">
                      <p className="text-2xl font-black text-red-500">100%</p>
                      <p className="text-xs text-zinc-400">Suivi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END RIGHT */}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;