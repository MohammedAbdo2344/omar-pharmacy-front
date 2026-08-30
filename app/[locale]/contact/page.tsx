import { cookies } from 'next/headers';
import ContactHeroSection from '@/components/contact/contact-hero-section';
import ContactDetailsSection from '@/components/contact/contact-details-section';
import { ConfigService } from '@/services/config/config.service';
import type { ConfigData } from '@/services/config/config.interface';
import { GUEST_SESSION_COOKIE } from '@/lib/guest-session';

async function getConfigData(): Promise<ConfigData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await ConfigService.getConfig(token);
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const config = await getConfigData();

  return (
    <div className="min-h-screen">
      <ContactHeroSection config={config} />
      <ContactDetailsSection config={config} />
    </div>
  );
}
