import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Crown, Zap } from "lucide-react";
import packSolo from "@/assets/pack-solo.jpg";
import packBase from "@/assets/pack-base.jpg";
import packTransformation from "@/assets/pack-transformation.jpg";
import packElite from "@/assets/pack-elite.jpg";

const PacksSection = () => {
  const packs = [
    {
      id: 1,
      name: "Base Pack",
      price: "80",
      period: "mois",
      icon: <Zap className="h-8 w-8 text-accent" />,
      image: packBase,
      description: "Plan training 100% personnalisé + Guide nutrition",
      features: [
        "Plan training 100% personnalisé",
        "Guide nutrition",
        "Feedback hebdomadaire",
        "Suivi en ligne"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Solo Pack",
      price: "50",
      period: "mois",
      icon: <Star className="h-8 w-8 text-accent" />,
      image: packSolo,
      description: "Plan training ou plan nutrition 100% personnalisé",
      features: [
        "Plan training 100% personnalisé",
        "OU",
        "Plan nutrition 100% personnalisé"
      ],
      popular: false
    },
    {
      id: 3,
      name: "Transformation Pack",
      price: "240",
      period: "3 mois",
      icon: <Crown className="h-8 w-8 text-accent" />,
      image: packTransformation,
      description: "Plan training évolutif sur 3 mois + Plan nutrition flexible",
      features: [
        "Plan training évolutif sur 3 mois",
        "Plan nutrition flexible + suivi macros",
        "Feedback chaque semaine",
        "Corrections vidéo incluses"
      ],
      popular: true
    },
    {
      id: 4,
      name: "Elite Pack",
      price: "360",
      period: "3 mois",
      icon: <Crown className="h-8 w-8 text-accent" />,
      image: packElite,
      description: "Plan training évolutif sur 3 mois + Nutrition flexible + Séances 1v1",
      features: [
        "Plan training évolutif sur 3 mois",
        "Nutrition flexible + suivi macros",
        "Ajustement réguliers",
        "Réajustement du plan chaque mois selon l'évolution",
        "Corrections vidéo incluses",
        "12 séances 1v1",
        "Support WhatsApp prioritaire au quotidien"
      ],
      popular: false
    }
  ];

  const handlePurchase = (packName: string) => {
    // Pour l'instant, on redirige vers WhatsApp
    const message = `Bonjour Mohamed, je suis intéressé(e) par le ${packName}. Pouvez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/21653464695?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="packs" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Choisissez Votre Pack
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des programmes adaptés à tous les niveaux et objectifs. 
            Commencez votre transformation dès aujourd'hui.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {packs.map((pack) => (
            <Card 
              key={pack.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                pack.popular 
                  ? 'border-2 border-accent shadow-2xl scale-105' 
                  : 'border hover:border-accent/50'
              }`}
            >
              {pack.popular && (
                <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 text-sm font-semibold">
                  ⭐ PLUS POPULAIRE
                </div>
              )}
              
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={pack.image} 
                  alt={pack.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className={`text-center ${pack.popular ? 'pt-8' : 'pt-6'}`}>
                <CardTitle className="text-xl font-bold text-primary">
                  {pack.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  {pack.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-primary">{pack.price}</span>
                  <span className="text-lg text-muted-foreground ml-1">DT</span>
                  <div className="text-sm text-muted-foreground">/{pack.period}</div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    pack.popular 
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  } py-6 text-lg font-semibold rounded-xl transition-all duration-300`}
                  onClick={() => handlePurchase(pack.name)}
                >
                  Commencer Maintenant
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Paiement sécurisé par PayPal ou Carte Bancaire
          </p>
          <p className="text-sm text-muted-foreground">
            💳 Paiement en 3x sans frais disponible • 30 jours satisfait ou remboursé
          </p>
        </div>
      </div>
    </section>
  );
};

export default PacksSection;