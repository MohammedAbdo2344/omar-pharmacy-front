import BundleDetail from '@/components/bundles/bundle-detail';
import { BundlesServiceServer } from '@/services/bundles/bundles.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

interface BundleDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function BundleDetailPage({ params }: BundleDetailPageProps) {
  const { slug, locale } = await params;
  const token = await getGuestTokenServer();

  const detail =
    token && slug
      ? await BundlesServiceServer.getBundleBySlug(token, slug, locale).catch(() => null)
      : null;

  if (!detail?.bundle) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Bundle not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BundleDetail bundle={detail.bundle} />
    </div>
  );
}
