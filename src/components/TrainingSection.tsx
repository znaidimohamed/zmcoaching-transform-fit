import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Target, Timer, TrendingUp, Play, Download } from "lucide-react";
import trainingImage from "@/assets/training-equipment.jpg";

const TrainingSection = () => {
  const trainingMethods = [
    {
      icon: <Dumbbell className="h-8 w-8 text-accent" />,
      title: "Musculation Fonctionnelle",
      description: "Exercices composés pour développer force et masse musculaire de manière équilibrée."
    },
    {
      icon: <Timer className="h-8 w-8 text-accent" />,
      title: "HIIT & Cardio",
      description: "Entraînements haute intensité pour brûler les graisses et améliorer l'endurance."
    },
    {
      icon: <Target className="h-8 w-8 text-accent" />,
      title: "Programmes Personnalisés",
      description: "Adaptés à votre niveau, équipement disponible et objectifs spécifiques."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-accent" />,
      title: "Progression Garantie",
      description: "Suivi détaillé et ajustements réguliers pour assurer votre progression continue."
    }
  ];

  const workoutExamples = [
    {
      name: "Split Push/Pull/Legs",
      duration: "45 min",
      level: "Intermédiaire",
      description: "Programme 3 jours optimisé pour la prise de muscle"
    },
    {
      name: "Full Body Débutant",
      duration: "30 min",
      level: "Débutant",
      description: "Routine complète 3x/semaine pour commencer"
    },
    {
      name: "HIIT Fat Burn",
      duration: "20 min",
      level: "Tous niveaux",
      description: "Circuit intensif pour brûler un maximum de calories"
    }
  ];

  return (
    <section id="entrainement" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Méthodes d'Entraînement
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des programmes scientifiquement conçus pour maximiser vos résultats, 
            adaptés à votre niveau et vos objectifs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Image section */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={trainingImage}
                alt="Équipement d'entraînement ZM Coaching"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Exercices disponibles</div>
              </div>
            </div>
          </div>

          {/* Methods grid */}
          <div className="grid gap-6">
            {trainingMethods.map((method, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      {method.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">
                      {method.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {method.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Workout Examples */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-primary text-center mb-12">
            Exemples de Programmes
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {workoutExamples.map((workout, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                      {workout.name}
                    </CardTitle>
                    <span className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full font-semibold">
                      {workout.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Timer className="h-4 w-4" />
                    {workout.duration}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4">
                    {workout.description}
                  </CardDescription>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="h-4 w-4 mr-1" />
                      Aperçu
                    </Button>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center bg-card p-8 rounded-2xl shadow-lg">
            <h4 className="text-2xl font-bold text-primary mb-4">
              Programmes 100% Personnalisés
            </h4>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Chaque programme est adapté à votre niveau, votre équipement disponible, 
              vos contraintes de temps et vos objectifs spécifiques.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                📱 App mobile incluse
              </span>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                🎥 Vidéos explicatives
              </span>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                📊 Suivi progression
              </span>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                🔄 Mise à jour hebdo
              </span>
            </div>
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-xl"
              onClick={() => {
                const element = document.getElementById('packs');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Obtenir Mon Programme
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;