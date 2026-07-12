'use client';

import { useContact } from '../hooks/useContact';

export function ContactForm() {
  const { formData, loading, error, success, handleChange, submitForm } = useContact();

  return (
    <div className="w-full max-w-lg mx-auto bg-surface border border-gold-b rounded-xl p-8 shadow-2xl luxury-glow-hover transition-colors duration-200">
      <h2 className="text-xl font-light tracking-[0.2em] uppercase text-foreground mb-6 text-center">
        Envíame un mensaje
      </h2>

      {success && (
        <div className="mb-6 p-4 rounded-md bg-gold-p/5 border border-gold-p/20 text-gold-p text-xs font-mono text-center">
          ¡Mensaje enviado con éxito! Te responderé lo antes posible.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono text-center">
          {error}
        </div>
      )}

      <form onSubmit={submitForm} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-[10px] font-mono uppercase tracking-widest text-gold-s/70 mb-2">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-background border border-gold-b rounded-md text-foreground placeholder-gold-s/20 focus:outline-none focus:border-gold-p focus:ring-1 focus:ring-gold-p transition-all duration-150 font-mono text-sm"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-widest text-gold-s/70 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-background border border-gold-b rounded-md text-foreground placeholder-gold-s/20 focus:outline-none focus:border-gold-p focus:ring-1 focus:ring-gold-p transition-all duration-150 font-mono text-sm"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-[10px] font-mono uppercase tracking-widest text-gold-s/70 mb-2">
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-background border border-gold-b rounded-md text-foreground placeholder-gold-s/20 focus:outline-none focus:border-gold-p focus:ring-1 focus:ring-gold-p transition-all duration-150 font-mono text-sm"
            placeholder="Propuesta de proyecto / Contacto"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-[10px] font-mono uppercase tracking-widest text-gold-s/70 mb-2">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-background border border-gold-b rounded-md text-foreground placeholder-gold-s/20 focus:outline-none focus:border-gold-p focus:ring-1 focus:ring-gold-p transition-all duration-150 font-mono text-sm resize-none"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gold-p text-foreground hover:bg-background hover:text-gold-p border border-gold-p font-medium tracking-[0.2em] uppercase text-[10px] rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  );
}
