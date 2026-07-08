'use client';

import { useContact } from '../hooks/useContact';

export function ContactForm() {
  const { formData, loading, error, success, handleChange, submitForm } = useContact();

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Envíame un mensaje</h2>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-sm text-center">
          ¡Mensaje enviado con éxito! Te responderé lo antes posible.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={submitForm} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Propuesta de proyecto / Contacto"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  );
}
