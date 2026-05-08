import { useState } from "react";
import { Download, Gift, Star, Users, Target, BookOpen, Zap, Sparkles, CheckCircle2, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FreeGuideSection = () => {
  const { toast } = useToast();
  const pdfPath = "/PDF/ZM_coaching_guide_Francais_.pdf";

  const handleDownloadPDF = () => {
    toast({
      title: "Guide téléchargé !",
      description: "Votre guide gratuit a été téléchargé.",
    });

    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "ZM_coaching_guide_Francais_.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const guideFeatures = [
    {
      icon: <Target size={22} />,
      title: "Objectifs clairs",
      description: "Apprends à définir un objectif réaliste et mesurable.",
    },
    {
      icon: <BookOpen size={22} />,
      title: "Bases training",
      description: "Les principes simples pour démarrer sans te perdre.",
    },
    {
      icon: <Zap size={22} />,
      title: "Habitudes durables",
      description: "Construis une routine qui tient dans le temps.",
    },
    {
      icon: <Users size={22} />,
      title: "Mindset solide",
      description: "Reste discipliné même quand la motivation baisse.",
    },
  ];

  return (
    <section className="relative py-28 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.25),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.2),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-5">
            <Gift size={16} />
            Guide offert sans engagement
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Télécharge ton guide{" "}
            <span className="text-red-500">transformation</span>
          </h2>

          <p className="text-zinc-400 mt-5 text-lg leading-relaxed">
            Un guide simple et direct pour comprendre les bases du training,
            de la nutrition et du mindset avant de commencer sérieusement.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          {/* GUIDE COVER */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/25 blur-3xl rounded-full" />

            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950/40 to-black p-6">
                <div className="absolute right-5 top-5 rounded-full bg-red-600 px-4 py-2 text-xs font-black shadow-lg shadow-red-900/40">
                  Gratuit
                </div>

                <div className="mx-auto w-56 md:w-64 rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition duration-500">
                  <img
                    src="/lovable-uploads/be154f7c-292a-4aae-9c57-cbe6fd581b1b.png"
                    alt="ZM Coaching Guide Cover"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-3xl font-black">
                    Guide Ultime <span className="text-red-500">ZM Coaching</span>
                  </h3>

                  <p className="text-zinc-400 mt-3">
                    7 pages pour poser les bonnes bases de ta transformation.
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <MiniStat value="PDF" label="Format" />
                    <MiniStat value="7" label="Pages" />
                    <MiniStat value="0 DT" label="Prix" />
                  </div>

                  <button
                    onClick={handleDownloadPDF}
                    className="mt-8 w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.02] transition shadow-lg shadow-red-900/30"
                  >
                    <Download size={20} />
                    Télécharger le guide gratuit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div>
            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h3 className="text-2xl font-black">
                    Ce que tu vas découvrir
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Les fondations avant d’acheter un pack ou un programme.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {guideFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-white/10 bg-black/40 p-5 hover:border-red-500/50 transition"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition">
                      {feature.icon}
                    </div>

                    <h4 className="text-lg font-black">{feature.title}</h4>

                    <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shrink-0">
                    <FileDown size={24} />
                  </div>

                  <div>
                    <h4 className="font-black text-xl">Bonus inclus</h4>

                    <div className="mt-4 space-y-3">
                      {[
                        "Checklist quotidienne de discipline",
                        "Conseils pour éviter les erreurs débutants",
                        "Structure simple training + nutrition",
                        "Méthode pour rester constant",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3 text-zinc-300">
                          <CheckCircle2 size={18} className="text-red-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 p-5">
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className="fill-red-500 text-red-500"
                      />
                    ))}
                    <span className="ml-2 font-black">4.9/5</span>
                  </div>

                  <p className="text-sm text-zinc-500 mt-1">
                    Déjà téléchargé par 200+ personnes
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-300 text-sm font-bold">
                  <Users size={16} />
                  Communauté ZM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MiniStat = ({ value, label }: any) => (
  <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-center">
    <p className="text-2xl font-black text-red-500">{value}</p>
    <p className="text-xs text-zinc-500 mt-1">{label}</p>
  </div>
);

export default FreeGuideSection;