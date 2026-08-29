import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import WhatsAppButton from '@/components/shared/whatsapp-button';
import { ConfigService } from '@/services/config/config.service';
import { GUEST_SESSION_COOKIE } from '@/lib/guest-session';
import type { ConfigData } from '@/services/config/config.interface';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omar Pharmacy",
  description: "Your trusted partner in health and wellness",
};

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
  const config = await getSiteConfig();

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-24 sm:pt-28">
              {children}
            </main>
            <Footer config={config} />
          </div>
          <WhatsAppButton whatsappNumber={config?.whatsapp ?? null} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/** Fetches site config using the guest-session token bootstrapped by middleware. */
async function getSiteConfig(): Promise<ConfigData | null> {
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
