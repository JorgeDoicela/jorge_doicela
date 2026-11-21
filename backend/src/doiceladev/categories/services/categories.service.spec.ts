import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    mockQuery = jest.fn();
    const mockDataSource = {
      query: mockQuery,
    } as unknown as DataSource;
    service = new CategoriesService(mockDataSource);
  });

  describe('getAllCategories', () => {
    it('aggregates canonical category slugs across the 8 tables in parallel without hardcoded labels', async () => {
      mockQuery.mockImplementation((sql: string) => {
        if (sql.includes('infrastructure_posts')) {
          return Promise.resolve([{ category: 'servers', cnt: 2 }]);
        }
        if (sql.includes('tutorials')) {
          return Promise.resolve([
            { category: 'servers', cnt: 1 },
            { category: 'devops', cnt: 1 },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await service.getAllCategories({ lang: 'en' });

      expect(mockQuery).toHaveBeenCalledTimes(8);
      expect(result).toEqual([
        {
          slug: 'servers',
          label: 'servers',
          count: 3,
          modules: ['infrastructure', 'tutorials'],
        },
        {
          slug: 'devops',
          label: 'devops',
          count: 1,
          modules: ['tutorials'],
        },
      ]);
    });
  });

  describe('getArticlesByCategory', () => {
    it('throws NotFoundException when an unknown category slug has no articles', async () => {
      mockQuery.mockResolvedValue([]);

      await expect(
        service.getArticlesByCategory('categoria-inexistente', { lang: 'es' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('sanitizes markdown excerpts for forum topics and resolves category aliases', async () => {
      mockQuery.mockImplementation((sql: string) => {
        if (sql.includes('forum_topics')) {
          return Promise.resolve([
            {
              id: 1,
              slug: 'debate-arquitectura',
              category: 'architecture',
              title: 'Debate de Arquitectura',
              excerpt: '> [!NOTE]\n## Encabezado\nTexto **limpio** en `codigo`',
              createdAt: '2026-11-19T12:00:00.000Z',
              publishedAt: '2026-11-19T12:00:00.000Z',
            },
          ]);
        }
        return Promise.resolve([]);
      });

      const res = await service.getArticlesByCategory(
        'arquitectura-de-software',
        { lang: 'es' },
      );

      expect(res.category).toEqual({
        slug: 'architecture',
        label: 'architecture',
        totalCount: 1,
      });
      expect(res.articles[0].excerpt).toBe('Encabezado Texto limpio en');
      expect(res.articles[0].categoryMeta).toBe('forum • architecture');
    });
  });
});
