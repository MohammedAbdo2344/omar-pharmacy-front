'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  FileText,
  MapPin,
  Wallet,
  Truck,
  CreditCard,
  Check,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { CheckoutService } from '@/services/checkout/checkout.service';
import { BackendApiError } from '@/lib/api/errors';
import { getGuestTokenClient } from '@/lib/guest-session';
import type { ConfigData } from '@/services/config/config.interface';
import type { CheckoutData } from '@/services/checkout/checkout.interface';
import CheckoutOrderSummary from './checkout-order-summary';
import CheckoutSuccess from './checkout-success';

interface CheckoutPageClientProps {
  config?: ConfigData | null;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  building_street: string;
  appartment_number: string;
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  city: 'Cairo',
  area: '',
  building_street: '',
  appartment_number: '',
};

export default function CheckoutPageClient({ config }: CheckoutPageClientProps) {
  const t = useTranslations('checkoutPage');
  const { items, isLoading, refresh } = useCart();

  const [form, setForm] = useState<FormState>(initialForm);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay'>('cod');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [order, setOrder] = useState<CheckoutData['order'] | null>(null);

  const codEnabled = config?.payment_cod_enabled !== 'false';
  const instapayEnabled = config?.payment_instapay_enabled === 'true' || config?.payment_instapay_enabled === '1';
  const whatsappNumber = config?.whatsapp || config?.phone || '';

  const setField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setErrors({});

    const token = getGuestTokenClient();
    if (!token) {
      setSubmitError(t('sessionError'));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await CheckoutService.checkout(token, form);
      setOrder(result.order);
      await refresh();
    } catch (error) {
      if (error instanceof BackendApiError && error.errors) {
        setErrors(error.errors);
      } else {
        setSubmitError(t('genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (order) {
    return (
      <CheckoutSuccess
        order={order}
        siteName={config?.name || 'Omar Pharmacy'}
        whatsappNumber={whatsappNumber}
        paymentMethod={paymentMethod}
      />
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="w-10 h-10 text-blue-300 mx-auto" />
        <h1 className="mt-4 text-xl font-bold text-blue-950">{t('emptyTitle')}</h1>
        <p className="mt-2 text-gray-500">{t('emptyDescription')}</p>
        <a
          href="/products"
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('browseProducts')}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('badge')}
              </span>
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-blue-950">{t('title')}</h1>
            <p className="mt-3 text-gray-500 max-w-lg">{t('description')}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-950 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('secureNote')}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Your details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-blue-950 text-lg">{t('detailsTitle')}</h2>
                  <p className="text-sm text-gray-500">{t('detailsDescription')}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label={t('fullName')}
                  required
                  value={form.name}
                  onChange={setField('name')}
                  placeholder={t('fullNamePlaceholder')}
                  error={errors.name?.[0]}
                />
                <FormField
                  label={t('phone')}
                  required
                  type="tel"
                  value={form.phone}
                  onChange={setField('phone')}
                  placeholder={t('phonePlaceholder')}
                  error={errors.phone?.[0]}
                />
                <div className="sm:col-span-2">
                  <FormField
                    label={t('email')}
                    required
                    type="email"
                    value={form.email}
                    onChange={setField('email')}
                    placeholder={t('emailPlaceholder')}
                    error={errors.email?.[0]}
                  />
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-blue-950 text-lg">{t('addressTitle')}</h2>
                  <p className="text-sm text-gray-500">{t('addressDescription')}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label={t('city')}
                  required
                  value={form.city}
                  onChange={setField('city')}
                  placeholder={t('cityPlaceholder')}
                  error={errors.city?.[0]}
                />
                <FormField
                  label={t('area')}
                  required
                  value={form.area}
                  onChange={setField('area')}
                  placeholder={t('areaPlaceholder')}
                  error={errors.area?.[0]}
                />
                <div className="sm:col-span-2">
                  <FormField
                    label={t('buildingStreet')}
                    required
                    value={form.building_street}
                    onChange={setField('building_street')}
                    placeholder={t('buildingStreetPlaceholder')}
                    error={errors.building_street?.[0]}
                  />
                </div>
                <FormField
                  label={t('apartment')}
                  required
                  value={form.appartment_number}
                  onChange={setField('appartment_number')}
                  placeholder={t('apartmentPlaceholder')}
                  error={errors.appartment_number?.[0]}
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-blue-950 text-lg">{t('paymentTitle')}</h2>
                  <p className="text-sm text-gray-500">{t('paymentDescription')}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {codEnabled && (
                  <PaymentOption
                    icon={<Truck className="w-4 h-4" />}
                    title={t('cod')}
                    subtitle={t('codSubtitle')}
                    selected={paymentMethod === 'cod'}
                    onSelect={() => setPaymentMethod('cod')}
                  />
                )}
                {instapayEnabled && (
                  <PaymentOption
                    icon={<CreditCard className="w-4 h-4" />}
                    title={t('instapay')}
                    subtitle={t('instapaySubtitle', { number: config?.payment_instapay_number || '' })}
                    selected={paymentMethod === 'instapay'}
                    onSelect={() => setPaymentMethod('instapay')}
                  />
                )}
              </div>

              {paymentMethod === 'instapay' && config?.payment_instapay_number && (
                <div className="mt-4 bg-amber-50 rounded-2xl p-5 text-sm text-amber-900 leading-relaxed">
                  {t('instapayInstructionsPrefix')}{' '}
                  <span className="font-bold">{config.payment_instapay_number}</span>
                  {t('instapayInstructionsSuffix')}
                </div>
              )}
            </div>

            {submitError && (
              <p className="text-sm font-semibold text-red-600">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {isSubmitting ? t('submitting') : t('submit')}
            </button>

            <p className="text-center text-xs text-gray-400">{t('disclaimer')}</p>
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-28">
            <CheckoutOrderSummary
              labels={{
                badge: t('summaryBadge'),
                title: t('summaryTitle'),
                total: t('summaryTotal'),
                currency: t('currency'),
                prescriptionNote: t('summaryPrescriptionNote'),
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: string;
}

function FormField({ label, value, onChange, placeholder, required, type = 'text', error }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-blue-950 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-blue-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface PaymentOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
}

function PaymentOption({ icon, title, subtitle, selected, onSelect }: PaymentOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-start transition-colors ${
        selected ? 'border-blue-600 bg-emerald-50/40 ring-1 ring-blue-100' : 'border-gray-200 hover:border-blue-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-blue-950">{icon}</span>
        <div>
          <div className="font-bold text-blue-950 text-sm">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </span>
    </button>
  );
}
