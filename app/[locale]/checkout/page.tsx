import CheckoutPageClient from '@/components/checkout/checkout-page-client';
import { ConfigServiceServer } from '@/services/config/config.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  const token = await getGuestTokenServer();
  const config = token ? await ConfigServiceServer.getConfig(token, locale).catch(() => null) : null;

  return <CheckoutPageClient config={config} />;
}
