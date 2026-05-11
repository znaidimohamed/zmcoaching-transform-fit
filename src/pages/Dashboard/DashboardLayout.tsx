import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Users,
  Image,
  Box,
  LogOut,
  Apple,
  Dumbbell,
  TrendingUp,
  GraduationCap,
  Inbox,
  ShoppingCart,
  CalendarDays,
  ClipboardCheck,
  Menu,
  X,
  Target,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/users", label: "Utilisateurs", icon: Users },
  { to: "/dashboard/transformations", label: "Transformations", icon: Image },
  { to: "/dashboard/packs", label: "Packs", icon: Box },
  { to: "/dashboard/nutrition", label: "Nutrition", icon: Apple },
  { to: "/dashboard/training", label: "Training", icon: Dumbbell },
  { to: "/dashboard/courses", label: "Courses", icon: GraduationCap },
  { to: "/dashboard/checkins", label: "Check-ins", icon: ClipboardCheck },
  { to: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { to: "/dashboard/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/dashboard/purchase-requests", label: "Purchases", icon: ShoppingCart },
  { to: "/dashboard/leads", label: "Leads", icon: Inbox },
];

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "bg-red-600/20 border border-red-500/40 text-white shadow-lg shadow-red-950/30"
        : "border border-transparent text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/10"
    }`;

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-900 shadow-lg shadow-red-900/30">
          <Target size={26} />
        </div>

        <div>
          <h1 className="text-2xl font-black leading-none">ZM Coaching</h1>
          <p className="mt-1 text-sm text-zinc-500">Admin Control Center</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="dashboard-active"
                      className="absolute inset-0 rounded-2xl bg-red-600/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}

                  <Icon
                    size={20}
                    className={`relative z-10 ${
                      isActive ? "text-red-400" : "text-zinc-500 group-hover:text-red-400"
                    }`}
                  />

                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-black text-red-300 transition-all duration-300 hover:bg-red-600 hover:text-white"
      >
        <LogOut size={20} />
        Déconnexion
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.14),transparent_35%)] pointer-events-none" />

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 overflow-y-auto border-r border-white/10 bg-black/80 p-6 backdrop-blur-2xl lg:block">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 px-4 py-4 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-900">
              <Target size={22} />
            </div>

            <div className="text-left">
              <p className="font-black leading-none">ZM Coaching</p>
              <p className="mt-1 text-xs text-zinc-500">Admin</p>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed left-0 top-0 z-50 h-screen w-[85vw] max-w-[320px] overflow-y-auto border-r border-white/10 bg-black p-6 lg:hidden"
            >
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="relative z-10 p-4 sm:p-6 lg:ml-72 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-[1600px]"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;