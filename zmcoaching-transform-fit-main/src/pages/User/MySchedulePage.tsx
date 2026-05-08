import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CalendarDays, Clock, Dumbbell } from "lucide-react";

const MySchedulePage = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get("/schedules/me");
        setSchedules(res.data.schedules);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Weekly scheduler
        </p>

        <h1 className="text-4xl font-black mt-2">
          Mon <span className="text-red-500">Planning</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Les horaires d’entraînement ajoutés par ton coach.
        </p>
      </div>

      {loading ? (
        <div className="text-zinc-400 py-12 text-center">Chargement...</div>
      ) : schedules.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-16 text-center text-zinc-500">
          Aucun planning ajouté à ton compte pour le moment.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {schedules.map((item) => (
            <article
              key={item._id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-6">
                <Dumbbell size={26} />
              </div>

              <p className="text-red-400 text-sm font-bold uppercase tracking-widest">
                {item.day}
              </p>

              <h3 className="text-2xl font-black mt-2">{item.title}</h3>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 flex items-center gap-3">
                <Clock size={20} className="text-red-400" />
                <span className="font-bold">
                  {item.startTime} - {item.endTime}
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4 flex items-center gap-3">
                <CalendarDays size={20} className="text-red-400" />
                <span>{item.type}</span>
              </div>

              {item.notes && (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="text-xs text-red-300 font-bold mb-2">
                    Note coach
                  </p>
                  <p className="text-zinc-300 text-sm">{item.notes}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySchedulePage;