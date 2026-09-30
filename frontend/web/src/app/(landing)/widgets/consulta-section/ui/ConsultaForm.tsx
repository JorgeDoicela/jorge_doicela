'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CustomSelect, SelectOption } from '../../../shared/ui/CustomSelect';
import { API_URL } from '../../../shared';

export function ConsultaForm() {
  const t = useTranslations('Consulta');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const serviceOptions: SelectOption[] = [
    { value: 'Desarrollo Web & Móvil', label: t('serviceWeb') },
    { value: 'Arquitectura Cloud & DevSecOps', label: t('serviceCloud') },
    { value: 'Inteligencia Artificial', label: t('serviceAi') },
    { value: 'Ciberseguridad', label: t('serviceSecurity') },
    { value: 'Consultoría Técnica', label: t('serviceConsulting') },
  ];

  const handleServiceChange = (val: string) => {
    setFormData((prev) => ({ ...prev, serviceType: val }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        subject: formData.serviceType ? `Consulta: ${formData.serviceType}` : 'Consulta desde jorgedoicela.com',
        ...(formData.phone.trim() ? { phone: formData.phone.trim() } : {}),
        ...(formData.serviceType.trim() ? { serviceType: formData.serviceType.trim() } : {}),
      };

      const response = await fetch(`${API_URL}/portfolio/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = Array.isArray(result?.message)
          ? result.message.join(' | ')
          : result?.message || t('errorMsg');
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        message: '',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || t('errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      message: '',
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.03em] text-foreground mb-2 sm:mb-3">
          {t('formCardTitle')}
        </h3>
        <p className="text-text-muted text-sm sm:text-base font-normal leading-relaxed tracking-[-0.011em]">
          {t('formCardSubtitle')}
        </p>
      </div>

      {success && (
        <div className="p-8 sm:p-12 rounded-[2rem] bg-foreground/5 border border-card-border text-foreground text-center flex flex-col items-center justify-center gap-5 animate-fade-slide my-auto">
          <p className="text-base sm:text-lg font-medium leading-relaxed max-w-sm text-foreground">
            {t('successMsg')}
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-3 px-6 py-3 text-xs sm:text-sm font-semibold bg-foreground text-background rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            {t('sendAnotherBtn')}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-fade-slide">
          <span>{error}</span>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between gap-5 sm:gap-6">
          <div className="space-y-5 sm:space-y-6 flex-grow flex flex-col">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-text-muted mb-2">
                {t('nameLabel')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                required
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 focus:bg-foreground/10 border border-card-border hover:border-card-hover-border focus:border-card-hover-border text-foreground placeholder:text-text-subtitle/60 focus:outline-none transition-all text-base sm:text-sm"
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-text-muted mb-2">
                  {t('emailLabel')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 focus:bg-foreground/10 border border-card-border hover:border-card-hover-border focus:border-card-hover-border text-foreground placeholder:text-text-subtitle/60 focus:outline-none transition-all text-base sm:text-sm"
                  placeholder={t('emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-text-muted mb-2">
                  {t('phoneLabel')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={50}
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 focus:bg-foreground/10 border border-card-border hover:border-card-hover-border focus:border-card-hover-border text-foreground placeholder:text-text-subtitle/60 focus:outline-none transition-all text-base sm:text-sm"
                  placeholder={t('phonePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-xs sm:text-sm font-medium text-text-muted mb-2">
                {t('serviceLabel')}
              </label>
              <CustomSelect
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleServiceChange}
                options={serviceOptions}
                placeholder={t('serviceSelect')}
              />
            </div>

            <div className="flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-text-muted">
                  {t('messageLabel')} *
                </label>
                <span className={`text-[10px] font-mono ${formData.message.length > 2800 ? 'text-amber-400 font-semibold' : 'text-text-subtitle/70'}`}>
                  {formData.message.length} / 3000
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                maxLength={3000}
                required
                className="w-full flex-grow min-h-[140px] sm:min-h-[160px] px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 focus:bg-foreground/10 border border-card-border hover:border-card-hover-border focus:border-card-hover-border text-foreground placeholder:text-text-subtitle/60 focus:outline-none transition-all text-base sm:text-sm resize-none"
                placeholder={t('messagePlaceholder')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 sm:py-4.5 px-6 bg-foreground text-background font-semibold text-sm sm:text-base tracking-tight rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl shrink-0"
          >
            <span>{loading ? t('sendingBtn') : t('sendBtn')}</span>
          </button>
        </form>
      )}
    </div>
  );
}


