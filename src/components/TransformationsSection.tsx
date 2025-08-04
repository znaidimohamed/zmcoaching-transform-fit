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
      name: "Sarah K.",
      age: 28,
      duration: "3 mois",
      weightLoss: "-12kg",
      image: transformationImage,
      description: "Incroyable transformation après grossesse. Programme adapté et suivi personnalisé.",
      testimonial: "Mohamed m'a aidée à retrouver confiance en moi. Les résultats parlent d'eux-mêmes !"
    },
    {
      id: 2,
      name: "Ahmed M.",
      age: 35,
      duration: "4 mois",
      weightLoss: "-18kg",
      image: transformationImage,
      description: "Perte de poids spectaculaire avec un programme adapté à son emploi du temps chargé.",
      testimonial: "Grâce au coaching de Mohamed, j'ai retrouvé ma forme d'il y a 10 ans !"
    },
    {
      id: 3,
      name: "Leila B.",
      age: 24,
      duration: "6 mois",
      weightLoss: "-15kg",
      image: transformationImage,
      description: "Transformation complète lifestyle avec nutrition et sport.",
      testimonial: "Un coach exceptionnel qui m'a accompagnée dans tous mes objectifs."
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
                <div className="aspect-video md:aspect-[2/1] overflow-hidden">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg"
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
                        <div className="text-sm text-white/80">Perte</div>
                        <div className="font-bold text-accent">
                          {transformations[currentSlide].weightLoss}
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