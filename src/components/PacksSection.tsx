import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CheckCircle2, Crown, Flame, Sparkles } from "lucide-react";

const PacksSection = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await api.get("/packs");
        setPacks(res.data.packs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
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
    <section className="relative py-28 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.18),transparent_30%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-5">
            <Sparkles size={16} />
            Coaching plans
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Choisis ton <span className="text-red-500">programme</span>
          </h2>

          <p className="text-zinc-400 mt-5 text-lg">
            Des packs pensés pour t’accompagner selon ton niveau, ton objectif
            et ton rythme.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[520px] rounded-[2rem] border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : packs.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-16 text-center text-zinc-500">
            Aucun pack ajouté pour le moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {packs.map((pack) => (
              <article
                key={pack._id}
                className={`group relative rounded-[2rem] border p-8 overflow-hidden backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                  pack.isPopular
                    ? "border-red-500/70 bg-gradient-to-br from-red-950/50 via-black to-black shadow-2xl shadow-red-900/30"
                    : "border-white/10 bg-white/[0.04] hover:border-red-500/40"
                }`}
              >
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-red-600/20 blur-3xl group-hover:bg-red-600/30 transition" />

                {pack.isPopular && (
                  <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black shadow-lg shadow-red-900/40">
                    <Crown size={15} />
                    Populaire
                  </div>
                )}

                <div className="relative z-10">
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400">
                    {pack.isPopular ? <Flame size={26} /> : <Sparkles size={26} />}
                  </div>

                  <h3 className="text-3xl font-black">{pack.name}</h3>

                  <p className="text-zinc-400 mt-3 min-h-[48px]">
                    {pack.subtitle}
                  </p>

                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-5xl font-black text-red-500">
                      {pack.price}
                    </span>
                    <span className="text-zinc-500 pb-2">
                      {pack.duration}
                    </span>
                  </div>

                  <div className="my-8 h-px bg-white/10" />

                  <ul className="space-y-4">
                    {pack.features?.map((feature: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-zinc-300"
                      >
                        <CheckCircle2
                          size={19}
                          className="text-red-400 mt-0.5 shrink-0"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleBuy(pack, "pack")}
                    className="w-full mt-8 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-3 font-black"
                  >
                    Acheter
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PacksSection;