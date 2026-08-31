'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/home/hero';
import CategoriesSection from '@/components/home/categories-section';
import ProductsSection from '@/components/home/products-section';
import WhyOmarSection from '@/components/home/why-omar-section';
import BrandLoader from '@/components/shared/brand-loader';
import { HomeService } from '@/services/home/home.service';
import type { HomeData } from '@/services/home/home.interface';
import { getGuestTokenClient } from '@/lib/guest-session';

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = getGuestTokenClient();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const homeResult = await HomeService.getHome(token).catch(() => null);
        setHomeData(homeResult);
      } catch {
        // Handle errors silently
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <BrandLoader />;
  }

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