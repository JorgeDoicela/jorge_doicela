import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface CategoryCountOption {
  id: string;
  label: string;
  count: number;
}

export async function aggregateModuleCategories<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  lang: string = 'es',
  categoryOrder: readonly string[] = [],
): Promise<CategoryCountOption[]> {
  if (lang) {
    qb.andWhere(`${alias}.language = :lang`, { lang });
  }

  const rawRows = await qb
    .select(`${alias}.category`, 'category')
    .addSelect('COUNT(*)', 'count')
    .groupBy(`${alias}.category`)
    .getRawMany<{ category: string | null; count: string | number }>();

  const countMap = new Map<string, number>();
  let total = 0;

  for (const row of rawRows) {
    const cnt = Number(row.count) || 0;
    total += cnt;
    if (row.category) {
      const normalized = row.category.trim().toLowerCase();
      if (normalized && normalized !== 'all') {
        countMap.set(normalized, (countMap.get(normalized) || 0) + cnt);
      }
    }
  }

  const result: CategoryCountOption[] = [
    { id: 'all', label: 'all', count: total },
  ];

  for (const cat of categoryOrder) {
    const count = countMap.get(cat) || 0;
    if (count > 0) {
      result.push({ id: cat, label: cat, count });
    }
  }

  for (const [cat, count] of countMap.entries()) {
    if (!result.some((r) => r.id === cat)) {
      result.push({ id: cat, label: cat, count });
    }
  }

  return result;
}
