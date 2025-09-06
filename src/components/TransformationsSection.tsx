import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TransformationsSection = () => {

  const transformations = [
    {
      id: 1,
      name: "Zakaria",
      age: 0,
      duration: "3 ans",
      weightChange: "61.5kg → 77kg",
      image: "/lovable-uploads/4335f17a-0acd-4239-9fff-d34f7fd7cdd1.png",
      description: "Ma propre transformation",
      testimonial: "Ma transformation personnelle qui m'a mené à devenir coach professionnel."
    },
    {
      id: 2,
      name: "Med Ali",
      age: 35,
      duration: "6 mois",
      weightChange: "74kg → 65.7kg",
      image: "/lovable-uploads/bdff8ee9-7a8a-4dd1-8b76-318b9896d3b6.png",
      description: "Transformation de perte de poids",
      testimonial: "Grâce à ZM Coaching, j'ai atteint mes objectifs de perte de poids."
    },
    {
      id: 3,
      name: "Ghassen",
      age: 0,
      duration: "8 mois",
      weightChange: "61.5kg → 77kg",
      image: "/lovable-uploads/b96dd092-57ba-4896-9806-dac59473b2e1.png",
      description: "Prise de masse musculaire",
      testimonial: "Transformation impressionnante avec un gain de masse musculaire significatif."
    },
    {
      id: 4,
      name: "Mohamed",
      age: 0,
      duration: "5 mois",
      weightChange: "84kg → 79.5kg",
      image: "/lovable-uploads/dac3d974-ebd8-4d53-9540-da10a8673da0.png",
      description: "Rééquilibrage corporel",
      testimonial: "Excellent suivi pour atteindre mes objectifs de remise en forme."
    },
    {
      id: 5,
      name: "Tarek",
      age: 0,
      duration: "6 mois",
      weightChange: "87kg → 82kg",
      image: "/lovable-uploads/1b4b5b73-5ba9-48b8-831d-7d6b91d9b120.png",
      description: "Transformation physique",
      testimonial: "Résultats visibles et durables grâce au programme personnalisé."
    },
    {
      id: 6,
      name: "Hedi",
      age: 0,
      duration: "7 mois",
      weightChange: "61.5kg → 77kg",
      image: "/lovable-uploads/2b7c46d8-230a-4ddd-803b-56e2ebb612bc.png",
      description: "Gain de masse musculaire",
      testimonial: "Transformation complète avec un excellent accompagnement."
    }
  ];

  return (
    <section id="transformations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Transformations Réelles
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez les incroyables transformations de nos clients. 
            Leurs résultats parlent d'eux-mêmes.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {transformations.map((transformation) => (
            <div key={transformation.id} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={transformation.image}
                alt={`Transformation ${transformation.name}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Hover Caption */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-lg font-semibold mb-1">{transformation.name}</p>
                  <p className="text-sm">Avant → Après</p>
                  <p className="text-sm font-medium text-accent">{transformation.weightChange}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Rejoignez des centaines de clients satisfaits
          </p>
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-xl"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Commencer Ma Transformation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TransformationsSection;