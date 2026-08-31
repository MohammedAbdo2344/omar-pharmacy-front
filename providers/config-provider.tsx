'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ConfigService } from '@/services/config/config.service';
import type { ConfigData } from '@/services/config/config.interface';
import { getGuestTokenClient } from '@/lib/guest-session';
import BrandLoader from '@/components/shared/brand-loader';

interface ConfigContextValue {
  config: ConfigData | null;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      const token = getGuestTokenClient();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const configData = await ConfigService.getConfig(token);
        setConfig(configData);
      } catch {
        // Handle errors silently
      } finally {
        setIsLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, isLoading }}>
      {isLoading ? <BrandLoader /> : children}
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