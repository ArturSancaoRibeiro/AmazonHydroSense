import { SiteNav } from "@/components/SiteNav";
import { CinematicHero } from "@/components/CinematicHero";
import { ParameterMarquee } from "@/components/ParameterMarquee";
import { ProblemSection } from "@/components/ProblemSection";
import { HowItWorks } from "@/components/HowItWorks";
import { LocationSection } from "@/components/LocationSection";
import { AudienceSection } from "@/components/AudienceSection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <CinematicHero />
        <ParameterMarquee />
        <ProblemSection />
        <HowItWorks />
        <LocationSection />
        <AudienceSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
