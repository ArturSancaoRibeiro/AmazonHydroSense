import { SiteNav } from "@/components/SiteNav";
import { CinematicHero } from "@/components/CinematicHero";
import { ParameterMarquee } from "@/components/ParameterMarquee";
import { ProblemSection } from "@/components/ProblemSection";
import { HowItWorks } from "@/components/HowItWorks";
import { MetricsSection } from "@/components/MetricsSection";
import { DataSection } from "@/components/DataSection";
import { LocationSection } from "@/components/LocationSection";
import { AudienceSection } from "@/components/AudienceSection";
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
        <MetricsSection />
        <DataSection />
        <LocationSection />
        <AudienceSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
