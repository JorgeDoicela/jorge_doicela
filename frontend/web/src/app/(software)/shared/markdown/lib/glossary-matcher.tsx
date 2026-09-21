import React from 'react';
import type { GlossaryTerm } from '../../../entities/glossary/types';
import { GlossaryTermPopover } from '../components/GlossaryTermPopover';

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface TermMatcher {
  regex: RegExp;
  termData: GlossaryTerm;
}

/**
 * Precompila los matchers para cada término y sus alias
 */
export function buildGlossaryMatchers(terms: GlossaryTerm[]): TermMatcher[] {
  const matchers: TermMatcher[] = [];

  for (const item of terms) {
    const candidateWords = [
      item.term,
      ...(item.aliases
        ? item.aliases
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean)
        : []),
    ];

    for (const word of candidateWords) {
      if (!word) continue;
      const flags = item.caseSensitive ? 'g' : 'gi';
      // Límites de palabra \b para evitar coincidencias parciales
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, flags);
      matchers.push({ regex, termData: item });
    }
  }

  return matchers;
}

/**
 * Enriquece recursivamente los nodos de texto de React respetando la regla de primera mención
 */
export function enrichWithGlossary(
  node: React.ReactNode,
  matchers: TermMatcher[],
  seenSlugs: Set<string>,
): React.ReactNode {
  if (!matchers.length) return node;

  if (typeof node === 'string') {
    return enrichPlainText(node, matchers, seenSlugs);
  }

  if (Array.isArray(node)) {
    return React.Children.map(node, (child) =>
      enrichWithGlossary(child, matchers, seenSlugs),
    );
  }

  if (React.isValidElement(node)) {
    // Proteger elementos que ya son interactivos o de código
    const elementType = node.type;
    if (
      elementType === 'a' ||
      elementType === 'code' ||
      elementType === 'pre' ||
      elementType === 'button'
    ) {
      return node;
    }

    // Para elementos de formato (strong, em, span, etc.), enriquecer sus hijos
    const props = node.props as { children?: React.ReactNode };
    if (props && props.children) {
      return React.cloneElement(
        node,
        undefined,
        enrichWithGlossary(props.children, matchers, seenSlugs),
      );
    }
  }

  return node;
}

function enrichPlainText(
  text: string,
  matchers: TermMatcher[],
  seenSlugs: Set<string>,
): React.ReactNode {
  if (!text || !text.trim()) return text;

  // Buscar la primera coincidencia en el texto que aún no haya sido "vista" (regla de primera mención)
  let earliestMatch: {
    index: number;
    length: number;
    matchedText: string;
    termData: GlossaryTerm;
  } | null = null;

  for (const { regex, termData } of matchers) {
    if (seenSlugs.has(termData.slug)) continue;

    regex.lastIndex = 0;
    const match = regex.exec(text);
    if (match) {
      if (earliestMatch === null || match.index < earliestMatch.index) {
        earliestMatch = {
          index: match.index,
          length: match[0].length,
          matchedText: match[0],
          termData,
        };
      }
    }
  }

  if (!earliestMatch) {
    return text;
  }

  // Registrar como visto para que nunca se vuelva a marcar en este artículo
  seenSlugs.add(earliestMatch.termData.slug);

  const before = text.slice(0, earliestMatch.index);
  const matched = text.slice(
    earliestMatch.index,
    earliestMatch.index + earliestMatch.length,
  );
  const after = text.slice(earliestMatch.index + earliestMatch.length);

  const element = (
    <GlossaryTermPopover
      key={`glossary-${earliestMatch.termData.slug}-${earliestMatch.index}`}
      displayText={matched}
      termData={earliestMatch.termData}
    />
  );

  return [
    before,
    element,
    // Continuar procesando el resto del texto para encontrar otros términos distintos
    enrichPlainText(after, matchers, seenSlugs),
  ];
}

/**
 * Comprueba si un texto de InlineCode coincide con un término del glosario que no se haya visto aún
 */
export function matchInlineCodeGlossary(
  code: string,
  matchers: TermMatcher[],
  seenSlugs: Set<string>,
): GlossaryTerm | null {
  const trimmed = code.trim();
  if (!trimmed) return null;

  for (const { regex, termData } of matchers) {
    if (seenSlugs.has(termData.slug)) continue;

    regex.lastIndex = 0;
    const match = regex.exec(trimmed);
    if (match && match[0] === trimmed) {
      seenSlugs.add(termData.slug);
      return termData;
    }
  }

  return null;
}

/**
 * Plugin de Remark que enriquece el AST de Markdown con los términos del glosario.
 * Ejecuta el recorrido del árbol MDAST una sola vez de forma determinista y estática,
 * eliminando cualquier mutación impura durante el render de React y garantizando
 * paridad absoluta 1:1 entre el HTML del servidor (SSR) y la hidratación del cliente.
 */
export function createRemarkGlossary(terms: GlossaryTerm[]) {
  return () => {
    return (tree: any) => {
      if (!terms || terms.length === 0) return;

      const matchers = buildGlossaryMatchers(terms);
      const seenSlugs = new Set<string>();

      function walk(node: any, parent: any, index: number): number | void {
        if (!node) return;

        // Proteger encabezados, bloques de código cercados, enlaces y HTML crudo
        if (
          node.type === 'heading' ||
          node.type === 'code' ||
          node.type === 'link' ||
          node.type === 'html'
        ) {
          return;
        }

        // Inspeccionar código inline (ej. `ufw`)
        if (node.type === 'inlineCode') {
          const trimmed = (node.value || '').trim();
          for (const { regex, termData } of matchers) {
            if (seenSlugs.has(termData.slug)) continue;
            regex.lastIndex = 0;
            const match = regex.exec(trimmed);
            if (match && match[0] === trimmed) {
              seenSlugs.add(termData.slug);
              node.data = {
                hName: 'span',
                hProperties: {
                  className: 'glossary-term-match',
                  'data-glossary-slug': termData.slug,
                  'data-glossary-text': trimmed,
                  'data-glossary-code': 'true',
                },
              };
              return;
            }
          }
          return;
        }

        // Inspeccionar nodos de texto plano
        if (node.type === 'text' && typeof node.value === 'string' && parent && Array.isArray(parent.children)) {
          let text = node.value;
          const newNodes: any[] = [];

          while (text.length > 0) {
            let earliestMatch: {
              index: number;
              length: number;
              matchedText: string;
              termData: GlossaryTerm;
            } | null = null;

            for (const { regex, termData } of matchers) {
              if (seenSlugs.has(termData.slug)) continue;
              regex.lastIndex = 0;
              const match = regex.exec(text);
              if (match) {
                if (!earliestMatch || match.index < earliestMatch.index) {
                  earliestMatch = {
                    index: match.index,
                    length: match[0].length,
                    matchedText: match[0],
                    termData,
                  };
                }
              }
            }

            if (!earliestMatch) {
              newNodes.push({ type: 'text', value: text });
              break;
            }

            seenSlugs.add(earliestMatch.termData.slug);

            if (earliestMatch.index > 0) {
              newNodes.push({
                type: 'text',
                value: text.slice(0, earliestMatch.index),
              });
            }

            newNodes.push({
              type: 'glossaryTerm',
              data: {
                hName: 'span',
                hProperties: {
                  className: 'glossary-term-match',
                  'data-glossary-slug': earliestMatch.termData.slug,
                  'data-glossary-text': earliestMatch.matchedText,
                },
              },
              children: [{ type: 'text', value: earliestMatch.matchedText }],
            });

            text = text.slice(earliestMatch.index + earliestMatch.length);
          }

          parent.children.splice(index, 1, ...newNodes);
          return index + newNodes.length;
        }

        if (node.children && Array.isArray(node.children)) {
          for (let i = 0; i < node.children.length; i++) {
            const nextIndex = walk(node.children[i], node, i);
            if (typeof nextIndex === 'number') {
              i = nextIndex - 1;
            }
          }
        }
      }

      walk(tree, null, 0);
    };
  };
}
