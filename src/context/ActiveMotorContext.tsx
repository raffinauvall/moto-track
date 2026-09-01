import React, { createContext, useState, useContext, useCallback } from "react";
import { getActiveMotor } from "@/api/motor/getActiveMotor";
import type { Motor } from "@/types";

type ActiveMotorContextType = {
  activeMotor: Motor | null;
  setActiveMotorState: (motor: Motor) => void;
  refreshActiveMotor: () => Promise<void>;
};

const ActiveMotorContext = createContext<ActiveMotorContextType>({
  activeMotor: null,
  setActiveMotorState: () => {},
  refreshActiveMotor: async () => {},
});

export const ActiveMotorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeMotor, setActiveMotorState] = useState<Motor | null>(null);

  const refreshActiveMotor = useCallback(async () => {
    try {
      const motor = await getActiveMotor();
      setActiveMotorState(motor);
    } catch {
      setActiveMotorState(null);
    }
  }, []);

  React.useEffect(() => {
    refreshActiveMotor();
  }, [refreshActiveMotor]);

  return (
    <ActiveMotorContext.Provider
      value={{ activeMotor, setActiveMotorState, refreshActiveMotor }}
    >
      {children}
    </ActiveMotorContext.Provider>
  );
};

export const useActiveMotor = () => useContext(ActiveMotorContext);
