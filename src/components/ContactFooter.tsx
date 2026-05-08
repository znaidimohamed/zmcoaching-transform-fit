import { useState } from "react";
import { api } from "@/lib/api";
import {
  ArrowUp,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactFooterSection = () => {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/leads", formData);

    toast({
      title: "Message envoyé",
      description: "Votre demande a été envoyée avec succès.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <section
      id="contact"
      className="relative bg-black text-white pt-28 pb-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.2),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-red-300 text-sm font-bold mb-5">
            <MessageCircle size={16} />
            Contact & Coaching
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Prêt à commencer ta{" "}
            <span className="text-red-500">transformation ?</span>
          </h2>

          <p className="text-zinc-400 mt-5 text-lg">
            Envoie ta demande, l’admin la reçoit dans le dashboard, puis te
            recontacte rapidement.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 mb-16">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                <Send size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black">Formulaire de contact</h3>
                <p className="text-sm text-zinc-400">
                  Remplis tes informations et ton objectif.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Nom complet"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                placeholder="Votre nom"
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
                placeholder="votre@email.com"
              />

              <Input
                label="Téléphone"
                value={formData.phone}
                onChange={(v) => setFormData({ ...formData, phone: v })}
                placeholder="+216 XX XXX XXX"
              />

              <div className="md:col-span-2">
                <label className="text-sm text-zinc-300 mb-2 block">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Parle-moi de ton objectif..."
                  className="w-full min-h-36 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.01] transition shadow-lg shadow-red-900/30"
            >
              Envoyer la demande
            </button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Contact direct</h3>

            <div className="space-y-4">
              <ContactButton
                icon={<MessageCircle />}
                title="WhatsApp"
                value="+216 53 464 695"
                onClick={() => window.open("https://wa.me/21653464695", "_blank")}
              />

              <ContactButton
                icon={<Mail />}
                title="Email"
                value="medznaidi8090@gmail.com"
                onClick={() =>
                  window.open("mailto:medznaidi8090@gmail.com", "_blank")
                }
              />

              <ContactButton
                icon={<Instagram />}
                title="Instagram"
                value="@znaidy_mohamed"
                onClick={() =>
                  window.open("https://instagram.com/znaidy_mohamed", "_blank")
                }
              />

              <ContactButton
                icon={<Facebook />}
                title="Facebook"
                value="Mohamed Znaidy"
                onClick={() =>
                  window.open("https://www.facebook.com/med.znaidy.7", "_blank")
                }
              />
            </div>

            <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
              <p className="font-black text-red-300">Disponibilité</p>
              <p className="text-zinc-400 text-sm mt-2">
                Lun-Ven: 8h-22h
                <br />
                Sam-Dim: 9h-18h
              </p>
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 pt-8">
          <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-2xl bg-red-600 flex items-center justify-center">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-2xl font-black">ZM Coaching</h3>
              </div>

              <p className="text-zinc-400 max-w-md">
                Transformez votre corps, renforcez votre esprit. Coaching
                personnalisé pour des résultats durables.
              </p>
            </div>

            <div>
              <h4 className="font-black mb-4">Navigation</h4>
              <div className="space-y-3 text-zinc-400">
                {[
                  ["Accueil", "accueil"],
                  ["Packs", "packs"],
                  ["Transformations", "transformations"],
                  ["Entraînement", "entrainement"],
                ].map(([label, id]) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="block hover:text-red-400 transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black mb-4">Réseaux</h4>
              <div className="flex gap-3">
                <SocialButton
                  icon={<MessageCircle />}
                  onClick={() => window.open("https://wa.me/21653464695")}
                />
                <SocialButton
                  icon={<Instagram />}
                  onClick={() =>
                    window.open("https://instagram.com/znaidy_mohamed")
                  }
                />
                <SocialButton
                  icon={<Facebook />}
                  onClick={() =>
                    window.open("https://www.facebook.com/med.znaidy.7")
                  }
                />
                <SocialButton
                  icon={<Mail />}
                  onClick={() =>
                    window.open("mailto:medznaidi8090@gmail.com")
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="text-zinc-500 text-sm">
              © {currentYear} ZM Coaching. Tous droits réservés.
            </p>

            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <p>
                Developed by <span className="font-bold text-white">Ala Eddine Ben Rejab</span>
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="h-11 w-11 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div>
    <label className="text-sm text-zinc-300 mb-2 block">{label}</label>
    <input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
    />
  </div>
);

const ContactButton = ({ icon, title, value, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 flex items-center gap-4 hover:border-red-500/50 transition text-left"
  >
    <div className="h-11 w-11 rounded-2xl bg-red-600/15 text-red-400 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="font-black">{title}</p>
      <p className="text-sm text-zinc-400">{value}</p>
    </div>
  </button>
);

const SocialButton = ({ icon, onClick }: any) => (
  <button
    onClick={onClick}
    className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition"
  >
    {icon}
  </button>
);

export default ContactFooterSection;