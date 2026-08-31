'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from 'next-intl';

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

export function AiAssistantChatModal({ isOpen, onClose }: AiAssistantChatModalProps) {
  const { language } = useLanguage();
  const t = useTranslations('Links');
  const isEs = language === 'es';

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sugerencias de preguntas rápidas
  const quickQuestions = isEs
    ? [
        '¿En qué tecnologías se especializa Jorge?',
        '¿Qué proyectos tiene en producción?',
        '¿Cómo funciona la arquitectura en 1 GB de RAM?',
        '¿Cómo puedo solicitar una cotización o propuesta?'
      ]
    : [
        'What technologies does Jorge specialize in?',
        'What projects are currently live in production?',
        'How does the 1 GB RAM cloud architecture work?',
        'How can I request a quote or technical proposal?'
      ];

  // Mensaje inicial de bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: Message = {
        id: 'welcome',
        sender: 'ai',
        text: isEs
          ? '¡Hola! 👋 Soy el Asistente de IA de Jorge Doicela. Puedo responder tus dudas sobre sus proyectos de software, experiencia técnica (Full Stack, IA, Cloud 1 GB RAM) o ayudarte a solicitar una propuesta personalizada. ¿En qué te puedo ayudar hoy?'
          : "Hello! 👋 I am Jorge Doicela's AI Assistant. I can answer questions about his software projects, technical background (Full Stack, AI, 1 GB RAM Cloud), or help you request a custom proposal. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, messages.length, isEs]);

  // Auto-scroll al recibir o enviar mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Enfocar input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Motor de respuestas semánticas en tiempo real basado en el conocimiento de Jorge Doicela
  const generateAiResponse = (userQuery: string): { text: string; actionUrl?: string; actionText?: string } => {
    const q = userQuery.toLowerCase().trim();

    if (q.includes('tecnolog') || q.includes('stack') || q.includes('lenguaje') || q.includes('experiencia') || q.includes('skill')) {
      return {
        text: isEs
          ? 'Jorge es Desarrollador Full Stack & AI Engineer con dominio en:\n\n• **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Feature-Sliced Design (FSD).\n• **Backend:** NestJS 11, Node.js, C# / .NET Core, Laravel y arquitectura limpia de 3 capas.\n• **Móvil:** Expo SDK y React Native.\n• **Cloud & DevOps:** Linux Debian 13 en AWS Lightsail (1 GB de RAM), Nginx mTLS, Cloudflare Edge, PM2 y CI/CD con GitHub Actions.\n• **Bases de Datos:** SQLite WAL de alta velocidad, PostgreSQL y TypeORM.'
          : "Jorge is a Full Stack & AI Engineer specialized in:\n\n• **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Feature-Sliced Design (FSD).\n• **Backend:** NestJS 11, Node.js, C# / .NET Core, Laravel, and Clean 3-Tier Architecture.\n• **Mobile:** Expo SDK and React Native.\n• **Cloud & DevOps:** Linux Debian 13 on AWS Lightsail (1 GB RAM), Nginx mTLS, Cloudflare Edge, PM2, and GitHub Actions CI/CD.\n• **Databases:** High-performance SQLite WAL, PostgreSQL, and TypeORM."
      };
    }

    if (q.includes('proyecto') || q.includes('plataforma') || q.includes('produccion') || q.includes('project')) {
      return {
        text: isEs
          ? 'Jorge ha desarrollado 3 plataformas propias en producción:\n\n1. **La Biblia:** Sistema exegético con 9 motores de estudio bíblico, morfología hebrea/griega y códigos Strong (`bible.jorgedoicela.com`).\n2. **Software:** Plataforma con 7 áreas de contenido tecnológico, noticias, modelos de IA y avisos de ciberseguridad (`software.jorgedoicela.com`).\n3. **Portafolio:** Terminal interactiva SSH en tiempo real conectada con WebSockets (`portfolio.jorgedoicela.com`).'
          : "Jorge has built 3 proprietary live platforms in production:\n\n1. **The Bible:** Biblical exegesis engine with 9 study modules, Hebrew/Greek morphology, and Strong codes (`bible.jorgedoicela.com`).\n2. **Software:** Tech outreach platform covering 7 categories, news, AI directory, and security CVEs (`software.jorgedoicela.com`).\n3. **Portfolio:** Real-time interactive SSH terminal built over WebSockets (`portfolio.jorgedoicela.com`)."
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
          ? '📖 **La Biblia** es un motor de estudio teológico con 9 motores exegéticos: morfología palabra por palabra en BHS (hebreo) y NA28 (griego), diccionarios Strong (BDB y Thayer), paralelismos literarios y mapas geoespaciales WGS84.'
          : '📖 **The Bible** is an advanced theological exegesis engine featuring 9 modules: word-by-word morphology in BHS (Hebrew) and NA28 (Greek), Strong lexicons (BDB & Thayer), literary parallelisms, and WGS84 biblical mapping.'
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
          ? 'La filosofía de ingeniería de Jorge está inspirada en la devoción y honestidad cristiana: *"Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres"* (Colosenses 3:23).'
          : 'Jorge\'s engineering philosophy is anchored in Christian devotion and integrity: *"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters"* (Colossians 3:23).'
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
    setIsTyping(true);

    try {
      const res = await fetch('/api/landing/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: nextHistory.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || (isEs ? 'No pude procesar la respuesta en este momento.' : 'Could not process the response at this time.');
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionUrl: replyText.includes('/consulta') ? '/consulta' : undefined,
          actionText: replyText.includes('/consulta') ? (isEs ? 'Solicitar Propuesta Técnica' : 'Request Technical Proposal') : undefined
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error('Error en endpoint de chat');
      }
    } catch (err) {
      console.error('Error en llamada a asistente de IA:', err);
      // Fallback local garantizado
      const fallback = generateAiResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionUrl: fallback.actionUrl,
        actionText: fallback.actionText
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[390px] max-h-[82vh] sm:max-h-[580px] flex flex-col rounded-2xl bg-card border border-card-border shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-200"
      role="dialog"
      aria-modal="false"
      aria-labelledby="ai-chat-title"
    >
      {/* Cabecera Limpia y Sencilla */}
      <header className="px-4 py-3 bg-card border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Image
              src="/landing/logo/logo_fondo_circular_color_.png"
              alt="Jorge Doicela"
              width={34}
              height={34}
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card" />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <h3 id="ai-chat-title" className="text-xs sm:text-sm font-bold tracking-tight font-outfit text-foreground">
                {isEs ? 'Asistente IA' : 'AI Assistant'}
              </h3>
              <Sparkles size={12} className="text-amber-500 fill-amber-500" />
            </div>
            <span className="text-[10px] text-text-subtitle font-mono">
              {isEs ? 'Jorge Doicela' : 'Jorge Doicela'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Reiniciar Chat */}
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
            title={isEs ? 'Reiniciar' : 'Reset'}
            aria-label={isEs ? 'Reiniciar' : 'Reset'}
          >
            <RotateCcw size={14} />
          </button>

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
            title={isEs ? 'Cerrar' : 'Close'}
            aria-label={isEs ? 'Cerrar' : 'Close'}
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Cuerpo de Mensajes */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 max-h-[360px] sm:max-h-[400px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-foreground/5 border border-card-border flex items-center justify-center text-foreground shrink-0 mt-0.5">
                <Bot size={13} />
              </div>
            )}

            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[84%]`}>
              <div
                className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#0d152e] via-[#1a174d] to-[#431475] text-white font-medium'
                    : 'bg-background/80 border border-card-border text-foreground'
                }`}
              >
                {msg.text}

                {/* Enlace embebido a /consulta */}
                {msg.actionUrl && (
                  <div className="mt-2 pt-2 border-t border-card-border">
                    <Link
                      href={msg.actionUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors font-outfit"
                    >
                      <span>{msg.actionText}</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-text-subtitle mt-0.5 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground shrink-0 mt-0.5">
                <User size={13} />
              </div>
            )}
          </div>
        ))}

        {/* Indicador de tipeo */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-foreground/5 border border-card-border flex items-center justify-center text-foreground shrink-0 mt-0.5">
              <Bot size={13} />
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-card-border text-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias Rápidas */}
      {messages.length <= 2 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-medium text-text-muted hover:text-foreground px-2.5 py-1 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-card-border transition-all active:scale-95 text-left cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input de Mensaje */}
      <footer className="p-2.5 bg-card border-t border-card-border flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={isEs ? 'Escribe una pregunta...' : 'Ask a question...'}
          maxLength={500}
          className="flex-1 px-3 py-2 rounded-xl bg-background border border-card-border text-foreground placeholder:text-text-subtitle text-xs sm:text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
          aria-label={isEs ? 'Pregunta para el Asistente' : 'Question for the Assistant'}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className="p-2 rounded-xl bg-gradient-to-r from-[#0d152e] via-[#1a174d] to-[#431475] hover:from-[#141f45] hover:to-[#551b94] text-white shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer flex items-center justify-center"
          title={isEs ? 'Enviar' : 'Send'}
          aria-label={isEs ? 'Enviar' : 'Send'}
        >
          <Send size={14} />
        </button>
      </footer>
    </div>
  );
}
