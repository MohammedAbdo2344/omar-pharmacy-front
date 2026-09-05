import Hero from '@/components/home/hero';
import CategoriesSection from '@/components/home/categories-section';
import ProductsSection from '@/components/home/products-section';
import WhyOmarSection from '@/components/home/why-omar-section';
import { HomeServiceServer } from '@/services/home/home.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const token = await getGuestTokenServer();
  const homeData = token ? await HomeServiceServer.getHome(token, locale).catch(() => null) : null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Categories Preview */}
      <CategoriesSection categories={homeData?.categories ?? []} />

      {/* Products Preview */}
      <ProductsSection products={homeData?.products ?? []} />

      {/* Why Omar Section */}
      <WhyOmarSection />
    </div>
  );
}
