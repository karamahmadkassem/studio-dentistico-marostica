import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import RequiredMark from '../components/RequiredMark';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { createBooking, fetchPublishedServices } from '../lib/api';
import { useOpeningHours } from '../hooks/useOpeningHours';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatDateKey } from '../config/appointmentSchedule';
import type { Service } from '../types/database';
import { usePageTitle } from '../hooks/usePageTitle';

const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageTitle(t('nav.contact'));
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const faqItems = t('contact.faq.items') as { q: string; a: string }[];
  const phoneHref = String(t('footer.phoneHref'));
  const { lines: openingHoursLines } = useOpeningHours();

  useEffect(() => {
    fetchPublishedServices(language).then(setServices).catch(() => setServices([]));
  }, [language]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!selectedDate || !selectedTime) {
      setError(String(t('contact.form.calendarRequired')));
      return;
    }
    if (!isSupabaseConfigured) {
      setError(
        language === 'it'
          ? 'La prenotazione online non è ancora attiva. Chiamaci o scrivici per fissare un appuntamento.'
          : 'Online booking is not active yet. Please call or email us to schedule a visit.',
      );
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);
    try {
      await createBooking({
        firstName: fd.get('firstName'),
        lastName: fd.get('lastName'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        serviceId: fd.get('service') || null,
        appointmentDate: formatDateKey(selectedDate),
        appointmentTime: selectedTime,
        message: fd.get('message') || '',
        locale: language,
      });
      setSubmitted(true);
      form.reset();
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('contactForm')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <PageHero
        title={t('contact.hero.title')}
        subtitle={t('contact.hero.subtitle')}
        image="https://images.pexels.com/photos/3846009/pexels-photo-3846009.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <Section>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
          <h2 className="heading-section order-1 lg:col-start-1 lg:row-start-1">
            {t('contact.info.title')}
          </h2>

          <FadeIn className="order-2 lg:col-start-1 lg:row-start-2">
            <div className="space-y-6">
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <MapPin size={22} className="mt-1 shrink-0 text-brand-cyan" />
                  <div>
                    <h3 className="mb-1 font-semibold text-ink">{t('contact.info.address')}</h3>
                    <p className="text-ink-muted">{t('footer.address')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone size={22} className="mt-1 shrink-0 text-brand-cyan" />
                  <div>
                    <h3 className="mb-1 font-semibold text-ink">{t('contact.info.phone')}</h3>
                    <a href={`tel:${phoneHref}`} className="text-ink-muted hover:text-brand-cyan">
                      {t('footer.phone')}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail size={22} className="mt-1 shrink-0 text-brand-cyan" />
                  <div>
                    <h3 className="mb-1 font-semibold text-ink">{t('contact.info.email')}</h3>
                    <a
                      href="mailto:info@studiodentisticomarostica.it"
                      className="break-all text-ink-muted hover:text-brand-cyan"
                    >
                      {t('footer.email')}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock size={22} className="mt-1 shrink-0 text-brand-cyan" />
                  <div>
                    <h3 className="mb-1 font-semibold text-ink">{t('contact.info.hours')}</h3>
                    {openingHoursLines.map((line) => (
                      <p key={line} className="text-ink-muted">
                        {line}
                      </p>
                    ))}
                  </div>
                </li>
              </ul>

              <div>
                <h3 className="mb-4 font-display text-xl font-semibold text-ink">
                  {t('contact.info.map')}
                </h3>
                <div className="h-64 overflow-hidden rounded-md bg-surface-muted md:h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22520.114982646507!2d11.638625126241206!3d45.74721738817678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4778d294958a5c55%3A0x536acef8f5f61b5c!2s36063%20Marostica%20VI!5e0!3m2!1sit!2sit!4v1697730905815!5m2!1sit!2sit"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mappa Studio Dentistico Marostica"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          <h2 className="heading-section booking-panel-title order-3 lg:col-start-2 lg:row-start-1">
            {t('contact.form.title')}
          </h2>

          <FadeIn delay={0.06} className="order-4 lg:col-start-2 lg:row-start-2">
            <div
              id="contactForm"
              className="rounded-md bg-surface-muted px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8"
            >
              {submitted ? (
                <div className="py-6 text-center">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-brand-cyan" />
                  <h3 className="heading-section mb-3 text-xl">{t('contact.form.successTitle')}</h3>
                  <p className="text-ink-muted leading-relaxed">{t('contact.form.successMessage')}</p>
                  <button
                    type="button"
                    className="btn-primary mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    {t('contact.form.bookAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="label-field">
                        {t('contact.form.firstName')}
                        <RequiredMark />
                      </label>
                      <input type="text" id="firstName" name="firstName" required className="input-field" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="label-field">
                        {t('contact.form.lastName')}
                        <RequiredMark />
                      </label>
                      <input type="text" id="lastName" name="lastName" required className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="label-field">
                      {t('contact.form.phone')}
                      <RequiredMark />
                    </label>
                    <input type="tel" id="phone" name="phone" required className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="email" className="label-field">
                      {t('contact.form.email')}
                      <RequiredMark />
                    </label>
                    <input type="email" id="email" name="email" required className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="service" className="label-field">
                      {t('contact.form.service')}
                      <RequiredMark />
                    </label>
                    <select id="service" name="service" required className="input-field" defaultValue="">
                      <option value="" disabled>
                        {t('contact.form.servicePlaceholder')}
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {language === 'en' ? s.title_en : s.title_it}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="booking-schedule-section">
                    <h3 className="booking-schedule-title">{t('contact.form.scheduleSection')}</h3>
                    <p className="booking-schedule-hint">{t('contact.form.scheduleHint')}</p>
                    <AppointmentCalendar
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onDateChange={setSelectedDate}
                      onTimeChange={setSelectedTime}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="label-field">
                      {t('contact.form.message')}
                    </label>
                    <textarea id="message" name="message" rows={4} className="input-field resize-y" />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <label className="flex items-start gap-3 text-sm text-ink-muted">
                    <input
                      type="checkbox"
                      name="privacy"
                      required
                      className="mt-1 h-4 w-4 rounded border-ink-soft text-brand-cyan focus:ring-brand-cyan"
                    />
                    <span>
                      {t('contact.form.privacyBefore')}{' '}
                      <Link to="/privacy" className="font-medium text-brand-cyan hover:underline">
                        {t('common.privacy')}
                      </Link>
                      <RequiredMark />
                    </span>
                  </label>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? t('contact.form.submitting') : t('contact.form.submit')}{' '}
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section muted>
        <FadeIn>
          <h2 className="heading-section mb-8 text-center">{t('contact.faq.title')}</h2>
        </FadeIn>
        <div className="mx-auto max-w-3xl space-y-3">
          {Array.isArray(faqItems) &&
            faqItems.map((item, index) => {
              const open = openFaq === index;
              return (
                <FadeIn key={item.q} delay={index * 0.04}>
                  <div className="border border-ink-soft/30 bg-white">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      onClick={() => setOpenFaq(open ? null : index)}
                      aria-expanded={open}
                    >
                      <span className="font-semibold text-ink">{item.q}</span>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-brand-cyan transition-transform ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <div className="border-t border-ink-soft/20 px-5 pb-5 pt-3 text-ink-muted leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                </FadeIn>
              );
            })}
        </div>
      </Section>

      <section className="band-dark">
        <div className="container-page section-padding text-center">
          <FadeIn>
            <h2 className="heading-on-dark mb-4 text-2xl md:text-3xl">
              {t('contact.cta.title')}
            </h2>
            <p className="text-on-dark-muted mx-auto mb-8 max-w-2xl text-lg">
              {t('contact.cta.subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${phoneHref}`} className="btn-white">
                {t('contact.cta.call')}
              </a>
              <button type="button" onClick={scrollToForm} className="btn-primary">
                {t('contact.cta.write')}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
