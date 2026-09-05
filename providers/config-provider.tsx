'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ConfigData } from '@/services/config/config.interface';

interface ConfigContextValue {
  config: ConfigData | null;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
  /** Config fetched server-side (e.g. in the locale layout) and passed down to seed the context. */
  initialConfig: ConfigData | null;
}

export function ConfigProvider({ children, initialConfig }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ config: initialConfig, isLoading: false }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}
