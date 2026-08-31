import { NextRequest, NextResponse } from 'next/server';

// Dossier del Sistema de Información sobre Jorge Doicela para el Asistente de IA
const SYSTEM_PROMPT = `
Eres el Asistente de Inteligencia Artificial oficial de Jorge Doicela (Jorge Ismael Doicela Molina).
Tu misión es representar a Jorge de forma profesional, cordial, honesta y técnicamente precisa ante los visitantes de su sitio web.

INFORMACIÓN SOBRE JORGE DOICELA:
• Ubicación: Quito, Ecuador.
• Perfil Profesional: Full Stack Developer, AI Engineer y DevSecOps.
• Especialidades Técnicas:
  - Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Feature-Sliced Design (FSD).
  - Backend: NestJS 11, Node.js, C# / .NET Core, Laravel, Arquitectura Limpia de 3 Capas.
  - Móvil: Expo SDK, React Native (iOS y Android).
  - Cloud, Infraestructura & 1 GB RAM: Servidor VPS Debian 13 en AWS Lightsail optimizado para correr 4 plataformas consolidadas en 1 GB de RAM sin caídas, Nginx mTLS, Cloudflare Edge WAF, PM2 y pipelines CI/CD con GitHub Actions.
  - Bases de Datos: SQLite WAL (ultra-rápido y atómico), PostgreSQL, TypeORM.
• Plataformas Propias en Producción:
  1. La Biblia (bible.jorgedoicela.com): Plataforma con 9 motores de estudio bíblico exegético, análisis morfológico palabra por palabra en hebreo (BHS) y griego (NA28), códigos Strong, atlas geoespacial WGS84 y app móvil offline en Expo.
  2. Software (software.jorgedoicela.com): Plataforma de divulgación técnica con 7 categorías (noticias, blog de arquitectura, directorio de IA, avisos de ciberseguridad CVE con remediación, tutoriales paso a paso y foros).
  3. Portafolio (portfolio.jorgedoicela.com): Portafolio profesional con emulador de terminal SSH interactivo virtual en tiempo real sobre WebSockets (Socket.io).
• Contacto y Cotizaciones:
  - Correo: jorge.doicela.m@gmail.com
  - Formulario de Propuestas Técnicas: /consulta (Jorge responde en menos de 24 horas con estimación técnica y presupuesto).
  - Redes: GitHub (github.com/JorgeDoicela), LinkedIn (linkedin.com/in/jorgedoicela), TikTok (@jorge.doicela).
• Filosofía y Principios:
  - Software con propósito y excelencia: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres" (Colosenses 3:23).
  - Cero deuda técnica deliberada y honestidad técnica.

INSTRUCCIONES DE RESPUESTA:
1. Responde siempre en el idioma en que te hable el usuario (Español o Inglés).
2. Sé conciso, claro, educado y profesional. Evita respuestas excesivamente largas a menos que se te pida detalle técnico.
3. Si el usuario pregunta cómo contratar a Jorge, pedir una cotización o desarrollar un software, sugiérele amablemente ingresar a la sección de consulta (/consulta) o escribir a su correo jorge.doicela.m@gmail.com.
4. Si te preguntan sobre temas fuera del ámbito de Jorge Doicela, su tecnología o proyectos, responde amablemente y reorienta la conversación hacia la experiencia de Jorge.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 });
    }

    const { message, language = 'es', history = [] } = body;

    // Validación estricta en Servidor (Máx 500 caracteres, tipo string no vacío)
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
    }

    const sanitizedMessage = message.trim().slice(0, 500); // Límite seguro contra prompt injection masivo
    const isEs = language === 'es';
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. INTENTO CON GOOGLE GEMINI API (gemini-1.5-flash / gemini-2.0-flash)
    if (geminiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        
        const contents = [
          ...history.map((h: { sender: string; text: string }) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: String(h.text || '').slice(0, 500) }]
          })),
          {
            role: 'user',
            parts: [{ text: sanitizedMessage }]
          }
        ];

        const payload = {
          system_instruction: {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n[Idioma preferido del visitante: ${isEs ? 'Español' : 'Inglés'}]`
              }
            ]
          },
          contents,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 600,
          }
        };

        const res = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText.trim(), provider: 'gemini' });
          }
        }
      } catch (err) {
        console.error('Error llamando a Gemini API:', err);
      }
    }

    // 2. INTENTO CON GROQ API (llama-3.3-70b-versatile)
    if (groqKey) {
      try {
        const groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';

        const messagesPayload = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.map((h: { sender: string; text: string }) => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: String(h.text || '').slice(0, 500)
          })),
          { role: 'user', content: sanitizedMessage }
        ];

        const res = await fetch(groqEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messagesPayload,
            temperature: 0.5,
            max_tokens: 600,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data?.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({ reply: replyText.trim(), provider: 'groq' });
          }
        }
      } catch (err) {
        console.error('Error llamando a Groq API:', err);
      }
    }

    // 3. FALLBACK INTELIGENTE LOCAL (Si no hay API key configurada o falla la cuota externa)
    const fallbackReply = generateFallbackResponse(sanitizedMessage, isEs);
    return NextResponse.json({ 
      reply: fallbackReply, 
      provider: 'fallback',
      note: 'Configura GEMINI_API_KEY o GROQ_API_KEY en .env.local para respuestas en vivo de IA generativa.' 
    });

  } catch (error) {
    console.error('Error en Route Handler de Chat:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud del asistente' },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(userQuery: string, isEs: boolean): string {
  const q = userQuery.toLowerCase().trim();

  // Saludos y presentación
  if (['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'que tal', 'hi', 'hello', 'hey'].some(s => q === s || q.startsWith(s + ' '))) {
    return isEs
      ? '¡Hola! 👋 Es un gusto saludarte. Soy el asistente de IA de Jorge Doicela. ¿En qué te puedo ayudar hoy? Puedes preguntarme sobre sus plataformas en producción (La Biblia, Software, Portafolio), su experiencia Full Stack / Cloud en 1 GB de RAM, o solicitar una propuesta técnica.'
      : "Hello! 👋 Nice to meet you. I am Jorge Doicela's AI assistant. How can I help you today? Feel free to ask about his live platforms (The Bible, Software, Portfolio), his Full Stack / 1 GB RAM Cloud experience, or requesting a technical proposal.";
  }

  if (q.includes('quien eres') || q.includes('who are you') || q.includes('que eres')) {
    return isEs
      ? 'Soy el Asistente Virtual Oficial de Jorge Doicela. Estoy aquí para responder preguntas sobre sus habilidades de ingeniería de software, arquitectura cloud y plataformas en producción, o conectarte con él para nuevos proyectos.'
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
      ? 'Para solicitar una cotización o propuesta técnica de desarrollo web, móvil o arquitectura en la nube, puedes ir al formulario de consulta (/consulta) o escribir directamente a jorge.doicela.m@gmail.com. Recibirás respuesta en menos de 24 horas.'
      : "To request a formal quote or technical proposal for web, mobile, or cloud development, visit the consultation section (/consulta) or email directly at jorge.doicela.m@gmail.com. You will receive a response within 24 hours.";
  }

  return isEs
    ? `Gracias por tu pregunta sobre "${userQuery}". Jorge Doicela está disponible para proyectos de desarrollo Full Stack, Inteligencia Artificial y optimización de arquitectura cloud. Puedes contactarlo directamente en jorge.doicela.m@gmail.com o solicitar una propuesta en /consulta.`
    : `Thank you for asking about "${userQuery}". Jorge Doicela is open for Full Stack development, AI Engineering, and cloud architecture projects. You can contact him at jorge.doicela.m@gmail.com or submit a request at /consulta.`;
}
