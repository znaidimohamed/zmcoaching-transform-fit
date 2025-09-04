import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Target, Heart } from "lucide-react";

const AboutSection = () => {
  const achievements = [
    {
      icon: <Users className="h-6 w-6 text-accent" />,
      number: "100+",
      label: "Clients transformés"
    },
    {
      icon: <Award className="h-6 w-6 text-accent" />,
      number: "7 ans",
      label: "d'expérience"
    },
    {
      icon: <Target className="h-6 w-6 text-accent" />,
      number: "98%",
      label: "de satisfaction"
    },
    {
      icon: <Heart className="h-6 w-6 text-accent" />,
      number: "100%",
      label: "de passion"
    }
  ];

  const certifications = [
    "Coach Sportif Certifié",
    "Spécialiste Nutrition",
    "Formation en Psychologie du Sport",
    "Certified Personal Trainer (CPT)"
  ];

  const values = [
    {
      title: "Authenticité",
      description: "Des résultats réels, sans promesses miracles"
    },
    {
      title: "Personnalisation",
      description: "Chaque programme est unique et adapté"
    },
    {
      title: "Accompagnement",
      description: "Un suivi constant et bienveillant"
    },
    {
      title: "Excellence",
      description: "L'exigence dans chaque détail"
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Photo et présentation */}
            <div className="text-center lg:text-left">
              <div className="inline-block p-1 bg-gradient-to-r from-accent to-primary rounded-full mb-6">
                <div className="w-48 h-48 mx-auto bg-muted rounded-full flex items-center justify-center text-6xl">
                  👨‍💪
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Mohamed Znaidy
              </h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <Badge className="bg-accent text-accent-foreground">Coach Sportif</Badge>
                <Badge className="bg-accent text-accent-foreground">Nutritionniste</Badge>
                <Badge className="bg-accent text-accent-foreground">Motivateur</Badge>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-primary">
                Votre Partenaire Transformation
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Passionné de fitness depuis plus de 10 ans, j'ai décidé de faire de ma passion mon métier 
                pour aider le maximum de personnes à atteindre leurs objectifs.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Mon approche combine <span className="text-accent font-semibold">science du sport</span>, 
                <span className="text-accent font-semibold"> nutrition optimisée</span> et 
                <span className="text-accent font-semibold"> accompagnement psychologique</span> 
                pour des résultats durables et sans frustration.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Chaque transformation est unique, c'est pourquoi j'adapte mes méthodes à votre style de vie, 
                vos contraintes et vos objectifs personnels.
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-3 flex justify-center">
                    {achievement.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certifications et valeurs */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Certifications */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                  <Award className="h-6 w-6 text-accent" />
                  Certifications & Formation
                </h4>
                <ul className="space-y-3">
                  {certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-muted-foreground">{cert}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Valeurs */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-accent" />
                  Mes Valeurs
                </h4>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div key={index}>
                      <h5 className="font-semibold text-primary mb-1">{value.title}</h5>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Citation */}
          <div className="text-center mt-16 max-w-4xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-bold text-primary italic mb-6">
              "Mon objectif n'est pas seulement de vous faire perdre du poids, 
              mais de vous apprendre à maintenir un mode de vie sain pour toujours."
            </blockquote>
            <div className="text-accent font-semibold text-lg">
              - Mohamed Znaidy, Fondateur ZM Coaching
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;