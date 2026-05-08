import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { ArrowRight, Sparkles } from "lucide-react";

const API_URL = "http://localhost:5000";

const TransformationsSection = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTransformations = async () => {
      try {
        const res = await api.get("/transformations");
        setData(res.data.transformations);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransformations();
  }, []);

  const goToSlide = (index: number) => {
    if (!sliderRef.current) return;

    const cardWidth = sliderRef.current.children[0]?.clientWidth || 390;
    sliderRef.current.scrollTo({
      left: index * (cardWidth + 32),
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  return (
    <section
      id="transformations"
      className="relative py-28 bg-black text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.18),transparent_30%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* HEADER كيما كان */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-5">
            <Sparkles size={16} />
            Real results. Real coaching.
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Transformations <span className="text-red-500">réelles</span>
          </h2>

          <p className="text-zinc-400 mt-5 text-lg">
            Des résultats construits avec discipline, nutrition intelligente et
            accompagnement personnalisé.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[430px] rounded-[2rem] bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-16 text-center text-zinc-500">
            Aucune transformation ajoutée pour le moment.
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-black to-transparent" />

              <div
                ref={sliderRef}
                className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 scrollbar-hide"
              >
                {data.map((item) => (
                  <article
                    key={item._id}
                    className="group min-w-[330px] md:min-w-[390px] lg:min-w-[400px] snap-start rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:border-red-500/50 transition duration-300 shadow-2xl shadow-black/40"
                  >
                    <div className="relative grid grid-cols-2 h-64 overflow-hidden">
                      <ImageBlock
                        src={`${API_URL}${item.beforeImage}`}
                        label="Before"
                      />

                      <ImageBlock
                        src={`${API_URL}${item.afterImage}`}
                        label="After"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
                    </div>

                    <div className="p-6">
                      <p className="text-red-400 text-sm font-bold uppercase tracking-widest">
                        {item.name}
                      </p>

                      <h3 className="text-2xl font-black mt-2 group-hover:text-red-400 transition">
                        {item.title}
                      </h3>

                      <p className="text-zinc-400 mt-3 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                        <span className="text-sm text-zinc-500">
                          Before / After
                        </span>

                        <span className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition">
                          <ArrowRight size={18} />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* DOTS تحت التصاور */}
            {data.length > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                {data.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all ${
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
  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={label}
        className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
      />

      <span
        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black ${
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