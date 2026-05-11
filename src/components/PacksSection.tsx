import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  CheckCircle2,
  Crown,
  Flame,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const PacksSection = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/packs");
        setPacks(res.data.packs || []);
      } catch (error) {
        console.log(error);
        setError("Impossible de charger les packs pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  const handleBuy = async (item: any, itemType: "course" | "pack") => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Connecte-toi d'abord pour acheter un pack.");
      window.location.href = "/login";
      return;
    }

    try {
      setBuyingId(item._id);

      await api.post("/purchase-requests", {
        itemType,
        itemId: item._id,
        message: `Je veux acheter: ${item.title || item.name}`,
      });

      toast.success("Demande envoyée avec succès.");

      const whatsappMessage = `Bonjour coach, je veux acheter ${
        item.title || item.name
      } au prix de ${item.price}.`;

      window.open(
        `https://wa.me/21653464695?text=${encodeURIComponent(
          whatsappMessage
        )}`,
        "_blank"
      );
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la demande d'achat.");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <section
      id="packs"
      className="relative overflow-hidden bg-black py-24 sm:py-28 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.18),transparent_30%)]" />

      <div className="absolute left-1/2 top-24 h-40 w-40 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />

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
            Coaching plans
          </div>

          <h2 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Choisis ton{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
              programme
            </span>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
            Des packs pensés pour t’accompagner selon ton niveau, ton objectif
            et ton rythme.
          </p>
        </motion.div>

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[520px] rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
              >
                <div className="mb-7 h-14 w-14 animate-pulse rounded-2xl bg-white/10" />
                <div className="mb-4 h-8 w-2/3 animate-pulse rounded-xl bg-white/10" />
                <div className="mb-2 h-4 w-full animate-pulse rounded-xl bg-white/10" />
                <div className="mb-8 h-4 w-4/5 animate-pulse rounded-xl bg-white/10" />
                <div className="mb-8 h-12 w-1/2 animate-pulse rounded-xl bg-white/10" />
                <div className="space-y-4">
                  <div className="h-4 w-full animate-pulse rounded-xl bg-white/10" />
                  <div className="h-4 w-5/6 animate-pulse rounded-xl bg-white/10" />
                  <div className="h-4 w-4/6 animate-pulse rounded-xl bg-white/10" />
                </div>
                <div className="mt-10 h-12 w-full animate-pulse rounded-2xl bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-red-500/20 bg-red-500/10 px-6 py-10 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-400" size={34} />
            <p className="font-bold text-red-300">{error}</p>
            <p className="mt-2 text-sm text-zinc-400">
              Vérifie ta connexion ou réessaie dans quelques instants.
            </p>
          </div>
        )}

        {!loading && !error && packs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-400">
              <Sparkles size={28} />
            </div>

            <h3 className="text-2xl font-black text-white">
              Aucun pack disponible
            </h3>

            <p className="mx-auto mt-3 max-w-md text-zinc-500">
              Les packs seront bientôt ajoutés. Reviens plus tard ou contacte le
              coach directement.
            </p>
          </motion.div>
        )}

        {!loading && !error && packs.length > 0 && (
          <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packs.map((pack, index) => (
              <motion.article
                key={pack._id}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-[2rem] border p-7 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 ${
                  pack.isPopular
                    ? "border-red-500/70 bg-gradient-to-br from-red-950/60 via-black to-black shadow-2xl shadow-red-900/30"
                    : "border-white/10 bg-white/[0.04] hover:border-red-500/40 hover:bg-white/[0.06]"
                }`}
              >
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-red-600/20 blur-3xl transition duration-500 group-hover:bg-red-600/35" />

                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                {pack.isPopular && (
                  <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black shadow-lg shadow-red-900/40">
                    <Crown size={15} />
                    Populaire
                  </div>
                )}

                <div className="relative z-10 flex min-h-full flex-col">
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-600/15 text-red-400 transition duration-300 group-hover:scale-110">
                    {pack.isPopular ? (
                      <Flame size={26} />
                    ) : (
                      <Sparkles size={26} />
                    )}
                  </div>

                  <h3 className="text-3xl font-black leading-tight">
                    {pack.name}
                  </h3>

                  <p className="mt-3 min-h-[48px] leading-relaxed text-zinc-400">
                    {pack.subtitle}
                  </p>

                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-5xl font-black text-red-500">
                      {pack.price}
                    </span>

                    {pack.duration && (
                      <span className="pb-2 text-zinc-500">
                        {pack.duration}
                      </span>
                    )}
                  </div>

                  <div className="my-8 h-px bg-white/10" />

                  <ul className="space-y-4">
                    {pack.features?.map((feature: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-zinc-300"
                      >
                        <CheckCircle2
                          size={19}
                          className="mt-0.5 shrink-0 text-red-400"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleBuy(pack, "pack")}
                    disabled={buyingId === pack._id}
                    className="mt-8 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-3 font-black text-white shadow-lg shadow-red-900/25 transition-all duration-300 hover:scale-[1.02] hover:from-red-700 hover:to-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {buyingId === pack._id ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        Acheter
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PacksSection;