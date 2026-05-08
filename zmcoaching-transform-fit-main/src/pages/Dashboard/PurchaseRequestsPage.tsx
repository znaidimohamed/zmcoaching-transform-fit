import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  CreditCard,
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
} from "lucide-react";

const PurchaseRequestsPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/purchase-requests/admin");
      setRequests(res.data.requests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (
    id: string,
    status: "pending" | "paid" | "cancelled"
  ) => {
    await api.patch(`/purchase-requests/${id}/status`, { status });
    fetchRequests();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette demande d'achat ?")) return;

    await api.delete(`/purchase-requests/${id}`);
    fetchRequests();
  };

  const pending = requests.filter((r) => r.status === "pending").length;
  const paid = requests.filter((r) => r.status === "paid").length;
  const cancelled = requests.filter((r) => r.status === "cancelled").length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Manual payments
        </p>

        <h1 className="text-4xl font-black mt-2">
          Purchase <span className="text-red-500">Requests</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Les demandes d’achat envoyées depuis les packs et les courses.
        </p>
      </div>

      <section className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total" value={requests.length} icon={<CreditCard />} />
        <StatCard title="Pending" value={pending} icon={<Clock />} />
        <StatCard title="Paid" value={paid} icon={<CheckCircle2 />} />
        <StatCard title="Cancelled" value={cancelled} icon={<XCircle />} />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <Package size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Liste des demandes</h2>
            <p className="text-sm text-zinc-400">
              {requests.length} demande(s)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : requests.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucune demande d’achat pour le moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {requests.map((request) => (
              <article
                key={request._id}
                className={`rounded-[2rem] border p-6 bg-black/50 transition ${
                  request.status === "pending"
                    ? "border-red-500/50 shadow-lg shadow-red-900/10"
                    : request.status === "paid"
                    ? "border-green-500/30"
                    : "border-zinc-700 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-black text-zinc-300 mb-3">
                      {request.itemType === "course" ? "Course" : "Pack"}
                    </span>

                    <h3 className="text-xl font-black">
                      {request.itemTitle}
                    </h3>

                    <p className="text-3xl font-black text-red-500 mt-2">
                      {request.itemPrice}
                    </p>

                    <p className="text-xs text-zinc-500 mt-2">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500 mb-2">Client</p>

                  <p className="font-black">
                    {request.user?.fullName || "Utilisateur"}
                  </p>

                  {request.user?.email && (
                    <a
                      href={`mailto:${request.user.email}`}
                      className="mt-3 flex items-center gap-3 text-zinc-300 hover:text-red-400 transition"
                    >
                      <Mail size={17} />
                      <span className="text-sm break-all">
                        {request.user.email}
                      </span>
                    </a>
                  )}

                  {request.user?.phone && (
                    <a
                      href={`tel:${request.user.phone}`}
                      className="mt-2 flex items-center gap-3 text-zinc-300 hover:text-red-400 transition"
                    >
                      <Phone size={17} />
                      <span className="text-sm">{request.user.phone}</span>
                    </a>
                  )}
                </div>

                {request.message && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-zinc-500 mb-2">Message</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {request.message}
                    </p>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateStatus(request._id, "pending")}
                    className={`rounded-2xl px-3 py-3 text-xs font-black transition ${
                      request.status === "pending"
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => updateStatus(request._id, "paid")}
                    className={`rounded-2xl px-3 py-3 text-xs font-black transition ${
                      request.status === "paid"
                        ? "bg-green-600 text-white"
                        : "bg-zinc-800 hover:bg-green-600 text-zinc-300 hover:text-white"
                    }`}
                  >
                    Paid
                  </button>

                  <button
                    onClick={() => updateStatus(request._id, "cancelled")}
                    className={`rounded-2xl px-3 py-3 text-xs font-black transition ${
                      request.status === "cancelled"
                        ? "bg-zinc-600 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    Cancel
                  </button>
                </div>

                <button
                  onClick={() => remove(request._id)}
                  className="mt-3 w-full rounded-2xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2 font-bold"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
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

const StatusBadge = ({ status }: any) => {
  if (status === "paid") {
    return (
      <span className="rounded-full bg-green-600/20 text-green-300 border border-green-500/20 px-3 py-1 text-xs font-black">
        Paid
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span className="rounded-full bg-zinc-700 text-zinc-300 px-3 py-1 text-xs font-black">
        Cancelled
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-600 text-white px-3 py-1 text-xs font-black">
      Pending
    </span>
  );
};

export default PurchaseRequestsPage;