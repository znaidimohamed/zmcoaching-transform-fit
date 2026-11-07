import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Activity, Calendar, LineChart, MessageSquare, TrendingUp } from "lucide-react";

const MyProgressPage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/progress/me");
        setEntries(res.data.entries);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const latest = useMemo(() => {
    if (entries.length === 0) return null;
    return entries[entries.length - 1];
  }, [entries]);

  const first = useMemo(() => {
    if (entries.length === 0) return null;
    return entries[0];
  }, [entries]);

  const weightDifference = useMemo(() => {
    if (!first || !latest) return null;
    return Number((latest.weight - first.weight).toFixed(1));
  }, [first, latest]);

  const maxWeight = Math.max(...entries.map((e) => e.weight), 1);
  const minWeight = Math.min(...entries.map((e) => e.weight), 0);
  const range = maxWeight - minWeight || 1;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Evolution client
        </p>

        <h1 className="text-4xl font-black mt-2">
          Mon <span className="text-red-500">Progress</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Suis ton évolution physique et les notes ajoutées par ton coach.
        </p>
      </div>

      {loading ? (
        <div className="text-zinc-400 py-12 text-center">Chargement...</div>
      ) : entries.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-16 text-center text-zinc-500">
          Aucun suivi progress n’est encore ajouté à ton compte.
        </div>
      ) : (
        <>
          <section className="grid md:grid-cols-3 gap-6">
            <StatCard
              title="Dernier poids"
              value={`${latest.weight} kg`}
              icon={<TrendingUp size={24} />}
            />

            <StatCard
              title="Evolution"
              value={
                weightDifference === null
                  ? "-"
                  : `${weightDifference > 0 ? "+" : ""}${weightDifference} kg`
              }
              icon={<Activity size={24} />}
            />

            <StatCard
              title="Entrées"
              value={entries.length}
              icon={<Calendar size={24} />}
            />
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                <LineChart size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black">Evolution du poids</h2>
                <p className="text-sm text-zinc-400">
                  Visualisation simple de ta progression
                </p>
              </div>
            </div>

            <div className="h-72 flex items-end gap-3 border-b border-white/10 pb-4">
              {entries.map((entry) => {
                const height = ((entry.weight - minWeight) / range) * 180 + 40;

                return (
                  <div
                    key={entry._id}
                    className="flex-1 flex flex-col items-center gap-3"
                  >
                    <div className="text-xs text-zinc-400 font-bold">
                      {entry.weight}kg
                    </div>

                    <div
                      className="w-full max-w-12 rounded-t-2xl bg-gradient-to-t from-red-700 to-red-400 shadow-lg shadow-red-900/30"
                      style={{ height }}
                    />

                    <div className="text-[10px] text-zinc-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
                <MessageSquare size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black">Historique</h2>
                <p className="text-sm text-zinc-400">
                  Mesures et notes de ton coach
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[...entries].reverse().map((entry) => (
                <article
                  key={entry._id}
                  className="rounded-3xl border border-white/10 bg-black/40 p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-red-400 text-sm font-bold">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>

                      <h3 className="text-3xl font-black mt-1">
                        {entry.weight} kg
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {entry.waist && <Badge label={`Taille: ${entry.waist} cm`} />}
                      {entry.chest && <Badge label={`Poitrine: ${entry.chest} cm`} />}
                      {entry.arms && <Badge label={`Bras: ${entry.arms} cm`} />}
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-zinc-500 mb-1">Note coach</p>
                      <p className="text-zinc-300">{entry.notes}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex items-center justify-between">
    <div>
      <p className="text-sm text-zinc-400">{title}</p>
      <h3 className="text-3xl font-black mt-2">{value}</h3>
    </div>

    <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

const Badge = ({ label }: any) => (
  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
    {label}
  </span>
);

export default MyProgressPage;