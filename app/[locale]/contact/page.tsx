import ContactHeroSection from '@/components/contact/contact-hero-section';
import ContactDetailsSection from '@/components/contact/contact-details-section';
import { ConfigServiceServer } from '@/services/config/config.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const token = await getGuestTokenServer();
  const config = token ? await ConfigServiceServer.getConfig(token, locale).catch(() => null) : null;

  return (
    <div className="min-h-screen">
      <ContactHeroSection config={config} />
      <ContactDetailsSection config={config} />
    </div>
  );
}
