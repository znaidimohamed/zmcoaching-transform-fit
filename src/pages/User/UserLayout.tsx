import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Apple,
  Dumbbell,
  LogOut,
  Target,
  TrendingUp,
  CalendarDays,
  ClipboardCheck,
  Menu,
  X,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/user/nutrition", label: "Ma Nutrition", icon: Apple },
  { to: "/user/training", label: "Mon Training", icon: Dumbbell },
  { to: "/user/schedule", label: "Mon Planning", icon: CalendarDays },
  { to: "/user/checkins", label: "Check-in", icon: ClipboardCheck },
  { to: "/user/progress", label: "Mon Progress", icon: TrendingUp },
];

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isNutritionActive =
    location.pathname === "/user" || location.pathname === "/user/nutrition";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 whitespace-nowrap ${
      isActive
        ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
        : "text-zinc-300 hover:bg-white/10 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "bg-red-600 text-white"
        : "text-zinc-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.18),transparent_35%)] pointer-events-none" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 text-left"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-900 shadow-lg shadow-red-900/30 transition group-hover:scale-105">
              <Target size={24} />
            </div>

            <div>
              <h1 className="text-lg font-black leading-none sm:text-2xl">
                ZM Coaching
              </h1>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Espace Client
              </p>
            </div>
          </button>

          <nav className="hidden max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 shadow-xl backdrop-blur-xl xl:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.to === "/user/nutrition"
                  ? isNutritionActive
                  : location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={() =>
                    active
                      ? "group relative inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition whitespace-nowrap"
                      : "group relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white whitespace-nowrap"
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
            >
              <Home size={18} />
              Accueil
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-black shadow-lg transition hover:bg-red-600 hover:text-white"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 xl:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm xl:hidden"
            />

            <motion.aside
              initial={{ x: 340 }}
              animate={{ x: 0 }}
              exit={{ x: 340 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed right-0 top-0 z-[60] h-screen w-[85vw] max-w-[340px] overflow-y-auto border-l border-white/10 bg-black p-6 xl:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Menu Client</h2>
                  <p className="text-sm text-zinc-500">ZM Coaching</p>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.to === "/user/nutrition"
                      ? isNutritionActive
                      : location.pathname === item.to;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={() =>
                        active
                          ? "flex items-center gap-3 rounded-2xl bg-red-600 px-5 py-4 text-sm font-bold text-white"
                          : "flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      }
                    >
                      <Icon size={20} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="my-6 h-px bg-white/10" />

              <button
                onClick={() => {
                  navigate("/");
                  setMobileOpen(false);
                }}
                className="mb-2 flex w-full items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/20"
              >
                <Home size={20} />
                Accueil
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl bg-red-500/10 px-5 py-4 text-sm font-black text-red-300 transition hover:bg-red-600 hover:text-white"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-black via-black to-red-950/40 p-6 backdrop-blur-xl sm:mb-10 sm:rounded-[2.5rem] sm:p-8 md:p-10"
        >
          <p className="text-xs font-black uppercase tracking-[0.35em] text-red-400">
            Bienvenue
          </p>

          <h2 className="mt-4 text-4xl font-black leading-none sm:text-5xl md:text-6xl">
            Salut,{" "}
            <span className="text-red-500">
              {user?.fullName || "Athlète"}
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Retrouve ici tes programmes, ton suivi et ton évolution.
          </p>
        </motion.section>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default UserLayout;