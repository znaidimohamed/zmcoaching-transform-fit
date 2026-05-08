import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Users, Image, Box, LogOut, Apple, Dumbbell, TrendingUp, GraduationCap, Inbox, ShoppingCart, CalendarDays, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-4 transition ${
      isActive
        ? "bg-red-600/20 border border-red-500/40 text-white"
        : "text-zinc-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className="w-72 border-r border-white/10 bg-black/70 p-6">
        <div className="mb-10">
          <h1 className="text-2xl font-black">ZM Coaching</h1>
          <p className="text-sm text-zinc-400">Admin Control Center</p>
        </div>

        <nav className="space-y-3">
          <NavLink to="/dashboard/users" className={linkClass}>
            <Users size={20} />
            Utilisateurs
          </NavLink>

          <NavLink to="/dashboard/transformations" className={linkClass}>
            <Image size={20} />
            Transformations
          </NavLink>

          <NavLink to="/dashboard/packs" className={linkClass}>
            <Box size={20} />
            Packs
          </NavLink>

          <NavLink to="/dashboard/nutrition" className={linkClass}>
            <Apple size={20} />
            Nutrition
          </NavLink>

          <NavLink to="/dashboard/training" className={linkClass}>
            <Dumbbell size={20} />
            Training
          </NavLink>

          <NavLink to="/dashboard/courses" className={linkClass}>
            <GraduationCap size={20} />
            Courses
          </NavLink>

          <NavLink to="/dashboard/checkins" className={linkClass}>
            <ClipboardCheck size={20} />
            Check-ins
          </NavLink>

          <NavLink to="/dashboard/progress" className={linkClass}>
            <TrendingUp size={20} />
            Progress
          </NavLink>

          <NavLink to="/dashboard/schedule" className={linkClass}>
            <CalendarDays size={20} />
            Schedule
          </NavLink>

          <NavLink to="/dashboard/purchase-requests" className={linkClass}>
            <ShoppingCart size={20} />
            Purchases
          </NavLink>

          <NavLink to="/dashboard/leads" className={linkClass}>
            <Inbox size={20} />
            Leads
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;