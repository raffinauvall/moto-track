import { View } from 'react-native';
import CircularWidget from './CircularStats';
import { Droplet, Zap, Wrench } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import { getPinnedComponents } from '@/api/motorComponent/getPinnedComponents';
import type { Motor, MotorComponent } from '@/types';

const COMPONENT_ICONS: Record<string, any> = {
  Oil: Droplet,
  Oli: Droplet,
  'Spark Plug': Zap,
  Busi: Zap,
};

export default function PinnedComponents({
  activeMotor,
  componentsState,
}: {
  activeMotor: Motor | null;
  componentsState: MotorComponent[];
}) {
  const [pinnedComponents, setPinnedComponents] = useState<MotorComponent[]>([]);

  const fetchPinnedComponents = useCallback(async () => {
    if (!activeMotor) {
      setPinnedComponents([]);
      return;
    }

    try {
      const data = await getPinnedComponents(activeMotor.id);
      setPinnedComponents(data);
    } catch (error) {
      console.error('Error fetching pinned components:', error);
    }
  }, [activeMotor]);

  useEffect(() => {
    fetchPinnedComponents();
  }, [fetchPinnedComponents]);

  if (!activeMotor || pinnedComponents.length === 0) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 15,
      }}>
      {pinnedComponents.map((comp) => {
        const liveComp = componentsState.find((c) => c.id === comp.id);

        const current = liveComp?.current_value ?? comp.current_value;

        const max = liveComp?.max_value ?? comp.max_value;

        /* 🔥 SAMA PERSIS KAYAK DETAIL */
        const ratio = 1 - current / max;

        const color = ratio >= 0.8 ? '#22C55E' : ratio >= 0.5 ? '#FACC15' : '#EF4444';

        const Icon = COMPONENT_ICONS[comp.name] || Wrench;

        return (
          <View
            key={comp.id}
            style={{
              width: '48%',
            }}>
            <CircularWidget
              current={current}
              max={max}
              label={comp.name}
              color={color}
              Icon={Icon}
            />
          </View>
        );
      })}
    </View>
  );
}
