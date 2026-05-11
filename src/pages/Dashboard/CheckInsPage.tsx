import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Camera,
  ClipboardCheck,
  Mail,
  Moon,
  Phone,
  Send,
  Trash2,
  Weight,
  Zap,
} from "lucide-react";

const API_URL = "https://zmcoachingbackend.onrender.com/api";

const CheckInsPage = () => {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});

  const fetchCheckIns = async () => {
    try {
      const res = await api.get("/checkins/admin");
      setCheckIns(res.data.checkIns);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const sendFeedback = async (id: string) => {
    const feedback = feedbackText[id];

    if (!feedback?.trim()) return;

    await api.patch(`/checkins/${id}/feedback`, {
      feedback,
    });

    setFeedbackText({
      ...feedbackText,
      [id]: "",
    });

    fetchCheckIns();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce check-in ?")) return;

    await api.delete(`/checkins/${id}`);
    fetchCheckIns();
  };

  const withPhotos = checkIns.filter(
    (c) => c.frontPhoto || c.sidePhoto || c.backPhoto
  ).length;

  const thisWeek = checkIns.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Weekly check-ins
        </p>

        <h1 className="text-4xl font-black mt-2">
          Client <span className="text-red-500">Check-ins</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Suivi envoyé par les clients: poids, énergie, sommeil, notes, photos
          et feedback coach.
        </p>
      </div>

      <section className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Total check-ins"
          value={checkIns.length}
          icon={<ClipboardCheck />}
        />
        <StatCard title="Avec photos" value={withPhotos} icon={<Camera />} />
        <StatCard title="Cette semaine" value={thisWeek} icon={<Weight />} />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
            <ClipboardCheck size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Liste des check-ins</h2>
            <p className="text-sm text-zinc-400">
              {checkIns.length} check-in(s)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : checkIns.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun check-in reçu pour le moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {checkIns.map((checkIn) => (
              <article
                key={checkIn._id}
                className="rounded-[2rem] border border-white/10 bg-black/50 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-red-400 text-sm font-bold">
                      {new Date(checkIn.date).toLocaleDateString()}
                    </p>

                    <h3 className="text-3xl font-black mt-2">
                      {checkIn.weight} kg
                    </h3>
                  </div>

                  <button
                    onClick={() => remove(checkIn._id)}
                    className="rounded-2xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-black">
                    {checkIn.user?.fullName || "Client"}
                  </p>

                  {checkIn.user?.email && (
                    <a
                      href={`mailto:${checkIn.user.email}`}
                      className="mt-3 flex items-center gap-3 text-zinc-300 hover:text-red-400 transition"
                    >
                      <Mail size={17} />
                      <span className="text-sm break-all">
                        {checkIn.user.email}
                      </span>
                    </a>
                  )}

                  {checkIn.user?.phone && (
                    <a
                      href={`tel:${checkIn.user.phone}`}
                      className="mt-2 flex items-center gap-3 text-zinc-300 hover:text-red-400 transition"
                    >
                      <Phone size={17} />
                      <span className="text-sm">{checkIn.user.phone}</span>
                    </a>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniInfo
                    icon={<Moon size={17} />}
                    label="Sommeil"
                    value={checkIn.sleep ? `${checkIn.sleep}/10` : "-"}
                  />

                  <MiniInfo
                    icon={<Zap size={17} />}
                    label="Énergie"
                    value={checkIn.energy ? `${checkIn.energy}/10` : "-"}
                  />
                </div>

                {checkIn.mood && (
                  <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                    Mood: {checkIn.mood}
                  </p>
                )}

                {checkIn.notes && (
                  <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-xs text-red-300 font-bold mb-2">
                      Notes client
                    </p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {checkIn.notes}
                    </p>
                  </div>
                )}

                <PhotoGrid checkIn={checkIn} />

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-black mb-3">Discussion coach</p>

                  {checkIn.coachFeedback && (
                    <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                      <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                        {checkIn.coachFeedback}
                      </p>

                      {checkIn.feedbackDate && (
                        <p className="text-xs text-red-300 mt-3">
                          {new Date(checkIn.feedbackDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  <textarea
                    value={feedbackText[checkIn._id] || ""}
                    onChange={(e) =>
                      setFeedbackText({
                        ...feedbackText,
                        [checkIn._id]: e.target.value,
                      })
                    }
                    placeholder="Écrire un feedback pour ce client..."
                    className="w-full min-h-24 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500 text-sm resize-none"
                  />

                  <button
                    onClick={() => sendFeedback(checkIn._id)}
                    className="mt-3 w-full rounded-2xl bg-red-600 py-3 font-black hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <Send size={17} />
                    Envoyer feedback
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const PhotoGrid = ({ checkIn }: any) => {
  const photos = [
    { label: "Face", url: checkIn.frontPhoto },
    { label: "Profil", url: checkIn.sidePhoto },
    { label: "Dos", url: checkIn.backPhoto },
  ].filter((p) => p.url);

  if (photos.length === 0) return null;

  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {photos.map((photo) => (
        <a
          key={photo.label}
          href={`${API_URL}${photo.url}`}
          target="_blank"
          rel="noreferrer"
          className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group"
        >
          <img
            src={`${API_URL}${photo.url}`}
            alt={photo.label}
            className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
          />

          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-black">
            {photo.label}
          </span>
        </a>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex items-center justify-between shadow-2xl">
    <div>
      <p className="text-sm text-zinc-400">{title}</p>
      <h3 className="text-3xl font-black mt-2">{value}</h3>
    </div>

    <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

const MiniInfo = ({ icon, label, value }: any) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <div className="text-red-400">{icon}</div>
    <p className="text-xs text-zinc-500 mt-2">{label}</p>
    <p className="font-black">{value}</p>
  </div>
);

export default CheckInsPage;