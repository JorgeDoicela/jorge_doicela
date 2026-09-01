'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionUrl?: string;
  actionText?: string;
}

interface AiAssistantChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Función para parsear y renderizar Markdown con alto contraste garantizado en claro y oscuro
function FormattedAiText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  const parseInline = (str: string): React.ReactNode[] => {
    // Regex para markdown links [texto](url), negritas (**texto**), código (`código`), /consulta, emails y URLs
    const parts = str.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\/consulta|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s)]+)/g);

    return parts.map((part, idx) => {
      // 1. Markdown link: [Texto](url)
      const mdLinkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (mdLinkMatch) {
        const linkText = mdLinkMatch[1];
        const linkUrl = mdLinkMatch[2];
        const isInternal = linkUrl.startsWith('/');
        if (isInternal) {
          return (
            <Link key={idx} href={linkUrl} className="inline-flex items-center gap-0.5 font-semibold ai-text-link hover:underline">
              {linkText} ↗
            </Link>
          );
        }
        return (
          <a key={idx} href={linkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold ai-text-link hover:underline">
            {linkText} ↗
          </a>
        );
      }

      // 2. Negritas
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="ai-text-strong">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // 3. Código inline
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded font-mono text-[11.5px] font-semibold ai-text-code">
            {part.slice(1, -1)}
          </code>
        );
      }

      // 4. Mención de /consulta directa
      if (part === '/consulta') {
        return (
          <Link key={idx} href="/consulta" className="inline-flex items-center gap-1 font-semibold ai-text-link hover:underline px-1 py-0.5 rounded bg-indigo-500/10 transition-colors">
            Formulario de Consulta ↗
          </Link>
        );
      }

      // 5. Correo electrónico
      if (part.includes('@') && part.includes('.') && !part.startsWith('http')) {
        return (
          <a key={idx} href={`mailto:${part}`} className="font-semibold ai-text-link hover:underline">
            {part}
          </a>
        );
      }

      // 6. URLs directas (http/https)
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold ai-text-link hover:underline">
            {part.replace(/^https?:\/\//, '')} ↗
          </a>
        );
      }

      return <span key={idx} className="ai-text-body">{part}</span>;
    });
  };

  return (
    <div className="space-y-2 text-[13px] sm:text-sm leading-relaxed ai-text-body">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Títulos Markdown (### o ##)
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const titleText = trimmed.replace(/^#+\s+/, '');
          return (
            <h4 key={idx} className="ai-text-strong text-sm pt-1 pb-0.5">
              {parseInline(titleText)}
            </h4>
          );
        }

        // Elemento de lista (- o •)
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className="w-1.5 h-1.5 rounded-full ai-text-bullet shrink-0 mt-2" />
              <div className="flex-1 ai-text-body">{parseInline(trimmed.slice(2))}</div>
            </div>
          );
        }

        // Elemento numerado (ej. "1. " o "1. **Título**")
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className="font-mono text-xs ai-text-number shrink-0 mt-0.5">
                {numberedMatch[1]}.
              </span>
              <div className="flex-1 ai-text-body">{parseInline(numberedMatch[2])}</div>
            </div>
          );
        }

        // Párrafo estándar
        return <p key={idx} className="ai-text-body">{parseInline(line)}</p>;
      })}
    </div>
  );
}

export function AiAssistantChatModal({ isOpen, onClose }: AiAssistantChatModalProps) {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const latestUserMessageRef = useRef<HTMLDivElement>(null);

  // Anclar scroll al inicio del mensaje del usuario
  const scrollToLatestInteraction = useCallback((smooth = true) => {
    if (latestUserMessageRef.current) {
      latestUserMessageRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start'
      });
    }
  }, []);

  // Mensaje inicial de bienvenida sincronizado reactivamente con el idioma
  useEffect(() => {
    if (isOpen) {
      setMessages((prev) => {
        // Si no hay mensajes o solo está el mensaje de bienvenida, actualizarlo al idioma activo
        if (prev.length === 0 || (prev.length === 1 && prev[0].id === 'welcome')) {
          return [
            {
              id: 'welcome',
              sender: 'ai',
              text: isEs
                ? 'Hola. Soy el Asistente de IA de Jorge Doicela. Puedo responder tus dudas sobre sus proyectos de software, experiencia técnica (Full Stack, IA, Cloud 1 GB RAM) o ayudarte a solicitar una propuesta personalizada. ¿En qué te puedo ayudar hoy?'
                : "Hello. I am Jorge Doicela's AI Assistant. I can answer questions about his software projects, technical background (Full Stack, AI, 1 GB RAM Cloud), or help you request a custom proposal. How can I assist you today?",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }
        return prev;
      });
    }
  }, [isOpen, isEs]);

  // Enfocar input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Motor de respuestas semánticas locales de respaldo
  const generateAiResponse = (userQuery: string): { text: string; actionUrl?: string; actionText?: string } => {
    const q = userQuery.toLowerCase().trim();

    if (['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'que tal', 'hi', 'hello', 'hey'].some(s => q === s || q.startsWith(s + ' '))) {
      return {
        text: isEs
          ? 'Hola. Es un gusto saludarte. Soy el asistente de IA de Jorge Doicela. Puedo responder tus consultas sobre sus plataformas en producción (La Biblia, Software, Portafolio), su experiencia Full Stack / Cloud en 1 GB de RAM, o ayudarte a solicitar una propuesta técnica.'
          : "Hello. Nice to meet you. I am Jorge Doicela's AI assistant. I can answer your questions about his live platforms (The Bible, Software, Portfolio), his Full Stack / 1 GB RAM Cloud experience, or help you request a technical proposal."
      };
    }

    if (q.includes('tecnolog') || q.includes('stack') || q.includes('lenguaje') || q.includes('experiencia') || q.includes('skill')) {
      return {
        text: isEs
          ? 'Jorge es Desarrollador Full Stack & AI Engineer con dominio en:\n\n- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Feature-Sliced Design (FSD).\n- **Backend:** NestJS 11, Node.js, C# / .NET Core, Laravel y arquitectura limpia de 3 capas.\n- **Móvil:** Expo SDK y React Native.\n- **Cloud & DevOps:** Linux Debian 13 en AWS Lightsail (1 GB de RAM), Nginx mTLS, Cloudflare Edge, PM2 y CI/CD con GitHub Actions.\n- **Bases de Datos:** SQLite WAL de alta velocidad, PostgreSQL y TypeORM.'
          : "Jorge is a Full Stack & AI Engineer specialized in:\n\n- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Feature-Sliced Design (FSD).\n- **Backend:** NestJS 11, Node.js, C# / .NET Core, Laravel, and Clean 3-Tier Architecture.\n- **Mobile:** Expo SDK and React Native.\n- **Cloud & DevOps:** Linux Debian 13 on AWS Lightsail (1 GB RAM), Nginx mTLS, Cloudflare Edge, PM2, and GitHub Actions CI/CD.\n- **Databases:** High-performance SQLite WAL, PostgreSQL, and TypeORM."
      };
    }

    if (q.includes('proyecto') || q.includes('plataforma') || q.includes('produccion') || q.includes('project')) {
      return {
        text: isEs
          ? 'Jorge ha desarrollado 3 plataformas propias en producción:\n\n1. **La Biblia:** Sistema exegético con 9 motores de estudio bíblico, morfología hebrea/griega y códigos Strong (`bible.jorgedoicela.com`).\n2. **Software:** Plataforma con 7 áreas de contenido tecnológico, noticias, modelos de IA y avisos de ciberseguridad (`software.jorgedoicela.com`).\n3. **Portafolio:** Terminal interactiva SSH en tiempo real conectada con WebSockets (`portfolio.jorgedoicela.com`).'
          : "Jorge has built 3 proprietary live platforms in production:\n\n1. **The Bible:** Biblical exegesis engine with 9 study modules, Hebrew/Greek morphology, and Strong codes (`bible.jorgedoicela.com`).\n2. **Software:** Tech outreach platform covering 7 categories, news, AI directory, and security CVEs (`software.jorgedoicela.com`).\n3. **Portfolio:** Real-time interactive SSH terminal (`portfolio.jorgedoicela.com`)."
      };
    }

    if (q.includes('1 gb') || q.includes('ram') || q.includes('cloud') || q.includes('lightsail') || q.includes('vps') || q.includes('memoria')) {
      return {
        text: isEs
          ? 'La infraestructura de Jorge corre sobre un servidor AWS Lightsail (Debian 13) con **1 GB de RAM**.\n\nPara lograr estabilidad 24/7 sin saturación, consolidó un único proceso NestJS en el backend y un único proceso Next.js en el frontend con resolución por subdominios, Nginx mTLS, bundles Standalone y compilación externa en GitHub Actions sin consumir RAM en el servidor.'
          : "Jorge's infrastructure runs on an AWS Lightsail VPS (Debian 13) with **1 GB of RAM**.\n\nTo ensure 24/7 rock-solid stability, the architecture consolidates a single NestJS backend process and a single Next.js frontend process with subdomain routing, Nginx mTLS, Standalone bundles, and remote GitHub Actions builds to avoid server RAM spikes."
      };
    }

    if (q.includes('biblia') || q.includes('bible') || q.includes('exege') || q.includes('strong')) {
      return {
        text: isEs
          ? 'La Biblia es un motor de estudio teológico con 9 motores exegéticos: morfología palabra por palabra en BHS (hebreo) y NA28 (griego), diccionarios Strong (BDB y Thayer), paralelismos literarios y mapas geoespaciales WGS84.'
          : 'The Bible is an advanced theological exegesis engine featuring 9 modules: word-by-word morphology in BHS (Hebrew) and NA28 (Greek), Strong lexicons (BDB & Thayer), literary parallelisms, and WGS84 biblical mapping.'
      };
    }

    if (q.includes('cotiza') || q.includes('presupuesto') || q.includes('propuesta') || q.includes('precio') || q.includes('contrat') || q.includes('quote') || q.includes('contact') || q.includes('proposal')) {
      return {
        text: isEs
          ? 'Puedes solicitar una propuesta técnica y cotización formal de desarrollo web, móvil o arquitectura en la sección de consulta. Jorge responde personalmente en menos de 24 horas con alcance, tiempos y presupuesto detallado.'
          : 'You can request a formal technical proposal and estimate for web, mobile, or cloud architecture in the consultation section. Jorge personally responds within 24 hours with detailed scope, timeline, and pricing.',
        actionUrl: '/consulta',
        actionText: isEs ? 'Solicitar Propuesta Técnica' : 'Request Technical Proposal'
      };
    }

    if (q.includes('correo') || q.includes('email') || q.includes('mail')) {
      return {
        text: isEs
          ? 'El correo directo de Jorge es **jorge.doicela.m@gmail.com**.'
          : "Jorge's direct email is **jorge.doicela.m@gmail.com**."
      };
    }

    if (q.includes('fe') || q.includes('dios') || q.includes('colosenses') || q.includes('filosof')) {
      return {
        text: isEs
          ? 'La filosofía de ingeniería de Jorge está inspirada en la devoción y honestidad: *"Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres"* (Colosenses 3:23).'
          : 'Jorge\'s engineering philosophy is anchored in devotion and integrity: *"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters"* (Colossians 3:23).'
      };
    }

    // Respuesta genérica inteligente
    return {
      text: isEs
        ? `Entiendo tu consulta sobre "${userQuery}". Jorge está disponible para proyectos de ingeniería de software, arquitectura cloud y aplicaciones web/móviles. Si deseas evaluar un proyecto específico, puedes enviar una solicitud formal directamente:`
        : `I understand your question regarding "${userQuery}". Jorge is open for software engineering, cloud architecture, and web/mobile projects. If you would like to discuss a specific project, feel free to send a consultation request:`,
      actionUrl: '/consulta',
      actionText: isEs ? 'Abrir Formulario de Consulta' : 'Open Consultation Form'
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInputText('');
    resetTextareaHeight();
    setIsTyping(true);

    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = {
      id: aiMessageId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, initialAiMessage]);

    // Anclar la vista inmediatamente al nuevo mensaje para leer desde el principio
    setTimeout(() => scrollToLatestInteraction(true), 40);

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 30000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          message: text,
          language,
          history: nextHistory.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      clearTimeout(timeoutId);

      if (!res.ok || !res.body) {
        throw new Error(`Error en respuesta del servidor: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  text: accumulatedText,
                  actionUrl: accumulatedText.includes('/consulta') ? '/consulta' : undefined,
                  actionText: accumulatedText.includes('/consulta') ? (isEs ? 'Solicitar Propuesta Técnica' : 'Request Technical Proposal') : undefined
                }
              : msg
          )
        );
      }

      // Si el stream terminó sin texto, aplicar respuesta de respaldo inmediata
      if (!accumulatedText.trim()) {
        const fallback = generateAiResponse(text);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  text: fallback.text,
                  actionUrl: fallback.actionUrl,
                  actionText: fallback.actionText
                }
              : msg
          )
        );
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Error en streaming de IA:', err);
      const fallback = generateAiResponse(text);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: fallback.text,
                actionUrl: fallback.actionUrl,
                actionText: fallback.actionText
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInputText('');
    resetTextareaHeight();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] max-h-[82vh] sm:max-h-[580px] flex flex-col rounded-3xl ai-modal-window border overflow-hidden transition-all duration-200"
      role="dialog"
      aria-modal="false"
      aria-labelledby="ai-chat-title"
    >
      {/* Cabecera Integrada y Minimalista */}
      <header className="px-4.5 py-3.5 ai-modal-header flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src="/landing/logo/logo_fondo_circular_color_.png"
            alt="Jorge Doicela"
            width={32}
            height={32}
            className="w-7.5 h-7.5 rounded-full object-cover"
          />

          <div className="flex flex-col text-left">
            <h3 id="ai-chat-title" className="text-xs sm:text-sm font-semibold tracking-tight font-outfit">
              {isEs ? 'Asistente IA' : 'AI Assistant'}
            </h3>
            <span className="text-[10px] opacity-60 font-mono">
              Jorge Doicela
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Reiniciar Chat - Solo visible tras haber interactuado */}
          {messages.some((m) => m.sender === 'user') && (
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-all cursor-pointer"
              title={isEs ? 'Reiniciar conversación' : 'Reset conversation'}
              aria-label={isEs ? 'Reiniciar conversación' : 'Reset conversation'}
            >
              <RotateCcw size={14} />
            </button>
          )}

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-colors cursor-pointer"
            title={isEs ? 'Cerrar' : 'Close'}
            aria-label={isEs ? 'Cerrar' : 'Close'}
          >
            <X size={15} />
          </button>
        </div>
      </header>

      {/* Cuerpo de Mensajes sobre Lienzo Continuo */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[360px] sm:max-h-[400px] ai-modal-body [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {messages.map((msg, index) => {
          const isLatestUser = msg.sender === 'user' && index === messages.map((m) => m.sender).lastIndexOf('user');
          return (
            <div
              key={msg.id}
              ref={isLatestUser ? latestUserMessageRef : undefined}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full ai-modal-bubble-ai border flex items-center justify-center shrink-0 mt-0.5 opacity-80">
                <Bot size={13} />
              </div>
            )}

            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[86%]`}>
              <div
                className={`p-3.5 rounded-2xl break-words ${
                  msg.sender === 'user'
                    ? 'rounded-tr-xs bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-medium shadow-xs text-[13px] sm:text-sm leading-relaxed whitespace-pre-line'
                    : 'rounded-tl-xs ai-modal-bubble-ai border'
                }`}
              >
                {msg.sender === 'user' ? (
                  msg.text
                ) : msg.text ? (
                  <FormattedAiText text={msg.text} />
                ) : (
                  <span className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}

                {/* Enlace embebido a /consulta */}
                {msg.actionUrl && (
                  <div className="mt-2.5 pt-2 border-t border-foreground/10">
                    <Link
                      href={msg.actionUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors font-outfit"
                    >
                      <span>{msg.actionText}</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Pie de Mensaje solo con Hora */}
              <div className="flex items-center mt-1 px-1">
                <span className="text-[9px] opacity-50 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <User size={12} />
              </div>
            )}
          </div>
        );
      })}
    </div>

      {/* Barra de Entrada Integrada en el Mismo Lienzo */}
      <footer className="p-3 ai-modal-footer flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={isEs ? 'Escribe una pregunta...' : 'Ask a question...'}
          maxLength={1000}
          className="flex-1 px-3.5 py-2 rounded-2xl ai-modal-input border text-xs sm:text-sm focus:outline-none transition-all resize-none max-h-[120px] overflow-hidden leading-relaxed"
          aria-label={isEs ? 'Pregunta para el Asistente' : 'Question for the Assistant'}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer flex items-center justify-center shrink-0 mb-0.5"
          title={isEs ? 'Enviar (Enter)' : 'Send (Enter)'}
          aria-label={isEs ? 'Enviar' : 'Send'}
        >
          <Send size={18} />
        </button>
      </footer>
    </div>
  );
}
