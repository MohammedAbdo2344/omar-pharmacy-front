import OurStorySection from '@/components/home/our-story-section';
import OmarDifferenceSection from '@/components/home/omar-difference-section';
import PharmacistGuidanceSection from '@/components/home/pharmacist-guidance-section';
import { ConfigServiceServer } from '@/services/config/config.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const token = await getGuestTokenServer();
  const config = token ? await ConfigServiceServer.getConfig(token, locale).catch(() => null) : null;

  return (
    <div className="min-h-screen">
      <OurStorySection config={config} />
      <OmarDifferenceSection />
      <PharmacistGuidanceSection config={config} />
    </div>
  );
}
