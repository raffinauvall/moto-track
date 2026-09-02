import type { MotorComponent } from '@/types';

export const calculateHealth = (components: MotorComponent[]) => {
  if (!components?.length) return 100;

  const ratios = components.map((c) => Math.max(0, 1 - c.current_value / c.max_value));

  return Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100);
};

export const getStatus = (health: number) => {
  if (health >= 80) return { label: 'GOOD', color: '#22C55E', note: 'Ready for daily use' };
  if (health >= 50) return { label: 'WARNING', color: '#FACC15', note: 'Maintenance soon' };
  return { label: 'SERVICE', color: '#EF4444', note: 'Service now' };
};
