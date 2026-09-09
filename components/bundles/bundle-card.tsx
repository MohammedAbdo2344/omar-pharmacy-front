import { PackagePlus } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import type { BundleRecord } from '@/services/bundles/bundles.interface';
import AddBundleToCartButton from './add-bundle-to-cart-button';

interface BundleCardProps {
  bundle: BundleRecord;
  labels: {
    currency: string;
    save: (amount: string) => string;
    contains: string;
    bundleTag: string;
    add: string;
    added: string;
    unavailable: string;
  };
}

export default function BundleCard({ bundle, labels }: BundleCardProps) {
  const imageUrl = resolveAssetUrl(bundle.image_url);
  const savings = bundle.components_total_price - bundle.price;
  const hasSavings = savings > 0;
  const contents = bundle.items.map((item) => `${item.quantity}× ${item.name}`).join(', ');

  return (
    <a
      href={`/bundles/${bundle.slug}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col group"
    >
      <div className="relative m-2.5 border border-purple-100/60 rounded-2xl p-6 h-48 flex items-center justify-center overflow-hidden bg-purple-50/70">
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 flex-wrap">
          <span className="bg-white/90 text-purple-700 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
            {labels.bundleTag}
          </span>
          {hasSavings && (
            <span className="bg-white/90 text-amber-700 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
              {labels.save(savings.toFixed(2))}
            </span>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-8 border-white/30" />
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-white/30" />
        </div>

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={bundle.name}
            className="relative z-10 w-full h-full object-contain drop-shadow-lg"
          />
        ) : (
          <PackagePlus className="relative z-10 w-10 h-10 text-purple-400" />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
          {labels.contains}
        </div>
        <h3 className="mt-1 font-bold text-blue-950 line-clamp-2">{bundle.name}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{contents}</p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-blue-950">
              {labels.currency} {bundle.price.toFixed(2)}
            </span>
            {hasSavings && (
              <span className="text-sm text-gray-400 line-through">
                {labels.currency} {bundle.components_total_price.toFixed(2)}
              </span>
            )}
          </div>

          <AddBundleToCartButton
            bundleId={bundle.id}
            isAvailable={bundle.is_available}
            maxQuantity={bundle.max_available_quantity}
            labels={{ add: labels.add, added: labels.added, unavailable: labels.unavailable }}
          />
        </div>

        {!bundle.is_available && (
          <p className="mt-3 text-xs text-gray-400">{labels.unavailable}</p>
        )}
      </div>
    </a>
  );
}
