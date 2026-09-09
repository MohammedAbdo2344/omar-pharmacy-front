import BundlesListing from '@/components/bundles/bundles-listing';
import { BundlesServiceServer } from '@/services/bundles/bundles.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

interface BundlesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BundlesPage({ params }: BundlesPageProps) {
  const { locale } = await params;
  const token = await getGuestTokenServer();

  const data = token
    ? await BundlesServiceServer.getBundles(token, locale).catch(() => null)
    : null;

  return (
    <div className="min-h-screen">
      <BundlesListing bundles={data?.bundles ?? []} />
    </div>
  );
}
