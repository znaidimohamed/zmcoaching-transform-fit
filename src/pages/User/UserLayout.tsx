import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Apple,
  Dumbbell,
  LogOut,
  Target,
  TrendingUp,
  CalendarDays,
  ClipboardCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const baseLinkClass =
    "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition whitespace-nowrap";

  const normalClass = `${baseLinkClass} text-zinc-300 hover:bg-white/10 hover:text-white`;

  const activeClass = `${baseLinkClass} bg-red-600 text-white shadow-lg shadow-red-900/30`;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? activeClass : normalClass;

  const nutritionClass =
    location.pathname === "/user" || location.pathname === "/user/nutrition"
      ? activeClass
      : normalClass;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.18),transparent_35%)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-6 grid grid-cols-[280px_1fr_220px] items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-4 text-left group"
          >
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center shadow-lg shadow-red-900/30 transition group-hover:scale-105">
              <Target size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black leading-none">ZM Coaching</h1>
              <p className="text-sm text-zinc-500 mt-1">Espace Client</p>
            </div>
          </button>

          <nav className="mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl shadow-xl">
            <NavLink to="/user/nutrition" className={nutritionClass}>
              <Apple size={18} />
              Ma Nutrition
            </NavLink>

            <NavLink to="/user/training" className={linkClass}>
              <Dumbbell size={18} />
              Mon Training
            </NavLink>

            <NavLink to="/user/schedule" className={linkClass}>
              <CalendarDays size={18} />
              Mon Planning
            </NavLink>

            <NavLink to="/user/checkins" className={linkClass}>
              <ClipboardCheck size={18} />
              Check-in
            </NavLink>

            <NavLink to="/user/progress" className={linkClass}>
              <TrendingUp size={18} />
              Mon Progress
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="justify-self-end inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-black text-black transition hover:bg-red-600 hover:text-white shadow-lg whitespace-nowrap"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10 rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-black to-red-950/40 p-8 md:p-10 backdrop-blur-xl">
          <p className="text-red-400 font-black tracking-[0.35em] uppercase text-xs">
            Bienvenue
          </p>

          <h2 className="text-4xl md:text-6xl font-black mt-4 leading-none">
            Salut, <span className="text-red-500">{user?.fullName}</span>
          </h2>

          <p className="text-zinc-400 mt-5 text-lg max-w-2xl leading-relaxed">
            Retrouve ici tes programmes, ton suivi et ton évolution.
          </p>
        </section>

        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;