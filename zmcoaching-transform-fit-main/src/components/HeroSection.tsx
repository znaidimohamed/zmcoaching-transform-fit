import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Target, TrendingUp } from "lucide-react";

const stats = [
  { value: "100+", label: "Clients Transformés" },
  { value: "7 ans", label: "d'Expérience" },
  { value: "98%", label: "Satisfaction" },
];

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/22a7dc04-5f44-46b4-8854-5c840f92a1bf.png"
          alt="ZM Coaching - Transformation Fitness"
          className="w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_35%)]" />
      </div>

      <div className="absolute top-28 left-10 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
      <div className="absolute bottom-40 right-24 h-20 w-20 rounded-full bg-red-600/20 blur-2xl" />
      <div className="absolute top-1/3 right-1/3 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-8 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            COACHING PRÉMIUM
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6">
            <span className="bg-gradient-to-r from-red-500 via-white to-red-500 bg-clip-text text-transparent">
              Online Coaching
            </span>
            <span className="block text-4xl md:text-5xl mt-4 text-white">
              Power & Performance
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-zinc-300 mb-10 leading-relaxed max-w-2xl">
            Nutrition plans & training programs adaptés à ton mode de vie.
            Commence ta transformation avec un suivi clair, structuré et
            motivant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Button
              size="lg"
              onClick={() => scrollToSection("packs")}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-lg px-8 py-7 font-black shadow-lg shadow-red-900/30 hover:scale-[1.02] transition"
            >
              <Target className="mr-2 h-5 w-5" />
              Découvrir les Packs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("transformations")}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl text-white hover:bg-white hover:text-black text-lg px-8 py-7 font-black transition group"
            >
              <Play className="mr-2 h-5 w-5" />
              Voir les Résultats
              <TrendingUp className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-5 text-center hover:border-red-500/40 transition"
              >
                <div className="text-3xl font-black text-red-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;