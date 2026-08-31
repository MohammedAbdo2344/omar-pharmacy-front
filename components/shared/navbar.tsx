'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Heart, Star, Globe } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useConfig } from '@/providers/config-provider';

const locales = ['en', 'ar'];
const localeLabels: Record<string, string> = { en: 'EN', ar: 'AR' };

export default function Navbar() {
    const { config } = useConfig();
    const siteName = config?.name || 'Omar Pharmacy';
    const t = useTranslations('navbar');
    const locale = useLocale();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { itemCount } = useCart();

    const switchLocale = (nextLocale: string) => {
        if (nextLocale === locale) return;
        const segments = pathname.split('/');
        segments[1] = nextLocale;
        const newPath = segments.join('/') || '/';
        // Use a full navigation instead of router.push: the Next.js router cache
        // can otherwise serve a stale RSC payload for a previously-visited
        // locale path, leaving the locale toggle stuck after switching back.
        window.location.href = newPath;
    };

    const otherLocale = locales.find((l) => l !== locale) ?? locale;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('products'), href: '/products' },
        { name: t('about'), href: '/about' },
        { name: t('contact'), href: '/contact' },
    ];

    return (
        <nav
            className={`fixed top-3 sm:top-4 md:top-5 left-3 right-3 sm:left-4 sm:right-4 md:left-6 md:right-6 z-50 mx-auto max-w-350 rounded-2xl md:rounded-[22px] bg-white/95 backdrop-blur-sm transition-all duration-300 ${isScrolled ? 'shadow-xl py-2' : 'shadow-lg py-3'
                }`}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center gap-2">
                        <div
                            className={`transition-all duration-300 relative w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center`}
                        >
                            <Heart className={`${isScrolled ? 'w-5 h-5' : 'w-6 h-6'} text-white fill-current`} />
                            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                                <Star className="w-3 h-3 text-yellow-900 fill-current" />
                            </div>
                        </div>
                        <div
                            className={`transition-all duration-300 text-lg font-bold text-gray-800`}
                        >
                            <span className="block">{siteName}</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        <button
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-colors text-sm font-medium"
                            onClick={() => switchLocale(otherLocale)}
                            aria-label={`Switch language to ${localeLabels[otherLocale]}`}
                        >
                            <Globe className="w-4 h-4" />
                            {localeLabels[otherLocale]}
                        </button>
                        <a href="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative" aria-label={t('cart')}>
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </a>
                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <button
                                className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                                onClick={() => {
                                    switchLocale(otherLocale);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <Globe className="w-4 h-4" />
                                {localeLabels[otherLocale]}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}