'use client';

import { useContact } from '../hooks/useContact';
import { useTranslations } from 'next-intl';
import { Send, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export function ContactForm() {
  const { formData, loading, error, success, handleChange, submitForm, resetForm } = useContact();
  const t = useTranslations('Contact');

  return (
    <div className="w-full max-w-lg mx-auto bg-surface border border-border-gold rounded-2xl p-6 sm:p-8 shadow-2xl luxury-glow-hover transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-foreground mb-2">
          {t('title')}
        </h2>
        <p className="text-xs text-muted font-light leading-relaxed max-w-md mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {success && (
        <div className="mb-6 p-5 rounded-xl bg-surface-raised border border-gold-300/40 text-foreground text-center flex flex-col items-center justify-center gap-3 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-gold-300 shrink-0" />
            <span className="font-light tracking-wide">{t('successMsg')}</span>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-gold-300 hover:text-gold-200 border border-gold-300/30 hover:border-gold-300 rounded-md transition-colors duration-200"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t('sendAnotherBtn')}</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-surface-raised border border-red-400/40 text-red-400 text-xs text-center flex items-center justify-center gap-2.5 animate-fade-in shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-light tracking-wide text-xs">{error}</span>
        </div>
      )}

      {!success && (
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[11px] font-mono uppercase tracking-widest text-gold-400/90 mb-1.5 font-medium">
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
              className="w-full px-4 py-2.5 bg-background/80 border border-border-gold rounded-lg text-foreground placeholder-muted/50 focus:outline-none focus:border-gold-300 focus:ring-1 focus:ring-gold-300 transition-all duration-200 font-mono text-xs sm:text-sm"
              placeholder={t('namePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] font-mono uppercase tracking-widest text-gold-400/90 mb-1.5 font-medium">
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
              className="w-full px-4 py-2.5 bg-background/80 border border-border-gold rounded-lg text-foreground placeholder-muted/50 focus:outline-none focus:border-gold-300 focus:ring-1 focus:ring-gold-300 transition-all duration-200 font-mono text-xs sm:text-sm"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-[11px] font-mono uppercase tracking-widest text-gold-400/90 mb-1.5 font-medium">
              {t('subjectLabel')}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              maxLength={200}
              className="w-full px-4 py-2.5 bg-background/80 border border-border-gold rounded-lg text-foreground placeholder-muted/50 focus:outline-none focus:border-gold-300 focus:ring-1 focus:ring-gold-300 transition-all duration-200 font-mono text-xs sm:text-sm"
              placeholder={t('subjectPlaceholder')}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="message" className="block text-[11px] font-mono uppercase tracking-widest text-gold-400/90 font-medium">
                {t('messageLabel')} *
              </label>
              <span className={`text-[10px] font-mono ${formData.message.length > 2800 ? 'text-amber-400 font-semibold' : 'text-muted/70'}`}>
                {formData.message.length} / 3000
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              maxLength={3000}
              required
              className="w-full px-4 py-2.5 bg-background/80 border border-border-gold rounded-lg text-foreground placeholder-muted/50 focus:outline-none focus:border-gold-300 focus:ring-1 focus:ring-gold-300 transition-all duration-200 font-mono text-xs sm:text-sm resize-none"
              placeholder={t('messagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-6 bg-gold-300 hover:bg-gold-200 text-stone-950 font-semibold tracking-[0.2em] uppercase text-xs rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                <span>{t('sendingBtn')}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-stone-950" />
                <span>{t('sendBtn')}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}



