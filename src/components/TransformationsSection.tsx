import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TransformationsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const transformations = [
    {
      id: 1,
      name: "Zmed",
      duration: "3 ans",
      weightChange: "61.5kg → 77kg",
      image: "/lovable-uploads/4335f17a-0acd-4239-9fff-d34f7fd7cdd1.png",
      testimonial: "Ma propre transformation."
    },
    {
      id: 2,
      name: "Med Ali",
      duration: "10 mois",
      weightChange: "74kg → 65.7kg",
      image: "/lovable-uploads/bdff8ee9-7a8a-4dd1-8b76-318b9896d3b6.png",
      testimonial: "Perte de poids."
    },
    {
      id: 3,
      name: "Ghassen",
      duration: "3 mois",
      weightChange: "82kg → 76kg",
      image: "/lovable-uploads/b96dd092-57ba-4896-9806-dac59473b2e1.png",
      testimonial: "Perte de graisse."
    },
    {
      id: 4,
      name: "Mohamed",
      duration: "5 mois",
      weightChange: "84kg → 79.5kg",
      image: "/lovable-uploads/dac3d974-ebd8-4d53-9540-da10a8673da0.png",
      testimonial: "Reéquilibrage corporel."
    },
    {
      id: 5,
      name: "Tarek",
      duration: "6 mois",
      weightChange: "87kg → 82kg",
      image: "/lovable-uploads/1b4b5b73-5ba9-48b8-831d-7d6b91d9b120.png",
      testimonial: "Transformation physique."
    },
    {
      id: 6,
      name: "Hedi",
      duration: "2 mois",
      weightChange: "61.5kg → 77kg",
      image: "/lovable-uploads/2b7c46d8-230a-4ddd-803b-56e2ebb612bc.png",
      testimonial: "Masse musculaire."
    },
    {
      id: 7,
      name: "Firas",
      duration: "3 ans",
      weightChange: "65kg → 77kg",
      image: "/lovable-uploads/2b7c46d8-230a-4ddd-803b-56e2ebb612b.png",
      testimonial: "Discipline & constance — zéro excuses."
    }
    {
      id: 7,
      name: "Firas",
      duration: "3 ans",
      weightChange: "65kg → 77kg",
      image: "/lovable-uploads/2b7c46d8-230a-4ddd-803b-56e2ebb612b.png",
      testimonial: "Discipline & constance — zéro excuses."
  ];

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % transformations.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % transformations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + transformations.length) % transformations.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
  };

  return (
    <section id="transformations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Transformations Réelles
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">

              {/* Swipe Zone */}
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative"
              >
                {/* IMAGE WITHOUT HOVER DARK */}
                <img
                  src={transformations[currentSlide].image}
                  alt={transformations[currentSlide].name}
                  className="w-full h-auto object-contain select-none"
                />

                {/* ARROWS ONLY */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-lg hidden md:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-lg hidden md:flex"
                >
