import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    mockQuery = jest.fn();
    const mockDataSource = {
      query: mockQuery,
    } as unknown as DataSource;
    service = new TagsService(mockDataSource);
  });

  describe('getAllTags', () => {
    it('queries localized per-language tag counts in a single UNION ALL query', async () => {
      mockQuery.mockResolvedValueOnce([
        { id: 1, slug: 'linux', label: 'linux', count: 3 },
        { id: 2, slug: 'docker', label: 'docker', count: 1 },
      ]);

      const result = await service.getAllTags({ lang: 'en' });

      expect(mockQuery).toHaveBeenCalledTimes(1);
      const [sql, params] = mockQuery.mock.calls[0] as [string, string[]];
      expect(sql).toContain('UNION ALL');
      expect(sql).toContain('INNER JOIN content_tags');
      expect(params).toHaveLength(8);
      expect(params.every((p) => p === 'en')).toBe(true);
      expect(result).toEqual([
        { id: 1, slug: 'linux', label: 'linux', count: 3 },
        { id: 2, slug: 'docker', label: 'docker', count: 1 },
      ]);
    });
  });

  describe('getArticlesByTag', () => {
    it('throws NotFoundException when tag slug does not exist', async () => {
      mockQuery.mockResolvedValueOnce([]);

      await expect(
        service.getArticlesByTag('etiqueta-inexistente', { lang: 'es' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('fetches linked articles in parallel and strips markdown from forum excerpts', async () => {
      mockQuery
        .mockResolvedValueOnce([{ id: 7, slug: 'ai', label: 'ai' }])
        .mockResolvedValueOnce([
          { content_type: 'forum', content_id: 2 },
          { content_type: 'ai', content_id: 1 },
        ])
        .mockImplementation((sql: string) => {
          if (sql.includes('forum_topics')) {
            return Promise.resolve([
              {
                id: 2,
                slug: 'debate-ia',
                category: 'ai',
                title: 'Debate IA',
                excerpt: '## Título\nContenido **enriquecido**',
                createdAt: '2026-11-19T10:00:00.000Z',
                publishedAt: '2026-11-19T10:00:00.000Z',
              },
            ]);
          }
          if (sql.includes('ai_resources')) {
            return Promise.resolve([
              {
                id: 1,
                slug: 'owasp-llm01',
                category: 'agent',
                title: 'OWASP LLM01',
                excerpt: 'Resumen limpio',
                createdAt: '2026-11-18T10:00:00.000Z',
                publishedAt: '2026-11-18T10:00:00.000Z',
              },
            ]);
          }
          return Promise.resolve([]);
        });

      const res = await service.getArticlesByTag('ai', { lang: 'es' });

      expect(res.tag).toEqual({ slug: 'ai', label: 'ai', totalCount: 2 });
      expect(res.articles).toHaveLength(2);
      expect(res.articles[0].id).toBe('forum-2');
      expect(res.articles[0].excerpt).toBe('Título Contenido enriquecido');
      expect(res.articles[1].id).toBe('ai-1');
    });
  });
});
