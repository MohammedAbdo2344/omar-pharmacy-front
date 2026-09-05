import ContactHeroSection from '@/components/contact/contact-hero-section';
import ContactDetailsSection from '@/components/contact/contact-details-section';
import { ConfigServiceServer } from '@/services/config/config.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

export default async function ContactPage() {
  const token = await getGuestTokenServer();
  const config = token ? await ConfigServiceServer.getConfig(token).catch(() => null) : null;

  return (
    <div className="min-h-screen">
      <ContactHeroSection config={config} />
      <ContactDetailsSection config={config} />
    </div>
  );
}
