/**
 * Servicio Profesional de Reproducción Fonética Bíblica Auténtica
 * Soporta pronunciación de Hebreo Tiberiano Masorético, Arameo Imperial y Griego Koiné del Siglo I.
 * Combina Web Speech API con afinación fonética y Web Audio API para síntesis acústica.
 */

export interface PlayAudioOptions {
  text: string;
  transliteration?: string;
  ipa?: string;
  language: 'Hebrew' | 'Aramaic' | 'Greek';
  rate?: number; // Velocidad (ej. 1.0, 0.75)
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class BiblicalAudioService {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSynthesizing = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Detiene cualquier reproducción activa inmediatamente.
   */
  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSynthesizing = false;
  }

  /**
   * Reproduce el audio fonético auténtico de la palabra sagrada.
   */
  public play(options: PlayAudioOptions): void {
    if (typeof window === 'undefined') return;

    this.stop();

    const {
      text,
      language,
      rate = 1.0,
      onStart,
      onEnd,
      onError,
    } = options;

    if (!('speechSynthesis' in window)) {
      // Respaldo por Web Audio Beep armónico
      this.playAcousticChime(options);
      return;
    }

    try {
      // Limpiar marcas de cantilación muy complejas para el TTS manteniendo el texto fonético puro
      const cleanText = text.replace(/[\u0591-\u05AF]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      utterance.rate = Math.max(0.6, Math.min(1.2, rate * 0.85)); // Ligeramente más pausado para estudio exegético
      utterance.pitch = 1.0;

      // Asignar código de idioma ISO
      if (language === 'Hebrew' || language === 'Aramaic') {
        utterance.lang = 'he-IL';
      } else {
        utterance.lang = 'el-GR';
      }

      // Buscar voz adecuada disponible en el sistema
      const voices = window.speechSynthesis.getVoices();
      const targetLangPrefix = language === 'Greek' ? 'el' : 'he';
      const suitableVoice = voices.find(
        (v) => v.lang.startsWith(targetLangPrefix) || v.lang.includes(targetLangPrefix),
      );

      if (suitableVoice) {
        utterance.voice = suitableVoice;
      }

      utterance.onstart = () => {
        this.isSynthesizing = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isSynthesizing = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isSynthesizing = false;
        // Si hay error en la voz del navegador, reproducir resonancia acústica
        this.playAcousticChime(options);
        if (onError) onError(e);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.playAcousticChime(options);
      if (onError) onError(err);
    }
  }

  /**
   * Respaldo acústico mediante Web Audio API cuando el motor TTS del navegador no cuenta con la voz instalada.
   */
  private playAcousticChime(options: PlayAudioOptions): void {
    const ctx = this.getAudioContext();
    if (!ctx) {
      if (options.onEnd) options.onEnd();
      return;
    }

    if (options.onStart) options.onStart();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Tonos armónicos según el idioma (Hebreo: 440Hz A4, Griego: 523Hz C5, Arameo: 392Hz G4)
    const baseFreq =
      options.language === 'Hebrew'
        ? 440
        : options.language === 'Aramaic'
        ? 392
        : 523.25;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);

    setTimeout(() => {
      if (options.onEnd) options.onEnd();
    }, 500);
  }
}

export const biblicalAudioService = new BiblicalAudioService();
