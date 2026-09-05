import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import WhatsAppButton from '@/components/shared/whatsapp-button';
import { CartProvider } from '@/context/cart-context';
import { ConfigProvider } from '@/providers/config-provider';
import { ConfigServiceServer } from '@/services/config/config.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "Omar Pharmacy";
const SITE_DESCRIPTION = "Omar Pharmacy - Your trusted online pharmacy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const token = await getGuestTokenServer();
  const config = token ? await ConfigServiceServer.getConfig(token, locale).catch(() => null) : null;
  const favicon = resolveAssetUrl(config?.favicon);

  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    keywords: [
      "pharmacy",
      "online pharmacy",
      "Omar Pharmacy",
      "medicines",
      "health",
    ],
    icons: favicon ? { icon: favicon } : undefined,
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    },
  };
}

const locales = ['en', 'ar'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  const token = await getGuestTokenServer();
  const config = token ? await ConfigServiceServer.getConfig(token, locale).catch(() => null) : null;
  const logo = resolveAssetUrl(config?.logo);

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ConfigProvider initialConfig={config}>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar logo={logo} />
                <main className="flex-1 pt-24 sm:pt-28">
                  {children}
                </main>
                <Footer />
              </div>
              <WhatsAppButton />
            </CartProvider>
          </ConfigProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
