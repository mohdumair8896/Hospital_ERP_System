'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';
import { Send, Info, AlertCircle } from 'lucide-react';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Soft filled inputs (C38). */
const INPUT =
  'w-full p-3 rounded-xl border border-transparent bg-muted text-sm text-slate-900 placeholder:text-slate-500 transition-colors focus:bg-white focus:border-prohealth-border focus:outline-none focus:ring-2 focus:ring-ring';

/**
 * Administrative inquiry form (moved from app/contact/page.tsx; same fields and
 * validation). Labels are now tied to their inputs. There is no inquiry API
 * yet, so after validation we say so and point to the phone and email desks
 * instead of claiming the message was received.
 */
export function ContactInquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Inquiries');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const id = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('Please fill in your name, email, and inquiry message.');
      return;
    }
    if (!consent) {
      setErrorMsg('You must agree to the privacy consent terms.');
      return;
    }

    setErrorMsg(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div role="status" className="p-6 sm:p-8 rounded-2xl bg-prohealth-ice border border-prohealth-secondary/30 space-y-3 motion-safe:animate-in motion-safe:fade-in duration-250">
        <Info className="w-10 h-10 text-prohealth-primary" aria-hidden="true" />
        <h3 className="text-base font-bold text-prohealth-heading">Online messages aren’t connected yet</h3>
        <p className="text-sm text-prohealth-body leading-relaxed">
          Your message has not been sent: this form isn’t linked to our patient relations desk yet. Please call the main
          switchboard on <a href="tel:+15550192831" className="font-bold text-prohealth-primary underline underline-offset-2">+1 (555) 019-2831</a>{' '}
          or email <a href="mailto:care@prohealth.hospital" className="font-bold text-prohealth-primary underline underline-offset-2">care@prohealth.hospital</a>.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className={`text-sm font-bold text-prohealth-primary hover:underline rounded ${FOCUS_RING}`}
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div role="alert" className="p-3 rounded-xl bg-alert-soft border border-red-200 text-alert text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-name`} className="text-sm font-semibold text-slate-700">Full Name *</label>
          <input id={`${id}-name`} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Eleanor Vance" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-email`} className="text-sm font-semibold text-slate-700">Email Address *</label>
          <input id={`${id}-email`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="eleanor@example.com" className={INPUT} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-phone`} className="text-sm font-semibold text-slate-700">Phone Number</label>
          <input id={`${id}-phone`} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-dept`} className="text-sm font-semibold text-slate-700">Recipient Department</label>
          <select id={`${id}-dept`} value={department} onChange={(e) => setDepartment(e.target.value)} className={INPUT}>
            <option value="General Inquiries">General Patient Relations</option>
            <option value="Cardiology">Cardiology Institute</option>
            <option value="Neurology">Neurology & Stroke Center</option>
            <option value="Pediatrics">Children’s Health & NICU</option>
            <option value="Orthopedics">Orthopedic Surgery</option>
            <option value="Billing">Medical Billing & Insurance</option>
            <option value="Privacy">Privacy Officer (HIPAA)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${id}-message`} className="text-sm font-semibold text-slate-700">Your Message *</label>
        <textarea
          id={`${id}-message`}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please do not include sensitive medical diagnoses here. For clinical care, please book an appointment."
          className={INPUT}
        />
      </div>

      <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 flex items-start gap-3">
        <input
          type="checkbox"
          id={`${id}-consent`}
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-cyan-700 focus:ring-2 focus:ring-ring"
        />
        <label htmlFor={`${id}-consent`} className="text-sm text-slate-700 leading-relaxed cursor-pointer">
          I consent to the collection and handling of my inquiry data under the{' '}
          <Link href="/privacy-policy" className="text-cyan-800 font-bold hover:underline">
            ProHealth Notice of Privacy Practices
          </Link>
          .
        </label>
      </div>

      <button
        type="submit"
        className={`w-full bg-prohealth-primary hover:bg-prohealth-primary-hover text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 ${FOCUS_RING}`}
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        Submit Administrative Message
      </button>
    </form>
  );
}
