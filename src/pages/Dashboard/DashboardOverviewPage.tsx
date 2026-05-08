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
} from "lucide-react";

const DashboardOverviewPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard/admin");
      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-zinc-400 py-20 text-center">
        Chargement dashboard...
      </div>
    );
  }

  const totals = stats?.totals || {};
  const latest = stats?.latest || {};

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Admin overview
        </p>

        <h1 className="text-4xl font-black mt-2">
          Dashboard <span className="text-red-500">Analytics</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Vue globale sur les clients, achats, leads, programmes et progress.
        </p>
      </div>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={totals.totalUsers || 0}
          icon={<Users />}
        />

        <StatCard
          title="Clients Actifs"
          value={totals.activeUsers || 0}
          icon={<Activity />}
        />

        <StatCard
          title="Nouveaux Leads"
          value={totals.newLeads || 0}
          icon={<Inbox />}
        />

        <StatCard
          title="Purchases Pending"
          value={totals.pendingPurchases || 0}
          icon={<ShoppingCart />}
        />
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MiniCard title="Courses actifs" value={totals.totalCourses || 0} />
        <MiniCard title="Packs actifs" value={totals.totalPacks || 0} />
        <MiniCard
          title="Nutrition plans"
          value={totals.totalNutritionPlans || 0}
        />
        <MiniCard
          title="Training programs"
          value={totals.totalTrainingPrograms || 0}
        />
      </section>

      <section className="grid xl:grid-cols-3 gap-6">
        <Panel
          title="Derniers Leads"
          icon={<Inbox size={22} />}
          empty="Aucun lead récent."
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

      <section className="grid md:grid-cols-3 gap-6">
        <HighlightCard
          icon={<CalendarDays />}
          title="Schedules actifs"
          value={totals.activeSchedules || 0}
          description="Séances programmées visibles côté client."
        />

        <HighlightCard
          icon={<Package />}
          title="Paid purchases"
          value={totals.paidPurchases || 0}
          description="Demandes marquées comme payées manuellement."
        />

        <HighlightCard
          icon={<Inbox />}
          title="Total leads"
          value={totals.totalLeads || 0}
          description="Demandes reçues depuis la homepage."
        />
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
    <div className="absolute right-0 top-0 h-24 w-24 bg-red-600/20 blur-2xl" />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-400">{title}</p>
        <h3 className="text-4xl font-black mt-2">{value}</h3>
      </div>

      <div className="h-14 w-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/30">
        {icon}
      </div>
    </div>
  </div>
);

const MiniCard = ({ title, value }: any) => (
  <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5">
    <p className="text-sm text-zinc-500">{title}</p>
    <p className="text-3xl font-black text-red-500 mt-2">{value}</p>
  </div>
);

const Panel = ({ title, icon, children, empty }: any) => {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-2xl bg-red-600 flex items-center justify-center">
          {icon}
        </div>

        <h2 className="text-xl font-black">{title}</h2>
      </div>

      <div className="space-y-4">
        {hasChildren ? (
          children
        ) : (
          <p className="text-zinc-500 text-sm">{empty}</p>
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ title, subtitle, badge, date }: any) => (
  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
      </div>

      <span className="rounded-full bg-red-600/15 border border-red-500/20 text-red-300 px-3 py-1 text-xs font-black">
        {badge}
      </span>
    </div>

    <p className="text-xs text-zinc-600 mt-3">
      {new Date(date).toLocaleString()}
    </p>
  </div>
);

const HighlightCard = ({ icon, title, value, description }: any) => (
  <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/30 to-black p-6 shadow-2xl">
    <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center mb-5">
      {icon}
    </div>

    <p className="text-zinc-400 text-sm">{title}</p>
    <h3 className="text-4xl font-black mt-2 text-red-500">{value}</h3>
    <p className="text-sm text-zinc-500 mt-3">{description}</p>
  </div>
);

export default DashboardOverviewPage;