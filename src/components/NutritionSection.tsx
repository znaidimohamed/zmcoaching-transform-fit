import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, ChefHat, Calculator, BookOpen, Utensils, Droplets, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import recipeImage from "@/assets/recipe-9-16.jpg";

const NutritionSection = () => {
  const { toast } = useToast();

  const handleOpenRecipesPDF = () => {
    toast({
      title: "Recettes ouvertes !",
      description: "Votre guide de 50 recettes est prêt à être consulté.",
    });
   window.open('/PDF/recettes.pdf', '_blank');
  };

  const handleDownloadWeightLoss = () => {
    toast({
      title: "Programme Perte de Poids",
      description: "Téléchargement du programme en cours...",
    });
    const link = document.createElement('a');
    link.href = '/public/PDF/Programme Perte de Poids.pdf';
    link.download = 'Programme Perte de Poids.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMuscleGain = () => {
    toast({
      title: "Programme Prise de Masse",
      description: "Téléchargement du programme en cours...",
    });
    window.open('/PDF/programme_prise_masse.pdf', '_blank');
  };

  const handleDownloadMaintenance = () => {
    toast({
      title: "Programme Maintenance",
      description: "Téléchargement du programme en cours...",
    });
    window.open('/PDF/programme_maintenance.pdf', '_blank');
  };
  const nutritionServices = [
    {
      icon: <Calculator className="h-8 w-8 text-accent" />,
      title: "Plans Personnalisés",
      description: "Calcul précis de vos besoins caloriques et macronutriments selon vos objectifs."
    },
    {
      icon: <ChefHat className="h-8 w-8 text-accent" />,
      title: "Recettes Adaptées",
      description: "Plus de 50 recettes délicieuses adaptées à la culture tunisienne et vos goûts."
    },
    {
      icon: <Apple className="h-8 w-8 text-accent" />,
      title: "Éducation Nutritionnelle",
      description: "Apprenez les bases pour maintenir une alimentation équilibrée à vie."
    },
    {
      icon: <Utensils className="h-8 w-8 text-accent" />,
      title: "Meal Prep & Planning",
      description: "Organisation des repas pour gagner du temps et rester sur la bonne voie."
    }
  ];

  const nutritionPlans = [
    {
      name: "Perte de Poids",
      description: "Déficit calorique contrôlé avec maintien de la masse musculaire",
      calories: "1400-1800 kcal",
      macros: "40P/30G/30L",
      color: "bg-red-100 text-red-800"
    },
    {
      name: "Prise de Masse",
      description: "Surplus calorique optimisé pour la croissance musculaire",
      calories: "2200-2800 kcal",
      macros: "25P/45G/30L",
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Maintenance",
      description: "Équilibre nutritionnel pour maintenir votre poids idéal",
      calories: "1800-2200 kcal",
      macros: "30P/40G/30L",
      color: "bg-green-100 text-green-800"
    }
  ];

  const tipsList = [
    "Hydratation : 35ml par kg de poids corporel minimum",
    "5 portions de fruits et légumes par jour",
    "Protéines à chaque repas pour la satiété",
    "Privilégier les glucides complexes",
    "Oméga-3 : poissons gras 2-3x/semaine",
    "Éviter les aliments ultra-transformés"
  ];

  return (
    <section id="nutrition" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Nutrition & Bien-être
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            L'alimentation représente 70% de vos résultats. Découvrez comment 
            bien manger sans frustration ni contrainte.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Services nutrition */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary mb-8">
              Approche Nutritionnelle Complète
            </h3>
            
            {nutritionServices.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Image nutrition */}
          <div className="space-y-6">
            <div className="aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl max-w-md mx-auto">
              <img 
                src={recipeImage}
                alt="50+ Recettes disponibles"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Button under the image */}
            <div className="text-center">
              <Button 
                size="lg"
                onClick={handleOpenRecipesPDF}
                className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md"
              >
                <BookOpen className="mr-3 h-6 w-6" />
                50+ Recettes Disponible
              </Button>
            </div>
          </div>
        </div>

        {/* Plans nutritionnels */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-primary text-center mb-12">
            Types de Plans Nutritionnels
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {nutritionPlans.map((plan, index) => {
              const getDownloadHandler = () => {
                switch (plan.name) {
                  case "Perte de Poids":
                    return handleDownloadWeightLoss;
                  case "Prise de Masse":
                    return handleDownloadMuscleGain;
                  case "Maintenance":
                    return handleDownloadMaintenance;
                  default:
                    return () => {};
                }
              };

              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <CardTitle className="text-xl font-bold text-primary">
                        {plan.name}
                      </CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${plan.color}`}>
                        {plan.macros}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-accent font-semibold">
                      <Droplets className="h-4 w-4" />
                      {plan.calories}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <Button 
                      onClick={getDownloadHandler()}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger Programme
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conseils nutrition */}
        <div className="bg-muted rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-accent" />
                Conseils Nutrition Essentiels
              </h4>
              <ul className="space-y-3">
                {tipsList.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-card p-6 rounded-xl shadow-lg">
                <h5 className="text-xl font-bold text-primary mb-4">
                  Consultation Nutrition Gratuite
                </h5>
                <p className="text-muted-foreground mb-6 text-sm">
                  Évaluation complète de vos habitudes alimentaires et 
                  recommandations personnalisées.
                </p>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => {
                    const message = "Bonjour Mohamed, je souhaiterais une consultation nutrition gratuite. Pouvez-vous me donner plus d'informations ?";
                    const whatsappUrl = `https://wa.me/21653464695?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  Réserver Ma Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionSection;