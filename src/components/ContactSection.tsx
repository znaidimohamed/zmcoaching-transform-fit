import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, Phone, Instagram, Facebook, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'envoi du formulaire
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    // Redirection vers WhatsApp avec le message
    const whatsappMessage = `Bonjour Mohamed,

Nom: ${formData.name}
Email: ${formData.email}
Téléphone: ${formData.phone}

Message: ${formData.message}

Envoyé depuis le site ZM Coaching`;

    const whatsappUrl = `https://wa.me/21653464695?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactMethods = [
    {
      icon: <MessageCircle className="h-6 w-6 text-accent" />,
      title: "WhatsApp",
      value: "+216 53 464 695",
      action: () => window.open('https://wa.me/21653464695', '_blank'),
      description: "Réponse immédiate"
    },
    {
      icon: <Mail className="h-6 w-6 text-accent" />,
      title: "Email",
      value: "medznaidi8090@gmail,com",
      action: () => window.open('mailto:medznaidi8090@gmail,com', '_blank'),
      description: "Réponse sous 24h"
    },
    {
      icon: <Instagram className="h-6 w-6 text-accent" />,
      title: "Instagram",
      value: "@znaidy_mohamed",
      action: () => window.open('https://instagram.com/znaidy_mohamed', '_blank'),
      description: "Suivez mes conseils quotidiens"
    },
    {
      icon: <Facebook className="h-6 w-6 text-accent" />,
      title: "Facebook",
      value: "Mohamed Znaidy",
      action: () => window.open('https://facebook.com/mohamed.znaidy', '_blank'),
      description: "Rejoignez la communauté"
    }
  ];

  const quickActions = [
    {
      title: "Consultation Gratuite",
      description: "15 min pour discuter de vos objectifs",
      buttonText: "Réserver",
      message: "Bonjour Mohamed, je souhaiterais réserver une consultation gratuite de 15 minutes pour discuter de mes objectifs fitness."
    },
    {
      title: "Devis Personnalisé",
      description: "Programme sur mesure selon vos besoins",
      buttonText: "Demander",
      message: "Bonjour Mohamed, j'aimerais recevoir un devis personnalisé pour un programme de coaching adapté à mes besoins."
    },
    {
      title: "Urgence/Question",
      description: "Besoin d'aide immédiate ?",
      buttonText: "Contact Rapide",
      message: "Bonjour Mohamed, j'ai une question urgente concernant mon programme de coaching."
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Contactez-Moi
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Prêt à commencer votre transformation ? Discutons de vos objectifs 
            et trouvons ensemble la solution parfaite.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <Card className="border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                <Send className="h-6 w-6 text-accent" />
                Envoyez-moi un message
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire et je vous répondrai rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-primary mb-2 block">
                      Nom complet *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      required
                      className="border-border focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-primary mb-2 block">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                      className="border-border focus:border-accent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-primary mb-2 block">
                    Téléphone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+216 XX XXX XXX"
                    className="border-border focus:border-accent"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-primary mb-2 block">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez vos objectifs, votre niveau actuel, vos contraintes..."
                    required
                    rows={6}
                    className="border-border focus:border-accent resize-none"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg font-semibold rounded-xl"
                >
                  Envoyer le Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-semibold text-primary">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => {
                        const whatsappUrl = `https://wa.me/21653464695?text=${encodeURIComponent(action.message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      {action.buttonText}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Méthodes de contact */}
            <div className="grid gap-4">
              {contactMethods.map((method, index) => (
                <Card 
                  key={index} 
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={method.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary">{method.title}</h4>
                        <p className="text-accent font-medium">{method.value}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Informations pratiques */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Disponibilités
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>📅 Lundi - Vendredi : 8h00 - 20h00</p>
                  <p>📅 Samedi : 9h00 - 18h00</p>
                  <p>📅 Dimanche : 10h00 - 16h00</p>
                  <p className="text-accent font-semibold mt-3">
                    ⚡ Réponse WhatsApp sous 1h en moyenne
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Prêt à Transformer Votre Vie ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Ne laissez pas vos objectifs fitness être des rêves. 
              Contactez-moi maintenant et commencez votre transformation dès aujourd'hui.
            </p>
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-xl mr-4"
              onClick={() => window.open('https://wa.me/21653464695?text=Bonjour Mohamed, je suis prêt(e) à commencer ma transformation ! Pouvons-nous discuter ?', '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Commencer Maintenant
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;