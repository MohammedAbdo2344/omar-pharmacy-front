import { cookies } from 'next/headers';
import CheckoutPageClient from '@/components/checkout/checkout-page-client';
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

export default async function CheckoutPage() {
  const config = await getConfigData();

  return <CheckoutPageClient config={config} />;
}
