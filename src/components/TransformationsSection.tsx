import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "https://zmcoachingbackend.onrender.com/api";

const TransformationsSection = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTransformations = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/transformations");
        setData(res.data.transformations || []);
      } catch (err) {
        console.log(err);
        setError("Impossible de charger les transformations.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransformations();
  }, []);

  const goToSlide = (index: number) => {
    if (!sliderRef.current) return;

    const firstCard = sliderRef.current.children[0] as HTMLElement | undefined;
    const cardWidth = firstCard?.clientWidth || 390;

    sliderRef.current.scrollTo({
      left: index * (cardWidth + 32),
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  const goPrev = () => {
    const nextIndex = Math.max(activeIndex - 1, 0);
    goToSlide(nextIndex);
  };

  const goNext = () => {
    const nextIndex = Math.min(activeIndex + 1, data.length - 1);
    goToSlide(nextIndex);
  };

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;

    const firstCard = sliderRef.current.children[0] as HTMLElement | undefined;
    const cardWidth = firstCard?.clientWidth || 390;

    const index = Math.round(sliderRef.current.scrollLeft / (cardWidth + 32));
    setActiveIndex(Math.min(Math.max(index, 0), data.length - 1));
  };

  return (
    <section
      id="transformations"
      className="relative overflow-hidden bg-black py-24 sm:py-28 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.18),transparent_30%)]" />

      <div className="absolute left-10 top-28 h-32 w-32 rounded-full bg-red-600/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 sm:mb-16 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-bold text-red-300 backdrop-blur-xl">
            <Sparkles size={16} />
            Real results. Real coaching.
          </div>

          <h2 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Transformations{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
              réelles
            </span>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
            Des résultats construits avec discipline, nutrition intelligente et
            accompagnement personnalisé.
          </p>
        </motion.div>

        {loading && (
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[450px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
              >
                <div className="grid h-64 grid-cols-2">
                  <div className="animate-pulse bg-white/10" />
                  <div className="animate-pulse bg-white/[0.07]" />
                </div>

                <div className="p-6">
                  <div className="mb-4 h-4 w-1/3 animate-pulse rounded-xl bg-white/10" />
                  <div className="mb-4 h-7 w-2/3 animate-pulse rounded-xl bg-white/10" />
                  <div className="mb-2 h-4 w-full animate-pulse rounded-xl bg-white/10" />
                  <div className="h-4 w-4/5 animate-pulse rounded-xl bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-red-500/20 bg-red-500/10 px-6 py-10 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-400" size={34} />
            <p className="font-bold text-red-300">{error}</p>
            <p className="mt-2 text-sm text-zinc-400">
              Vérifie ta connexion ou réessaie plus tard.
            </p>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-400">
              <ImageOff size={28} />
            </div>

            <h3 className="text-2xl font-black text-white">
              Aucune transformation disponible
            </h3>

            <p className="mx-auto mt-3 max-w-md text-zinc-500">
              Les résultats clients seront ajoutés bientôt.
            </p>
          </motion.div>
        )}

        {!loading && !error && data.length > 0 && (
          <>
            <div className="relative">
              <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-24 bg-gradient-to-l from-black to-transparent md:block" />
              <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-16 bg-gradient-to-r from-black to-transparent md:block" />

              {data.length > 1 && (
                <div className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 gap-3 md:flex">
                  <button
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-xl transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <button
                    onClick={goNext}
                    disabled={activeIndex === data.length - 1}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-xl transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              <div
                ref={sliderRef}
                onScroll={handleSliderScroll}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 md:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {data.map((item, index) => (
                  <motion.article
                    key={item._id}
                    initial={{ opacity: 0, y: 45 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="group min-w-[82vw] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-red-500/50 sm:min-w-[360px] md:min-w-[390px] lg:min-w-[400px]"
                  >
                    <div className="relative grid h-64 grid-cols-2 overflow-hidden">
                      <ImageBlock
                        src={`${API_URL}${item.beforeImage}`}
                        label="Before"
                      />

                      <ImageBlock
                        src={`${API_URL}${item.afterImage}`}
                        label="After"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

                      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
                    </div>

                    <div className="p-6">
                      <p className="text-sm font-bold uppercase tracking-widest text-red-400">
                        {item.name}
                      </p>

                      <h3 className="mt-2 text-2xl font-black transition duration-300 group-hover:text-red-400">
                        {item.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                        {item.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                        <span className="text-sm text-zinc-500">
                          Before / After
                        </span>

                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 transition duration-300 group-hover:scale-110 group-hover:bg-red-700">
                          <ArrowRight size={18} />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {data.length > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                {data.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-10 bg-red-600"
                        : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to transformation ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const ImageBlock = ({ src, label }: { src: string; label: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-white/10" />
      )}

      <img
        src={src}
        alt={label}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      <span
        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black backdrop-blur-xl ${
          label === "After"
            ? "bg-red-600 text-white"
            : "bg-black/70 text-zinc-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default TransformationsSection;