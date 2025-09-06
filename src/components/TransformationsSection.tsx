import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Award } from "lucide-react";
import transformationImage from "@/assets/transformation-example.jpg";

const TransformationsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const transformations = [
    {
      id: 1,
      name: "Zmed",
      age: 27,
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
      duration: "10 mois",
      weightChange: "74kg → 65.7kg",
      image: "/lovable-uploads/bdff8ee9-7a8a-4dd1-8b76-318b9896d3b6.png",
      description: "Transformation de perte de poids",
      testimonial: " ZM Coaching, "
    },
    {
      id: 3,
      name: "Ghassen",
      age: 28,
      duration: "3 mois",
      weightChange: "82kg → 76kg",
      image: "/lovable-uploads/b96dd092-57ba-4896-9806-dac59473b2e1.png",
      description: "perte du graisse  ",
      testimonial: "Transformation impressionnante avec un gain de masse musculaire significatif."
    },
    {
      id: 4,
      name: "Mohamed",
      age: 35,
      duration: "5 mois",
      weightChange: "84kg → 79.5kg",
      image: "/lovable-uploads/dac3d974-ebd8-4d53-9540-da10a8673da0.png",
      description: "Rééquilibrage corporel",
      testimonial: "Excellent suivi pour atteindre mes objectifs de remise en forme."
    },
    {
      id: 5,
      name: "Tarek",
      age: 35,
      duration: "6 mois",
      weightChange: "87kg → 82kg",
      image: "/lovable-uploads/1b4b5b73-5ba9-48b8-831d-7d6b91d9b120.png",
      description: "Transformation physique",
      testimonial: "Résultats visibles et durables grâce au programme personnalisé."
    },
    {
      id: 6,
      name: "Hedi",
      age: 23,
      duration: "2 mois",
      weightChange: "61.5kg → 77kg",
      image: "/lovable-uploads/2b7c46d8-230a-4ddd-803b-56e2ebb612bc.png",
      description: "Gain de masse musculaire",
      testimonial: "Transformation complète avec un excellent accompagnement."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % transformations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + transformations.length) % transformations.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

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

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative">
                {/* Image principale */}
                <div className="aspect-[800/500] overflow-hidden">
                  <img 
                    src={transformations[currentSlide].image}
                    alt={`Transformation ${transformations[currentSlide].name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                </div>

                {/* Navigation arrows */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 border-0 shadow-lg"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 border-0 shadow-lg"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="grid md:grid-cols-2 gap-6 items-end">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {transformations[currentSlide].name}
                      </h3>
                      <p className="text-white/90 mb-4">
                        {transformations[currentSlide].description}
                      </p>
                      <blockquote className="text-accent italic text-lg">
                        "{transformations[currentSlide].testimonial}"
                      </blockquote>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <Calendar className="h-6 w-6 text-accent mx-auto mb-2" />
                        <div className="text-sm text-white/80">Durée</div>
                        <div className="font-bold text-accent">
                          {transformations[currentSlide].duration}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <Award className="h-6 w-6 text-accent mx-auto mb-2" />
                        <div className="text-sm text-white/80">Évolution</div>
                        <div className="font-bold text-accent">
                          {transformations[currentSlide].weightChange}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-2xl text-accent mb-1">👤</div>
                        <div className="text-sm text-white/80">Âge</div>
                        <div className="font-bold text-accent">
                          {transformations[currentSlide].age} ans
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {transformations.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-accent scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
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