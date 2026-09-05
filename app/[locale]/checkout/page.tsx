import CheckoutPageClient from '@/components/checkout/checkout-page-client';
import { ConfigServiceServer } from '@/services/config/config.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

export default async function CheckoutPage() {
  const token = await getGuestTokenServer();
  const config = token ? await ConfigServiceServer.getConfig(token).catch(() => null) : null;

  return <CheckoutPageClient config={config} />;
}
