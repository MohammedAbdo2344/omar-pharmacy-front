import { cookies } from 'next/headers';
import OurStorySection from '@/components/home/our-story-section';
import OmarDifferenceSection from '@/components/home/omar-difference-section';
import PharmacistGuidanceSection from '@/components/home/pharmacist-guidance-section';
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

export default async function AboutPage() {
  const config = await getConfigData();

  return (
    <div className="min-h-screen">
      <OurStorySection config={config} />
      <OmarDifferenceSection />
      <PharmacistGuidanceSection config={config} />
    </div>
  );
}
