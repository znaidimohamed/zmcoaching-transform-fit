import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Gift, Star, Users, Target, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // عدّل حسب مشروعك

const FreeGuideSection = () => {
  const { toast } = useToast();

  const pdfPath = '/PDF/ZM_coaching_guide_Francais_.pdf';

  const handleOpenPDF = () => {
    toast({
      title: "Guide ouvert !",
      description: "Votre guide gratuit est prêt à être consulté.",
    });
    window.open(pdfPath, '_blank');
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Guide téléchargé !",
      description: "Votre guide gratuit a été téléchargé.",
    });
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'ZM_coaching_guide_Francais_.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const guideFeatures = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Définir vos Objectifs",
      description: "Méthodes pour établir des objectifs fitness réalisables"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Motivation Quotidienne",
      description: "Conseils pour rester motivé dans votre parcours"
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Bases de l'Entraînement",
      description: "Principes fondamentaux pour commencer efficacement"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Habitudes Durables",
      description: "Comment créer des habitudes qui durent"
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-primary rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-accent rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-semibold">CADEAU GRATUIT</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Guide de Coaching
            <span className="block text-accent">100% Gratuit</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Téléchargez mon guide complet avec tous mes meilleurs conseils pour réussir votre transformation physique.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Guide Preview */}
            <div className="relative">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-accent/5 to-primary/5 overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-64 mx-auto mb-6 rounded-lg shadow-lg overflow-hidden aspect-[9/16]">
                      <img 
                        src="/lovable-uploads/be154f7c-292a-4aae-9c57-cbe6fd581b1b.png" 
                        alt="ZM Coaching Guide Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-primary mb-3">
                      Guide de Coaching ZM
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      7 pages de conseils professionnels pour transformer votre corps et votre mindset.
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        PDF Téléchargeable
                      </span>
                      <span>•</span>
                      <span>7 Pages</span>
                      <span>•</span>
                      <span>Gratuit</span>
                    </div>
                    
                    <Button 
                      size="lg"
                      onClick={handleDownloadPDF}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Télécharger le Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guide Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Ce que vous allez découvrir :
              </h3>
              
              <div className="grid gap-4">
                {guideFeatures.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg text-accent">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 mt-8">
                <div className="flex items-center gap-3 mb-3">
                  <Gift className="h-6 w-6 text-accent" />
                  <h4 className="font-bold text-primary">Bonus Inclus</h4>
                </div>
                <p className="text-muted-foreground">
                  + Templates d&apos;entraînement + Planning nutritionnel de base 
                  + Checklist de motivation quotidienne
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
           Plus de 200 personnes l’ont déjà téléchargé
          </p>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-accent text-accent" />
            ))}
            <span className="ml-2 text-muted-foreground">(4.9/5)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeGuideSection;
