import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

function getApiKey(keyName: string): string | undefined {
  if (process.env[keyName]) return process.env[keyName];

  const possiblePaths = [
    path.join(process.cwd(), 'frontend/web/.env'),
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), 'frontend/web/.env.local'),
    path.join(process.cwd(), '.env.local'),
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(new RegExp(`^${keyName}=+(.*)$`, 'm'));
        if (match && match[1]) {
          const val = match[1].trim().replace(/^=+/, '').trim().replace(/^["']|["']$/g, '');
          if (val) return val;
        }
      } catch {
        // Continuar
      }
    }
  }

  return undefined;
}

// ============================================================================
// CAPA DE SEGURIDAD EQUILIBRADA (Protección contra Ataques + Fluidez para Usuarios)
// ============================================================================

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const responseCache = new Map<string, { text: string; expiresAt: number }>();

const MAX_REQUESTS_PER_MINUTE = 15;
const MAX_REQUESTS_PER_HOUR = 80;
const CACHE_TTL_MS = 1000 * 60 * 20; // 20 minutos de caché
const CACHE_MAX_ENTRIES = 300;

function cleanOldRateLimits() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  for (const [ip, record] of rateLimitMap.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > oneHourAgo);
    if (record.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }

  for (const [key, item] of responseCache.entries()) {
    if (item.expiresAt < now) {
      responseCache.delete(key);
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanOldRateLimits, 5 * 60 * 1000);
}

function checkRateLimit(clientIp: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  let record = rateLimitMap.get(clientIp);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(clientIp, record);
  }

  const oneMinuteAgo = now - 60 * 1000;
  const oneHourAgo = now - 60 * 60 * 1000;

  const requestsLastMinute = record.timestamps.filter((t) => t > oneMinuteAgo).length;
  const requestsLastHour = record.timestamps.filter((t) => t > oneHourAgo).length;

  if (requestsLastMinute >= MAX_REQUESTS_PER_MINUTE) {
    return { allowed: false, retryAfter: 10 };
  }

  if (requestsLastHour >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, retryAfter: 30 };
  }

  record.timestamps.push(now);
  return { allowed: true };
}

// Dossier del Sistema de Información sobre Jorge Doicela para el Asistente de IA
const SYSTEM_PROMPT = `
Eres el Asistente de Inteligencia Artificial oficial de Jorge Doicela (Jorge Ismael Doicela Molina).
Tu misión es atender a los visitantes, reclutadores, ingenieros y clientes de forma profesional, cordial, técnicamente profunda y honesta.

INFORMACIÓN SOBRE JORGE DOICELA:
• Ubicación: Quito, Ecuador.
• Perfil Profesional: Full Stack Developer, AI Engineer y DevSecOps.
• Especialidades Técnicas:
  - Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Feature-Sliced Design (FSD).
  - Backend: NestJS 11, Node.js, C# / .NET Core, Laravel, Arquitectura Limpia de 3 Capas.
  - Móvil: Expo SDK, React Native (iOS y Android).
  - Cloud, Infraestructura & 1 GB RAM: Servidor VPS Debian 13 en AWS Lightsail optimizado para correr 4 plataformas consolidadas en 1 GB de RAM sin caídas, Nginx mTLS, Cloudflare Edge WAF, PM2 y pipelines CI/CD con GitHub Actions.
  - Bases de Datos: SQLite WAL (ultra-rápido y atómico), PostgreSQL, TypeORM.
  - Seguridad & Rate Limiting: Arquitectura multicapa con Sliding Window por IP, token budgeting, failover automático y sanitización.
• Plataformas Propias en Producción:
  1. La Biblia (bible.jorgedoicela.com): Plataforma con 9 motores de estudio bíblico exegético, análisis morfológico palabra por palabra en hebreo (BHS) y griego (NA28), códigos Strong, atlas geoespacial WGS84 y app móvil offline en Expo.
  2. Software (software.jorgedoicela.com): Plataforma de divulgación técnica con 7 categorías (noticias, blog de arquitectura, directorio de IA, avisos de ciberseguridad CVE con remediación, tutoriales paso a paso y foros).
  3. Portafolio (portfolio.jorgedoicela.com): Portafolio profesional con emulador de terminal SSH interactivo virtual en tiempo real sobre WebSockets (Socket.io).
• Contacto y Cotizaciones:
  - Correo: jorge.doicela.m@gmail.com
  - Formulario de Propuestas Técnicas: /consulta (Jorge responde personalmente en menos de 24 horas con estimación técnica y presupuesto).
  - Redes: GitHub (github.com/JorgeDoicela), LinkedIn (linkedin.com/in/jorgedoicela), YouTube (youtube.com/@jorge.doicela), TikTok (@jorge.doicela).
• Filosofía y Principios:
  - Software con propósito y excelencia: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres" (Colosenses 3:23).
  - Cero deuda técnica deliberada y honestidad técnica.

INSTRUCCIONES DE RESPUESTA:
1. Idioma: Responde siempre en el idioma en que te hable el usuario (Español o Inglés).
2. Flexibilidad Técnica y Empatía: Puedes responder consultas sobre desarrollo de software, arquitectura en la nube, optimización en 1 GB de RAM, seguridad, frontend/backend y detalles técnicos, conectándolos de manera natural con la experiencia y proyectos reales de Jorge.
3. Límites Profesionales: Si te preguntan sobre temas totalmente ajenos a la tecnología, ingeniería o la labor de Jorge (ej. política, recetas de cocina, tareas de colegio no relacionadas), declina cordialmente y reorienta la conversación hacia la ingeniería y servicios de Jorge.
4. Contratación y Proyectos: Si el usuario desea cotizar un software o colaborar con Jorge, recomiéndale ingresar al enlace interactivo [Formulario de Consulta](/consulta) o escribir directamente a jorge.doicela.m@gmail.com.
5. Estilo: Sé claro, estructurado, profesional y sobrio. Prohibido terminantemente el uso de emojis.
`;

export async function POST(req: NextRequest) {
  try {
    // 1. Detección de IP para Rate Limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

    // 2. Control de Rate Limiting
    const rateCheck = checkRateLimit(clientIp);
    const isEs = req.headers.get('accept-language')?.includes('es') ?? true;

    if (!rateCheck.allowed) {
      console.warn(`[AI CHAT - SECURITY] Rate limit superado para IP: ${clientIp}`);
      const limitMessage = isEs
        ? 'Has realizado varias consultas continuas. Por favor, espera unos segundos antes de enviar tu siguiente pregunta o visita /consulta para contactar a Jorge directamente.'
        : 'You have made multiple consecutive requests. Please wait a few seconds before asking again or visit /consulta to contact Jorge directly.';

      return createTextStreamResponse(limitMessage);
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Cuerpo de solicitud inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { message, language = 'es', history = [] } = body;
    const isLanguageEs = language === 'es';

    // 3. Validación y Sanitización (Límite amplio de 1,000 caracteres para consultas ricas)
    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(JSON.stringify({ error: 'El mensaje no puede estar vacío' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitizedMessage = message.trim().slice(0, 1000);

    // 4. Verificación en Caché
    const cacheKey = `${language}:${sanitizedMessage.toLowerCase()}`;
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      console.log(`[AI CHAT - CACHE HIT] Respuesta servida desde caché local para: "${sanitizedMessage.slice(0, 40)}..."`);
      return createTextStreamResponse(cached.text);
    }

    const groqKey = getApiKey('GROQ_API_KEY');

    // 5. STREAMING CON GROQ LPU (Configuración Equilibrada)
    if (groqKey) {
      const groqModels = [
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'qwen/qwen3.8-27b',
        'groq/compound',
        'qwen/qwen3.6-27b'
      ];

      // Conservar los últimos 6 mensajes del historial (hasta 600 caracteres c/u) para diálogo fluido
      const truncatedHistory = Array.isArray(history)
        ? history.slice(-6).map((h: { sender: string; text: string }) => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: String(h.text || '').slice(0, 600)
          }))
        : [];

      for (const model of groqModels) {
        try {
          const groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
          const messagesPayload = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...truncatedHistory,
            { role: 'user', content: sanitizedMessage }
          ];

          const groqRes = await fetch(groqEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model,
              messages: messagesPayload,
              temperature: 0.4,
              max_tokens: 800,
              stream: true,
            }),
            signal: AbortSignal.timeout(6000),
          });

          if (groqRes.status === 429) {
            console.warn(`[AI CHAT - GROQ] Cuota de proveedor excedida (429). Conmutando a Fallback.`);
            break;
          }

          if (groqRes.ok && groqRes.body) {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            let fullAccumulatedText = '';

            const customStream = new ReadableStream({
              async start(controller) {
                const reader = groqRes.body!.getReader();
                let buffer = '';
                let inThink = false;

                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const chunks = buffer.split(/(?:\r?\n|^)data:\s*/);
                    buffer = chunks.pop() || '';
                    if (buffer) buffer = 'data: ' + buffer;

                    for (const chunk of chunks) {
                      const trimmed = chunk.trim();
                      if (!trimmed || trimmed === '[DONE]') continue;

                      try {
                        const parsed = JSON.parse(trimmed);
                        const chunkText = parsed?.choices?.[0]?.delta?.content;
                        if (chunkText) {
                          if (chunkText.includes('<think>')) {
                            inThink = true;
                          }

                          if (inThink) {
                            if (chunkText.includes('</think>')) {
                              inThink = false;
                              const after = chunkText.split('</think>')[1];
                              if (after) {
                                controller.enqueue(encoder.encode(after));
                                fullAccumulatedText += after;
                              }
                            }
                          } else {
                            const cleanText = chunkText.replace(/<think>[\s\S]*?<\/think>/g, '');
                            if (cleanText) {
                              controller.enqueue(encoder.encode(cleanText));
                              fullAccumulatedText += cleanText;
                            }
                          }
                        }
                      } catch {
                        // Fragmento JSON parcial
                      }
                    }
                  }

                  // Guardar en caché LRU respuestas estables
                  if (fullAccumulatedText.trim().length > 20) {
                    if (responseCache.size >= CACHE_MAX_ENTRIES) {
                      const oldestKey = responseCache.keys().next().value;
                      if (oldestKey) responseCache.delete(oldestKey);
                    }
                    responseCache.set(cacheKey, {
                      text: fullAccumulatedText.trim(),
                      expiresAt: Date.now() + CACHE_TTL_MS
                    });
                  }
                } catch (err) {
                  console.error(`[AI CHAT - GROQ] Error en stream:`, err);
                } finally {
                  controller.close();
                }
              }
            });

            return new Response(customStream, {
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'Transfer-Encoding': 'chunked',
              }
            });
          }
        } catch (err) {
          console.error(`[AI CHAT - GROQ] Error con ${model}:`, err);
        }
      }
    }

    // 6. FALLBACK LOCAL INTELIGENTE
    console.log(`[AI CHAT] Activando Fallback Inteligente Local para: "${sanitizedMessage.slice(0, 40)}..."`);
    const fallbackText = generateFallbackResponse(sanitizedMessage, isLanguageEs);
    return createTextStreamResponse(fallbackText);

  } catch (error) {
    console.error('Error en Route Handler de Chat:', error);
    return new Response(JSON.stringify({ error: 'Error procesando la solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function createTextStreamResponse(text: string): Response {
  const encoder = new TextEncoder();
  const words = text.split(' ');

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + words[i];
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, 14));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    }
  });
}

function generateFallbackResponse(userQuery: string, isEs: boolean): string {
  const q = userQuery.toLowerCase().trim();

  // Saludos
  if (['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'que tal', 'hi', 'hello', 'hey'].some(s => q === s || q.startsWith(s + ' '))) {
    return isEs
      ? 'Hola. Es un gusto saludarte. Soy el asistente de IA de Jorge Doicela. Puedo responder tus consultas sobre sus plataformas en producción (La Biblia, Software, Portafolio), su experiencia Full Stack / Cloud en 1 GB de RAM, o ayudarte a solicitar una propuesta técnica.'
      : "Hello. Nice to meet you. I am Jorge Doicela's AI assistant. I can answer your questions about his live platforms (The Bible, Software, Portfolio), his Full Stack / 1 GB RAM Cloud experience, or help you request a technical proposal.";
  }

  if (q.includes('quien eres') || q.includes('who are you') || q.includes('que eres')) {
    return isEs
      ? 'Soy el Asistente Virtual Oficial de Jorge Doicela. Estoy aquí para responder preguntas sobre sus habilidades de desarrollo de software, arquitectura cloud y plataformas en producción, o conectarte con él para nuevos proyectos.'
      : "I am Jorge Doicela's Official Virtual Assistant. I am here to answer questions regarding his software engineering skills, cloud architecture, and live platforms, or connect you with him for new projects.";
  }

  if (q.includes('quien es jorge') || q.includes('about jorge') || q.includes('sobre jorge')) {
    return isEs
      ? 'Jorge Ismael Doicela Molina es un Ingeniero de Software Full Stack, AI Engineer y DevSecOps radicado en Quito, Ecuador. Es el creador de plataformas de alto rendimiento como La Biblia Modular, Software y Portafolio SSH, con una filosofía basada en la excelencia técnica y Colosenses 3:23.'
      : "Jorge Ismael Doicela Molina is a Full Stack Developer, AI Engineer, and DevSecOps specialist based in Quito, Ecuador. He is the creator of high-performance platforms including The Modular Bible, Software, and Portfolio SSH, driven by a philosophy of technical excellence and Colossians 3:23.";
  }

  if (q.includes('tecnolog') || q.includes('stack') || q.includes('skill') || q.includes('lenguaje')) {
    return isEs
      ? 'Jorge se especializa en:\n\n• **Frontend:** Next.js 16, React 19, TypeScript y Tailwind CSS v4.\n• **Backend:** NestJS 11, Node.js, C# / .NET y Laravel.\n• **Móvil:** Expo SDK y React Native.\n• **Cloud & DevOps:** Linux Debian 13 en AWS Lightsail (1 GB de RAM), Nginx mTLS, Cloudflare Edge y CI/CD en GitHub Actions.'
      : "Jorge specializes in:\n\n• **Frontend:** Next.js 16, React 19, TypeScript, and Tailwind CSS v4.\n• **Backend:** NestJS 11, Node.js, C# / .NET, and Laravel.\n• **Mobile:** Expo SDK and React Native.\n• **Cloud & DevOps:** Linux Debian 13 on AWS Lightsail (1 GB RAM), Nginx mTLS, Cloudflare Edge, and GitHub Actions CI/CD.";
  }

  if (q.includes('proyecto') || q.includes('plataforma') || q.includes('project')) {
    return isEs
      ? 'Jorge cuenta con 3 plataformas en producción:\n\n1. **La Biblia:** Estudio bíblico exegético con 9 motores morfológicos (`bible.jorgedoicela.com`).\n2. **Software:** Portal con 7 áreas de tecnología y ciberseguridad (`software.jorgedoicela.com`).\n3. **Portafolio:** Terminal interactiva SSH con WebSockets (`portfolio.jorgedoicela.com`).'
      : "Jorge has 3 live platforms in production:\n\n1. **The Bible:** Exegetical study platform with 9 morphological engines (`bible.jorgedoicela.com`).\n2. **Software:** Tech portal across 7 categories (`software.jorgedoicela.com`).\n3. **Portfolio:** Real-time interactive SSH terminal (`portfolio.jorgedoicela.com`).";
  }

  if (q.includes('cotiza') || q.includes('propuesta') || q.includes('contrat') || q.includes('precio') || q.includes('quote')) {
    return isEs
      ? 'Para solicitar una cotización o propuesta técnica de desarrollo web, móvil o arquitectura en la nube, puedes ir al [Formulario de Consulta](/consulta) o escribir directamente a jorge.doicela.m@gmail.com. Recibirás respuesta en menos de 24 horas.'
      : "To request a formal quote or technical proposal for web, mobile, or cloud development, visit the [Consultation Form](/consulta) or email directly at jorge.doicela.m@gmail.com. You will receive a response within 24 hours.";
  }

  return isEs
    ? `Como asistente oficial de Jorge Doicela, puedo ayudarte con cualquier consulta técnica sobre sus plataformas de software, arquitectura cloud en 1 GB de RAM, stack full stack o solicitudes de propuestas en el [Formulario de Consulta](/consulta). ¿En qué aspecto te gustaría profundizar?`
    : `As Jorge Doicela's official assistant, I can assist you with technical inquiries about his software platforms, 1 GB RAM cloud architecture, full stack development, or custom proposals at the [Consultation Form](/consulta). How can I help you?`;
}
