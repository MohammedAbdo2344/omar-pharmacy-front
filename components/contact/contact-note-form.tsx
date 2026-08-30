'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ContactNoteFormProps {
  whatsapp: string;
  labels: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
  };
}

export default function ContactNoteForm({ whatsapp, labels }: ContactNoteFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = [`${labels.nameLabel}: ${name}`, `${labels.phoneLabel}: ${phone}`, '', message]
      .filter(Boolean)
      .join('\n');

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-xl font-bold text-blue-950">{labels.title}</h3>
      <p className="mt-1 text-sm text-gray-500">{labels.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">{labels.nameLabel}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={labels.namePlaceholder}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-blue-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">{labels.phoneLabel}</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={labels.phonePlaceholder}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-blue-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-950 mb-2">{labels.messageLabel}</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={labels.messagePlaceholder}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-blue-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          <Send className="w-4 h-4 rtl:-rotate-90" />
          {labels.submit}
        </button>
      </form>
    </div>
  );
}
