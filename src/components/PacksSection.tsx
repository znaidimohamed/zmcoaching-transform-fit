import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Crown, Zap } from "lucide-react";

const PacksSection = () => {
  const packs = [
    {
      id: 1,
      name: "Suivi Mensuel",
      price: "89",
      period: "mois",
      icon: <Zap className="h-8 w-8 text-accent" />,
      description: "Perfect pour commencer votre transformation",
      features: [
        "Programme d'entraînement personnalisé",
        "Suivi hebdomadaire",
        "Conseils nutrition de base",
        "Support WhatsApp",
        "Ajustements mensuels"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Transformation 8 Semaines",
      price: "149",
      period: "8 semaines",
      icon: <Star className="h-8 w-8 text-accent" />,
      description: "Le programme intensif pour des résultats rapides",
      features: [
        "Programme intensif personnalisé",
        "Suivi bi-hebdomadaire",
        "Plan nutrition détaillé",
        "Support WhatsApp prioritaire",
        "Séances de motivation",
        "Garantie résultats"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Pack Premium",
      price: "199",
      period: "mois",
      icon: <Crown className="h-8 w-8 text-accent" />,
      description: "L'expérience complète coaching + nutrition",
      features: [
        "Coaching personnalisé complet",
        "Suivi quotidien",
        "Plan nutrition sur mesure",
        "Recettes personnalisées",
        "Support 24/7",
        "Appels vidéo hebdomadaires",
        "Ajustements en temps réel"
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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              
              <CardHeader className={`text-center ${pack.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  {pack.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-primary">
                  {pack.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {pack.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{pack.price}</span>
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