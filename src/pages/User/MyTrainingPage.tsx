import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Dumbbell, FileDown } from "lucide-react";

const API_URL = "https://zmcoachingbackend.onrender.com";

const MyTrainingPage = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPrograms = async () => {
      try {
        const res = await api.get("/training-programs/me");
        setPrograms(res.data.programs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPrograms();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Espace client
        </p>

        <h1 className="text-4xl font-black mt-2">
          Mon <span className="text-red-500">Training</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Voici les programmes training assignés par ton coach.
        </p>
      </div>

      {loading ? (
        <div className="text-zinc-400 py-12 text-center">
          Chargement...
        </div>
      ) : programs.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-16 text-center text-zinc-500">
          Aucun programme training n’est encore assigné à ton compte.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {programs.map((program) => (
            <article
              key={program._id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-7">
                <Dumbbell size={26} />
              </div>

              <h3 className="text-2xl font-black">{program.name}</h3>

              <div className="mt-4 flex gap-3 flex-wrap">
                <span className="rounded-full bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 text-xs font-bold">
                  {program.level}
                </span>

                <span className="rounded-full bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 text-xs font-bold">
                  {program.duration}
                </span>
              </div>

              <p className="text-zinc-400 text-sm mt-5 leading-relaxed">
                {program.description}
              </p>

              {program.pdfUrl && (
                <a
                  href={`${API_URL}${program.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-black hover:bg-red-700 transition"
                >
                  <FileDown size={18} />
                  Ouvrir PDF
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrainingPage;