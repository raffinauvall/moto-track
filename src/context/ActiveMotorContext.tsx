import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";

type Motor = any;

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

export const ActiveMotorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMotor, setActiveMotorState] = useState<Motor | null>(null);

  const refreshActiveMotor = async () => {
    try {
      const { data } = await supabase
        .from("motors")
        .select("*")
        .eq("is_active", true)
        .single();
      setActiveMotorState(data || null);
    } catch {
      setActiveMotorState(null);
    }
  };

  useEffect(() => {
    refreshActiveMotor();
  }, []);

  return (
    <ActiveMotorContext.Provider value={{ activeMotor, setActiveMotorState, refreshActiveMotor }}>
      {children}
    </ActiveMotorContext.Provider>
  );
};

export const useActiveMotor = () => useContext(ActiveMotorContext);
