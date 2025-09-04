import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/22a7dc04-5f44-46b4-8854-5c840f92a1bf.png" 
          alt="ZM Coaching - Transformation Fitness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Power
            <span className="block text-accent">& Performance</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            <span className="text-accent font-semibold">Online Coaching</span><br />
            Nutrition plans & training programs adapted to your lifestyle
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              onClick={() => scrollToSection('packs')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Voir les Packs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('transformations')}
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 rounded-xl transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Voir les Résultats
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">100+</div>
              <div className="text-white/80">Clients Transformés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">7 ans</div>
              <div className="text-white/80">d'Expérience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <div className="text-white/80">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;