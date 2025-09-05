import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PacksSection from "@/components/PacksSection";
import FreeGuideSection from "@/components/FreeGuideSection";
import TransformationsSection from "@/components/TransformationsSection";
import TrainingSection from "@/components/TrainingSection";
import NutritionSection from "@/components/NutritionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <PacksSection />
      <FreeGuideSection />
      <TransformationsSection />
      <TrainingSection />
      <NutritionSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
