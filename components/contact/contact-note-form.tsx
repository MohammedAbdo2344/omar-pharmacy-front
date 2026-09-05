'use client';

import { useState, type FormEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ContactService } from '@/services/contact/contact.service';
import { getGuestTokenClient } from '@/lib/guest-session';

interface ContactNoteFormProps {
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
    sending: string;
    sendSuccess: string;
    sendError: string;
  };
}

export default function ContactNoteForm({ labels }: ContactNoteFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const token = getGuestTokenClient();
    if (!token) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      await ContactService.sendMessage(token, { name, phone, message });
      setStatus('success');
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      setStatus('error');
    }
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
          disabled={status === 'submitting'}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 rtl:-rotate-90" />
          )}
          {status === 'submitting' ? labels.sending : labels.submit}
        </button>

        {status === 'success' && (
          <p className="text-sm font-medium text-emerald-600 text-center">{labels.sendSuccess}</p>
        )}
        {status === 'error' && (
          <p className="text-sm font-medium text-red-500 text-center">{labels.sendError}</p>
        )}
      </form>
    </div>
  );
}
