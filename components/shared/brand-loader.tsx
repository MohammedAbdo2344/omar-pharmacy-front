'use client';

import { Heart, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useConfig } from '@/providers/config-provider';
import { resolveAssetUrl } from '@/lib/api/asset-url';

interface BrandLoaderProps {
    /** Cover the whole viewport with an opaque background. Defaults to true. */
    fullScreen?: boolean;
    /** Optional override for the title shown under the logo. */
    name?: string;
}

export default function BrandLoader({ fullScreen = true, name }: BrandLoaderProps) {
    const t = useTranslations('brandLoader');
    const { config } = useConfig();
    const title = name || config?.name || t('name');
    const logo = resolveAssetUrl(config?.logo);

    return (
        <div
            role="status"
            aria-live="polite"
            className={
                fullScreen
                    ? 'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-white'
                    : 'flex flex-col items-center justify-center gap-5 py-20'
            }
        >
            <div className="relative animate-pulse">
                {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logo}
                        alt={title}
                        className="relative w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                ) : (
                    <div className="relative w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white fill-current" />
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                            <Star className="w-3.5 h-3.5 text-yellow-900 fill-current" />
                        </div>
                    </div>
                )}
                <span className="absolute inset-0 -z-10 rounded-full bg-blue-400/40 blur-xl animate-ping" />
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-xl font-bold text-gray-800">{title}</span>
                <span className="text-sm text-gray-500">{t('tagline')}</span>
            </div>

            <span className="sr-only">{t('loading')}</span>
        </div>
    );
}
