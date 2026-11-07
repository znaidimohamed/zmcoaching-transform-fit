import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

const stats = [
  {
    value: "100+",
    label: "Clients Transformés",
  },
  {
    value: "7 ans",
    label: "d'Expérience",
  },
  {
    value: "98%",
    label: "Satisfaction",
  },
];

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{
            duration: 6,
            ease: "easeOut",
          }}
          src="/lovable-uploads/22a7dc04-5f44-46b4-8854-5c840f92a1bf.png"
          alt="ZM Coaching - Transformation Fitness"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_35%)]" />
      </div>

      {/* Floating Effects */}
      <div className="absolute top-28 left-10 h-3 w-3 rounded-full bg-red-500 animate-pulse" />

      <div className="absolute bottom-40 right-24 h-20 w-20 rounded-full bg-red-600/20 blur-2xl" />

      <div className="absolute top-1/3 right-1/3 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-8 backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4" />

            COACHING PREMIUM
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-6"
          >
            <span className="bg-gradient-to-r from-red-500 via-white to-red-500 bg-clip-text text-transparent">
              Online Coaching
            </span>

            <span className="block text-3xl sm:text-4xl md:text-5xl mt-5 text-white">
              Power & Performance
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="text-base sm:text-lg md:text-2xl text-zinc-300 mb-10 leading-relaxed max-w-2xl"
          >
            Nutrition plans & training programs adaptés à ton mode de vie.
            Commence ta transformation avec un suivi clair, structuré et
            motivant.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="flex flex-col sm:flex-row gap-4 mb-14"
          >
            <Button
              size="lg"
              onClick={() =>
                scrollToSection("packs")
              }
              className="group rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-base md:text-lg px-8 py-7 font-black shadow-lg shadow-red-900/30 hover:scale-[1.03] transition-all duration-300"
            >
              <Target className="mr-2 h-5 w-5" />

              Découvrir les Packs

              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                scrollToSection(
                  "transformations"
                )
              }
              className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl text-white hover:bg-white hover:text-black text-base md:text-lg px-8 py-7 font-black transition-all duration-300 hover:scale-[1.03]"
            >
              <Play className="mr-2 h-5 w-5" />

              Voir les Résultats

              <TrendingUp className="ml-2 h-5 w-5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -6,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-6 text-center hover:border-red-500/40 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-black text-red-500 mb-2">
                  {stat.value}
                </div>

                <div className="text-zinc-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;