import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Activity,
  CalendarDays,
  CreditCard,
  Inbox,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardOverviewPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/dashboard/admin");
      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
      setError("Impossible de charger les statistiques du dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-xl rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={42} />

          <h2 className="text-2xl font-black text-white">
            Dashboard indisponible
          </h2>

          <p className="mt-3 text-zinc-400">{error}</p>

          <button
            onClick={fetchDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700"
          >
            <RefreshCcw size={18} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const totals = stats?.totals || {};
  const latest = stats?.latest || {};

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
            Admin overview
          </p>

          <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">
            Dashboard <span className="text-red-500">Analytics</span>
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Vue globale sur les clients, achats, leads, programmes et progress.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </motion.div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          title="Total Clients"
          value={totals.totalUsers || 0}
          icon={<Users />}
          helper="Clients enregistrés"
        />

        <StatCard
          index={1}
          title="Clients Actifs"
          value={totals.activeUsers || 0}
          icon={<Activity />}
          helper="Comptes actifs"
        />

        <StatCard
          index={2}
          title="Nouveaux Leads"
          value={totals.newLeads || 0}
          icon={<Inbox />}
          helper="À contacter"
        />

        <StatCard
          index={3}
          title="Purchases Pending"
          value={totals.pendingPurchases || 0}
          icon={<ShoppingCart />}
          helper="En attente"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MiniCard
          index={0}
          title="Courses actifs"
          value={totals.totalCourses || 0}
        />

        <MiniCard
          index={1}
          title="Packs actifs"
          value={totals.totalPacks || 0}
        />

        <MiniCard
          index={2}
          title="Nutrition plans"
          value={totals.totalNutritionPlans || 0}
        />

        <MiniCard
          index={3}
          title="Training programs"
          value={totals.totalTrainingPrograms || 0}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel
          title="Derniers Leads"
          icon={<Inbox size={22} />}
          empty="Aucun lead récent."
          count={latest.leads?.length || 0}
          index={0}
        >
          {latest.leads?.map((lead: any) => (
            <ActivityItem
              key={lead._id}
              title={lead.name}
              subtitle={lead.email}
              badge={lead.status}
              date={lead.createdAt}
            />
          ))}
        </Panel>

        <Panel
          title="Derniers Achats"
          icon={<CreditCard size={22} />}
          empty="Aucune demande récente."
          count={latest.purchases?.length || 0}
          index={1}
        >
          {latest.purchases?.map((purchase: any) => (
            <ActivityItem
              key={purchase._id}
              title={purchase.itemTitle}
              subtitle={purchase.user?.fullName || "Utilisateur"}
              badge={purchase.status}
              date={purchase.createdAt}
            />
          ))}
        </Panel>

        <Panel
          title="Derniers Progress"
          icon={<TrendingUp size={22} />}
          empty="Aucun progress récent."
          count={latest.progress?.length || 0}
          index={2}
        >
          {latest.progress?.map((entry: any) => (
            <ActivityItem
              key={entry._id}
              title={`${entry.weight} kg`}
              subtitle={entry.user?.fullName || "Utilisateur"}
              badge="progress"
              date={entry.createdAt}
            />
          ))}
        </Panel>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <HighlightCard
          index={0}
          icon={<CalendarDays />}
          title="Schedules actifs"
          value={totals.activeSchedules || 0}
          description="Séances programmées visibles côté client."
        />

        <HighlightCard
          index={1}
          icon={<Package />}
          title="Paid purchases"
          value={totals.paidPurchases || 0}
          description="Demandes marquées comme payées manuellement."
        />

        <HighlightCard
          index={2}
          icon={<Inbox />}
          title="Total leads"
          value={totals.totalLeads || 0}
          description="Demandes reçues depuis la homepage."
        />
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon, helper, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.07 }}
    whileHover={{ y: -6 }}
    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-red-500/40"
  >
    <div className="absolute right-0 top-0 h-24 w-24 bg-red-600/20 blur-2xl transition group-hover:bg-red-600/30" />

    <div className="relative flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-zinc-400">{title}</p>

        <h3 className="mt-2 text-4xl font-black text-white">
          {value}
        </h3>

        <p className="mt-2 text-xs text-zinc-600">{helper}</p>
      </div>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-900/30 transition group-hover:scale-110">
        {icon}
      </div>
    </div>
  </motion.div>
);

const MiniCard = ({ title, value, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 + index * 0.06 }}
    className="rounded-[2rem] border border-white/10 bg-black/40 p-5 transition hover:border-red-500/30 hover:bg-white/[0.04]"
  >
    <p className="text-sm text-zinc-500">{title}</p>
    <p className="mt-2 text-3xl font-black text-red-500">{value}</p>
  </motion.div>
);

const Panel = ({ title, icon, children, empty, count, index }: any) => {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 + index * 0.08 }}
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600">
            {icon}
          </div>

          <h2 className="text-xl font-black">{title}</h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-zinc-300">
          {count}
        </span>
      </div>

      <div className="space-y-4">
        {hasChildren ? (
          children
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/30 p-5 text-center">
            <p className="text-sm text-zinc-500">{empty}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ActivityItem = ({ title, subtitle, badge, date }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:border-red-500/30 hover:bg-black/60"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-black">{title}</p>
        <p className="mt-1 truncate text-sm text-zinc-500">{subtitle}</p>
      </div>

      <span className="shrink-0 rounded-full border border-red-500/20 bg-red-600/15 px-3 py-1 text-xs font-black text-red-300">
        {badge}
      </span>
    </div>

    <p className="mt-3 text-xs text-zinc-600">
      {date ? new Date(date).toLocaleString() : "Date inconnue"}
    </p>
  </motion.div>
);

const HighlightCard = ({ icon, title, value, description, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.22 + index * 0.08 }}
    whileHover={{ y: -6 }}
    className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/30 to-black p-6 shadow-2xl transition hover:border-red-500/40"
  >
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600">
      {icon}
    </div>

    <p className="text-sm text-zinc-400">{title}</p>
    <h3 className="mt-2 text-4xl font-black text-red-500">{value}</h3>
    <p className="mt-3 text-sm leading-relaxed text-zinc-500">
      {description}
    </p>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div>
      <div className="mb-3 h-4 w-40 animate-pulse rounded-xl bg-white/10" />
      <div className="mb-4 h-12 w-80 max-w-full animate-pulse rounded-2xl bg-white/10" />
      <div className="h-5 w-[520px] max-w-full animate-pulse rounded-xl bg-white/10" />
    </div>

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-[150px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]"
        />
      ))}
    </section>

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-[110px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.03]"
        />
      ))}
    </section>

    <section className="grid gap-6 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[340px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]"
        />
      ))}
    </section>
  </div>
);

export default DashboardOverviewPage;