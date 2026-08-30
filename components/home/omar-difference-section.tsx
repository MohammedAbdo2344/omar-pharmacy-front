import { getTranslations } from 'next-intl/server';
import { BadgeCheck, Truck, Headphones, ShoppingCart } from 'lucide-react';

const features = [
  { key: 'products', icon: BadgeCheck, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { key: 'delivery', icon: Truck, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { key: 'support', icon: Headphones, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { key: 'easy', icon: ShoppingCart, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
] as const;

export default async function OmarDifferenceSection() {
  const t = await getTranslations('omarDifferenceSection');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('badge')}
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-serif text-blue-950">
              {t('title')}
            </h2>
          </div>
          <p className="max-w-sm text-gray-500">{t('description')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ key, icon: Icon, iconBg, iconColor }) => (
            <div
              key={key}
              className="bg-gray-50/70 border border-gray-100 rounded-2xl p-8"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="mt-6 font-bold text-blue-950">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm text-gray-500">{t(`${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
