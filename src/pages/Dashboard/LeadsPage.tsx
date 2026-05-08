import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Inbox,
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

const LeadsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads/admin");
      setLeads(res.data.leads);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const toggleStatus = async (id: string) => {
    await api.patch(`/leads/${id}/toggle-status`);
    fetchLeads();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce lead ?")) return;

    await api.delete(`/leads/${id}`);
    fetchLeads();
  };

  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const contactedLeads = leads.filter((lead) => lead.status === "contacted").length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Client requests
        </p>

        <h1 className="text-4xl font-black mt-2">
          Contact <span className="text-red-500">Leads</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Les demandes envoyées depuis la homepage arrivent ici.
        </p>
      </div>

      <section className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total leads" value={leads.length} icon={<Inbox />} />
        <StatCard title="Nouveaux" value={newLeads} icon={<MessageCircle />} />
        <StatCard title="Contactés" value={contactedLeads} icon={<CheckCircle2 />} />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <Inbox size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Liste des demandes</h2>
            <p className="text-sm text-zinc-400">{leads.length} demande(s)</p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : leads.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun lead pour le moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <article
                key={lead._id}
                className={`rounded-[2rem] border p-6 bg-black/50 transition ${
                  lead.status === "new"
                    ? "border-red-500/50 shadow-lg shadow-red-900/10"
                    : "border-white/10 opacity-80"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{lead.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(lead.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      lead.status === "new"
                        ? "bg-red-600 text-white"
                        : "bg-green-600/20 text-green-300 border border-green-500/20"
                    }`}
                  >
                    {lead.status === "new" ? "New" : "Contacted"}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-3 text-zinc-300 hover:text-red-400 transition"
                  >
                    <Mail size={17} />
                    <span className="text-sm break-all">{lead.email}</span>
                  </a>

                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-3 text-zinc-300 hover:text-red-400 transition"
                    >
                      <Phone size={17} />
                      <span className="text-sm">{lead.phone}</span>
                    </a>
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500 mb-2">Message</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {lead.message}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => toggleStatus(lead._id)}
                    className={`flex-1 rounded-2xl px-4 py-3 font-bold transition ${
                      lead.status === "new"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    }`}
                  >
                    {lead.status === "new" ? "Marquer contacté" : "Marquer new"}
                  </button>

                  <button
                    onClick={() => remove(lead._id)}
                    className="rounded-2xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={18} />
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

export default LeadsPage;