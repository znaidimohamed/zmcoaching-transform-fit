import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, Facebook, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Accueil", id: "accueil" },
    { name: "Packs", id: "packs" },
    { name: "Transformations", id: "transformations" },
    { name: "Entraînement", id: "entrainement" },
    { name: "Nutrition", id: "nutrition" },
    { name: "Contact", id: "contact" }
  ];

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      url: "https://wa.me/21653464695",
      color: "hover:text-green-500"
    },
    {
      name: "Instagram", 
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com/znaidy_mohamed",
      color: "hover:text-pink-500"
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: "https://facebook.com/mohamed.znaidy",
      color: "hover:text-blue-500"
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      url: "mailto:medznaidi8090@gmail.com",
      color: "hover:text-accent"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">ZM Coaching</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-md leading-relaxed">
              Votre partenaire transformation pour atteindre vos objectifs fitness. 
              Coaching personnalisé, nutrition adaptée, résultats garantis.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className={`border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300 ${social.color}`}
                  onClick={() => window.open(social.url, '_blank')}
                >
                  {social.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div>
                <p className="font-medium text-primary-foreground">WhatsApp</p>
                <p>+216 53 464 695</p>
              </div>
              <div>
                <p className="font-medium text-primary-foreground">Email</p>
                <p>medznaidi8089@gmail.com</p>
              </div>
              <div>
                <p className="font-medium text-primary-foreground">Horaires</p>
                <p className="text-sm">Lun-Ven: 8h-20h</p>
                <p className="text-sm">Sam: 9h-18h</p>
                <p className="text-sm">Dim: 10h-16h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} ZM Coaching. Tous droits réservés.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
              <span>Développé avec</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>par Mohamed Znaidy</span>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => window.open('https://wa.me/21653464695?text=Bonjour Mohamed, je souhaite commencer ma transformation !', '_blank')}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Commencez Votre Transformation
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;