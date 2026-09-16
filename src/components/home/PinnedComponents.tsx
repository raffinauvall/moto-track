import { View, Text } from 'react-native';
import { Droplet, Zap, Wrench } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!activeMotor) return;

    getPinnedComponents(activeMotor.id)
      .then(setPinnedComponents)
      .catch((error) => console.error('Error fetching pinned components:', error));
  }, [activeMotor]);

  if (!activeMotor || pinnedComponents.length === 0) return null;

  return (
    <View className="mb-5 rounded-2xl border border-[#1F3354] bg-[#0D1728] p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-maisonBold text-sm text-white">Maintenance</Text>
        <Text className="font-maison text-xs text-slate-500">Pinned</Text>
      </View>

      {pinnedComponents.map((comp, index) => {
        const liveComp = componentsState.find((c) => c.id === comp.id);

        const current = liveComp?.current_value ?? comp.current_value;

        const max = liveComp?.max_value ?? comp.max_value;

        const ratio = max > 0 ? Math.max(0, Math.min(1, 1 - current / max)) : 1;
        const color = ratio >= 0.8 ? '#22C55E' : ratio >= 0.5 ? '#FACC15' : '#EF4444';

        const Icon = COMPONENT_ICONS[comp.name] || Wrench;

        return (
          <View key={comp.id} className={index > 0 ? 'mt-4 border-t border-[#1F3354] pt-4' : ''}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <View
                  className="h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}18` }}>
                  <Icon color={color} size={16} />
                </View>
                <Text className="font-maisonBold text-sm text-slate-200">{comp.name}</Text>
              </View>
              <Text className="font-maisonBold text-sm" style={{ color }}>
                {Math.round(ratio * 100)}%
              </Text>
            </View>
            <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#0A1929]">
              <View
                style={{ width: `${ratio * 100}%`, backgroundColor: color }}
                className="h-full rounded-full"
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
