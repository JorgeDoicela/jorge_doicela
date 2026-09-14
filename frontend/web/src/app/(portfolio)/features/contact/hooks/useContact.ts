import { useState } from 'react';

import { ContactFormData } from '../types';
export type { ContactFormData };

import { API_URL } from '../../../../config';

export function useContact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        ...(formData.subject.trim() ? { subject: formData.subject.trim() } : {}),
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
          : result?.message || 'Error al enviar el mensaje.';
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    submitForm,
    resetForm,
  };
}
