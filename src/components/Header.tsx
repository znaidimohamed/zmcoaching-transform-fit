import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Sparkles,
  Target,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
  { id: "accueil", label: "Accueil" },
  { id: "hyrox", label: "Hyrox" },
  { id: "packs", label: "Packs" },
  { id: "transformations", label: "Transformations" },
  { id: "entrainement", label: "Entraînement" },
  { id: "nutrition", label: "Nutrition" },
  { id: "contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const accountPath = isAdmin ? "/dashboard" : "/user";
  const accountLabel = isAdmin ? "Dashboard" : "Espace Client";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const current = [...navItems].reverse().find((item) => {
        const section = document.getElementById(item.id);
        if (!section) return false;
        return section.offsetTop - 140 <= window.scrollY;
      });

      if (current) setActiveSection(current.id);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 py-3 shadow-2xl shadow-black/40 backdrop-blur-2xl border-b border-white/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSection("accueil")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-900 shadow-lg shadow-red-900/30 transition-all duration-300 group-hover:scale-105">
              <Target className="h-6 w-6 text-white" />
            </div>

            <div className="text-left">
              <div className="text-lg sm:text-xl font-black text-white leading-none">
                ZM Coaching
              </div>
              <div className="mt-1 hidden text-xs text-white/60 sm:block">
                Transformez votre potentiel
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2 backdrop-blur-xl">
            {navItems.map((item) => {
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                    active ? "text-white" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-xl bg-red-600/90"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={accountPath}>
                  <Button className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white shadow-lg shadow-red-900/25 transition-all duration-300 hover:scale-[1.03] hover:bg-red-700">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {accountLabel}
                  </Button>
                </Link>

                <Button
                  onClick={handleLogout}
                  className="rounded-2xl bg-white px-5 py-3 font-black text-black transition-all duration-300 hover:scale-[1.03] hover:bg-zinc-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-black text-white transition-all duration-300 hover:scale-[1.03] hover:bg-white/20">
                    Connexion
                  </Button>
                </Link>

                <Button
                  onClick={() => scrollToSection("contact")}
                  className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-[1.03] hover:bg-red-700"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Commencer
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20 lg:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden"
            >
              <div className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-black/95 p-4 shadow-2xl backdrop-blur-2xl">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const active = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full rounded-2xl px-4 py-3 text-left font-bold transition-all duration-300 ${
                          active
                            ? "bg-red-600 text-white"
                            : "text-zinc-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div className="my-4 h-px bg-white/10" />

                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link to={accountPath} onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full rounded-2xl bg-red-600 px-4 py-3 text-left font-bold text-white transition hover:bg-red-700">
                        <User className="mr-2 inline h-4 w-4" />
                        {accountLabel}
                      </button>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-2xl px-4 py-3 text-left font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="mr-2 inline h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full rounded-2xl bg-white/10 px-4 py-3 text-left font-bold text-white transition hover:bg-white/20">
                        Connexion
                      </button>
                    </Link>

                    <button
                      onClick={() => scrollToSection("contact")}
                      className="w-full rounded-2xl bg-red-600 px-4 py-3 text-left font-bold text-white transition hover:bg-red-700"
                    >
                      <Sparkles className="mr-2 inline h-4 w-4" />
                      Commencer Ma Transformation
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;