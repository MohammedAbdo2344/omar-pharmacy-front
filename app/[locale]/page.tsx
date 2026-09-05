import { cookies } from 'next/headers';
import Hero from '@/components/home/hero';
import CategoriesSection from '@/components/home/categories-section';
import ProductsSection from '@/components/home/products-section';
import WhyOmarSection from '@/components/home/why-omar-section';
import { HomeService } from '@/services/home/home.service';
import { ConfigService } from '@/services/config/config.service';
import type { HomeData } from '@/services/home/home.interface';
import type { ConfigData } from '@/services/config/config.interface';
import { GUEST_SESSION_COOKIE } from '@/lib/guest-session';

async function getHomeData(): Promise<HomeData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await HomeService.getHome(token);
  } catch {
    return null;
  }
}

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
      <WhyOmarSection config={config} />
    </div>
  );
}