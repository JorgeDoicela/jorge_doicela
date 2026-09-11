'use client';

import { useMemo } from 'react';
import { MonarchData, ProphetData, WorldEmpireData, ArchaeologicalMilestone } from '../types';

export function useSyncFilter(
  targetYearBC: number | null,
  monarchs: MonarchData[] = [],
  prophets: ProphetData[] = [],
  empires: WorldEmpireData[] = [],
  milestones: ArchaeologicalMilestone[] = [],
) {
  const syncData = useMemo(() => {
    if (targetYearBC === null) {
      return {
        year: null,
        judahMonarchs: [] as MonarchData[],
        israelMonarchs: [] as MonarchData[],
        activeProphets: [] as ProphetData[],
        activeEmpires: [] as WorldEmpireData[],
        nearbyMilestones: [] as ArchaeologicalMilestone[],
      };
    }

    const year = targetYearBC;

    // Reyes de Judá o Monarquía Unida activos en este año
    const judahMonarchs = monarchs.filter(
      (m) =>
        (m.kingdom === 'judah' || m.kingdom === 'united') &&
        year <= m.startYearBC &&
        year >= m.endYearBC,
    );

    // Reyes de Israel activos en este año
    const israelMonarchs = monarchs.filter(
      (m) => m.kingdom === 'israel' && year <= m.startYearBC && year >= m.endYearBC,
    );

    // Profetas con ministerio activo en este año
    const activeProphets = prophets.filter(
      (p) => year <= p.startYearBC && year >= p.endYearBC,
    );

    // Imperios gobernando en este año
    const activeEmpires = empires.filter(
      (e) => year <= e.startYearBC && year >= e.endYearBC,
    );

    // Hitos arqueológicos dentro de una ventana de ±15 años
    const nearbyMilestones = milestones.filter(
      (m) => Math.abs(m.yearBC - year) <= 15,
    );

    return {
      year,
      judahMonarchs,
      israelMonarchs,
      activeProphets,
      activeEmpires,
      nearbyMilestones,
    };
  }, [targetYearBC, monarchs, prophets, empires, milestones]);

  return syncData;
}

