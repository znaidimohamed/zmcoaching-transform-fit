import {
  Activity,
  ArrowRight,
  Dumbbell,
  Flame,
  Medal,
  Timer,
  Trophy,
} from "lucide-react";

const hyroxPoints = [
  {
    icon: <Timer size={22} />,
    title: "Endurance",
    description: "Travail cardio, gestion du rythme et progression course.",
  },
  {
    icon: <Dumbbell size={22} />,
    title: "Force",
    description: "Sled push, sled pull, lunges, wall balls et grip.",
  },
  {
    icon: <Activity size={22} />,
    title: "Performance",
    description: "Transitions, stratégie d’effort et simulation compétition.",
  },
];

const HyroxSection = () => {
  return (
    <section
      id="hyrox"
      className="relative py-28 bg-black text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.18),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-red-600/25 blur-3xl rounded-full" />

            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-2xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950/40 to-black">
                <img
                  src="/lovable-uploads/Hyrox.JPG"
                  alt="Coach Hyrox ZM Coaching"
                  className="w-full h-[560px] object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                <div className="absolute left-6 right-6 bottom-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-black mb-4">
                    <Trophy size={16} />
                    Préparation HYROX
                  </div>

                  <h3 className="text-4xl font-black">
                    Training <span className="text-red-500">Race Ready</span>
                  </h3>

                  <p className="text-zinc-300 mt-3 text-lg max-w-md">
                    Un coaching structuré pour développer ton cardio, ta force
                    et ton mental jusqu’au jour de la compétition.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center">
                      <p className="text-2xl font-black text-red-500">8</p>
                      <p className="text-xs text-zinc-400">Stations</p>
                    </div>

                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center">
                      <p className="text-2xl font-black text-red-500">1KM</p>
                      <p className="text-xs text-zinc-400">Run x8</p>
                    </div>

                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center">
                      <p className="text-2xl font-black text-red-500">100%</p>
                      <p className="text-xs text-zinc-400">Prépa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-6">
              <Medal size={16} />
              Nouvelle section
            </div>

            <h2 className="text-5xl md:text-6xl font-black leading-tight">
              Prépare ton
              <span className="block text-red-500">challenge HYROX</span>
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed mt-8 max-w-2xl">
              HYROX demande plus qu’un simple entraînement classique.
              <br />
              Ici, on travaille la course, la puissance, l’endurance musculaire
              et la gestion d’effort pour arriver prêt, confiant et performant.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              {hyroxPoints.map((point, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5"
                >
                  <div className="h-11 w-11 rounded-2xl bg-red-600 flex items-center justify-center text-white mb-4">
                    {point.icon}
                  </div>

                  <h3 className="font-black text-lg">{point.title}</h3>

                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    {point.description}
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
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-4 font-black hover:scale-[1.03] transition shadow-lg shadow-red-900/30"
              >
                Voir les packs
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-black hover:bg-white/10 transition"
              >
                <Flame size={18} />
                Me préparer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HyroxSection;