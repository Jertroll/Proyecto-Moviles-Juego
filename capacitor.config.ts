import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId:'com.company.proyecto',
  appName: 'Proyecto',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: true, 
    androidScheme: 'http', 
    
  },
};

export default config;
