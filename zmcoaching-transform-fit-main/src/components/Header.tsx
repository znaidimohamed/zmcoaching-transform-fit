import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const accountPath = isAdmin ? "/dashboard" : "/user";
  const accountLabel = isAdmin ? "Dashboard" : "Espace Client";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: "accueil", label: "Accueil" },
    { id: "packs", label: "Packs" },
    { id: "transformations", label: "Transformations" },
    { id: "entrainement", label: "Entraînement" },
    { id: "nutrition", label: "Nutrition" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => scrollToSection("accueil")}
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center shadow-lg shadow-red-900/30">
              <Target className="h-6 w-6 text-white" />
            </div>

            <div className="text-left">
              <div className="text-xl font-black text-white">ZM Coaching</div>
              <div className="text-xs text-white/60">
                Transformez votre potentiel
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-2 py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={accountPath}>
                  <Button className="rounded-2xl bg-red-600 hover:bg-red-700 text-white px-5 py-3 font-black">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {accountLabel}
                  </Button>
                </Link>

                <Button
                  onClick={handleLogout}
                  className="rounded-2xl bg-white text-black hover:bg-zinc-200 px-5 py-3 font-black"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="rounded-2xl bg-white/10 hover:bg-white/20 text-white px-5 py-3 font-black border border-white/10">
                    Connexion
                  </Button>
                </Link>

                <Button
                  onClick={() => scrollToSection("contact")}
                  className="rounded-2xl bg-red-600 hover:bg-red-700 text-white px-5 py-3 font-black shadow-lg shadow-red-900/30"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Commencer
                </Button>
              </>
            )}
          </div>

          <button
            className="lg:hidden h-11 w-11 rounded-2xl bg-white/10 border border-white/10 text-white flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4">
            <div className="rounded-[2rem] border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl p-5 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-4 py-3 rounded-2xl text-zinc-300 hover:bg-white/10 hover:text-white transition font-bold"
                >
                  {item.label}
                </button>
              ))}

              <div className="h-px bg-white/10 my-3" />

              {isAuthenticated ? (
                <>
                  <Link to={accountPath} onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-3 rounded-2xl text-white bg-red-600 hover:bg-red-700 transition font-bold">
                      <User className="inline mr-2 h-4 w-4" />
                      {accountLabel}
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-2xl text-zinc-300 hover:bg-white/10 hover:text-white transition font-bold"
                  >
                    <LogOut className="inline mr-2 h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-3 rounded-2xl text-white bg-white/10 hover:bg-white/20 transition font-bold">
                      Connexion
                    </button>
                  </Link>

                  <button
                    onClick={() => scrollToSection("contact")}
                    className="w-full text-left px-4 py-3 rounded-2xl text-white bg-red-600 hover:bg-red-700 transition font-bold"
                  >
                    <Sparkles className="inline mr-2 h-4 w-4" />
                    Commencer Ma Transformation
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;