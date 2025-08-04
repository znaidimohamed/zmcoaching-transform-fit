import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ZM Coaching
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('accueil')}
              className="text-foreground hover:text-accent transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('packs')}
              className="text-foreground hover:text-accent transition-colors"
            >
              Packs
            </button>
            <button 
              onClick={() => scrollToSection('transformations')}
              className="text-foreground hover:text-accent transition-colors"
            >
              Transformations
            </button>
            <button 
              onClick={() => scrollToSection('entrainement')}
              className="text-foreground hover:text-accent transition-colors"
            >
              Entraînement
            </button>
            <button 
              onClick={() => scrollToSection('nutrition')}
              className="text-foreground hover:text-accent transition-colors"
            >
              Nutrition
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Contact
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <button 
              onClick={() => scrollToSection('accueil')}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('packs')}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-colors"
            >
              Packs
            </button>
            <button 
              onClick={() => scrollToSection('transformations')}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-colors"
            >
              Transformations
            </button>
            <button 
              onClick={() => scrollToSection('entrainement')}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-colors"
            >
              Entraînement
            </button>
            <button 
              onClick={() => scrollToSection('nutrition')}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-colors"
            >
              Nutrition
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Contact
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;