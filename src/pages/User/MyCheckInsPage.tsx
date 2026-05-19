import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Zap,
  Moon,
  Trash2,
  Weight,
} from "lucide-react";

const API_URL = "https://zmcoachingbackend.onrender.com/api";

const MyCheckInsPage = () => {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    date: "",
    weight: "",
    sleep: "",
    energy: "",
    mood: "",
    notes: "",
    frontPhoto: null as File | null,
    sidePhoto: null as File | null,
    backPhoto: null as File | null,
  });

  const fetchCheckIns = async () => {
    try {
      const res = await api.get("/checkins/me");
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

  const submitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const formData = new FormData();

      formData.append("date", form.date || new Date().toISOString());
      formData.append("weight", form.weight);
      formData.append("sleep", form.sleep);
      formData.append("energy", form.energy);
      formData.append("mood", form.mood);
      formData.append("notes", form.notes);

      if (form.frontPhoto) formData.append("frontPhoto", form.frontPhoto);
      if (form.sidePhoto) formData.append("sidePhoto", form.sidePhoto);
      if (form.backPhoto) formData.append("backPhoto", form.backPhoto);

      await api.post("/checkins/me", formData);

      setForm({
        date: "",
        weight: "",
        sleep: "",
        energy: "",
        mood: "",
        notes: "",
        frontPhoto: null,
        sidePhoto: null,
        backPhoto: null,
      });

      fetchCheckIns();
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Weekly update
        </p>

        <h1 className="text-4xl font-black mt-2">
          Mon <span className="text-red-500">Check-in</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Envoie ton poids, ton ressenti et tes photos à ton coach.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <form
          onSubmit={submitCheckIn}
          className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
              <ClipboardCheck size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">Envoyer check-in</h2>
              <p className="text-sm text-zinc-400">
                Remplis ton suivi de la semaine.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => setForm({ ...form, date: v })}
            />

            <Field
              label="Poids"
              type="number"
              value={form.weight}
              onChange={(v) => setForm({ ...form, weight: v })}
              placeholder="Ex: 78"
              required
            />

            <Field
              label="Sommeil /10"
              type="number"
              value={form.sleep}
              onChange={(v) => setForm({ ...form, sleep: v })}
              placeholder="Ex: 7"
            />

            <Field
              label="Énergie /10"
              type="number"
              value={form.energy}
              onChange={(v) => setForm({ ...form, energy: v })}
              placeholder="Ex: 8"
            />

            <Field
              label="Mood"
              value={form.mood}
              onChange={(v) => setForm({ ...form, mood: v })}
              placeholder="Ex: motivé / fatigué"
            />

            <div className="md:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Comment s’est passée ta semaine ?"
                className="w-full min-h-28 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <PhotoInput
              label="Photo face"
              onChange={(file) => setForm({ ...form, frontPhoto: file })}
              file={form.frontPhoto}
            />

            <PhotoInput
              label="Photo profil"
              onChange={(file) => setForm({ ...form, sidePhoto: file })}
              file={form.sidePhoto}
            />

            <PhotoInput
              label="Photo dos"
              onChange={(file) => setForm({ ...form, backPhoto: file })}
              file={form.backPhoto}
            />

            <button
              type="submit"
              disabled={sending}
              className="md:col-span-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.01] transition disabled:opacity-60 shadow-lg shadow-red-900/30"
            >
              {sending ? "Envoi..." : "Envoyer mon check-in"}
            </button>
          </div>
        </form>

        <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/30 to-black p-6 shadow-2xl">
          <h3 className="text-2xl font-black mb-4">
            Conseils check-in
          </h3>

          <div className="space-y-4 text-zinc-300">
            {[
              "Prends les photos avec la même lumière.",
              "Garde la même distance caméra chaque semaine.",
              "Note honnêtement ton énergie et ton sommeil.",
              "Envoie ton check-in le même jour chaque semaine.",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="text-red-400 mt-0.5 shrink-0"
                />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <ClipboardCheck size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Mes check-ins</h2>
            <p className="text-sm text-zinc-400">
              {checkIns.length} check-in(s)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : checkIns.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-16 text-center text-zinc-500">
            Aucun check-in envoyé pour le moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {checkIns.map((checkIn) => (
              <CheckInCard key={checkIn._id} checkIn={checkIn} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: any) => (
  <div>
    <label className="text-sm text-zinc-300 mb-2 block">{label}</label>
    <input
      required={required}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
    />
  </div>
);

const PhotoInput = ({ label, onChange, file }: any) => (
  <label className="cursor-pointer rounded-2xl border border-white/10 bg-black/60 p-4 hover:border-red-500/50 transition">
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center">
        <Camera size={20} />
      </div>

      <div>
        <p className="font-bold text-white">{label}</p>
        <p className="text-xs text-zinc-500">
          {file ? file.name : "Choisir une image"}
        </p>
      </div>
    </div>

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => onChange(e.target.files?.[0] || null)}
    />
  </label>
);

const CheckInCard = ({ checkIn }: any) => {
  const photos = [
    checkIn.frontPhoto,
    checkIn.sidePhoto,
    checkIn.backPhoto,
  ].filter(Boolean);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-black/50 p-6">
      <p className="text-red-400 text-sm font-bold">
        {new Date(checkIn.date).toLocaleDateString()}
      </p>

      <h3 className="text-3xl font-black mt-2">{checkIn.weight} kg</h3>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniInfo icon={<Moon size={17} />} label="Sommeil" value={checkIn.sleep ? `${checkIn.sleep}/10` : "-"} />
        <MiniInfo icon={<Zap size={17} />} label="Énergie" value={checkIn.energy ? `${checkIn.energy}/10` : "-"} />
      </div>

      {checkIn.mood && (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          Mood: {checkIn.mood}
        </p>
      )}

      {checkIn.notes && (
        <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
          {checkIn.notes}
        </p>
      )}

      {photos.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {photos.map((photo: string, index: number) => {
            const imageUrl = photo.startsWith("http")
              ? photo
              : `${API_URL}${photo}`;

            return (
              <a
                key={index}
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="aspect-square rounded-2xl overflow-hidden border border-white/10"
              >
                <img
                  src={imageUrl}
                  alt="check-in"
                  className="h-full w-full object-cover"
                />
              </a>
            );
          })}
        </div>
      )}
      {checkIn.coachFeedback && (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-xs text-red-300 font-bold mb-2">
            Feedback coach
            </p>

            <p className="text-sm text-zinc-300 leading-relaxed">
            {checkIn.coachFeedback}
            </p>

            {checkIn.feedbackDate && (
            <p className="text-xs text-red-300 mt-3">
                {new Date(checkIn.feedbackDate).toLocaleString()}
            </p>
            )}
        </div>
        )}
    </article>
  );
};

const MiniInfo = ({ icon, label, value }: any) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <div className="text-red-400">{icon}</div>
    <p className="text-xs text-zinc-500 mt-2">{label}</p>
    <p className="font-black">{value}</p>
  </div>
);

export default MyCheckInsPage;