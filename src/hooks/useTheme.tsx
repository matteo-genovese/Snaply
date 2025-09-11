import { useEffect } from 'react';
import { config } from '@/config';

export const useTheme = () => {
  useEffect(() => {
    // Ottieni il colore primario dalla configurazione
    const primaryColor = config.app.primaryColor;
    
    // Imposta la CSS custom property per il colore primario
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    
    // Crea varianti del colore per hover, opacity, etc.
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 91, g: 8, b: 34 };
    };

    const rgb = hexToRgb(primaryColor);
    
    // Imposta varianti del colore
    document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    document.documentElement.style.setProperty('--primary-hover', `rgb(${rgb.r * 0.9}, ${rgb.g * 0.9}, ${rgb.b * 0.9})`);
    document.documentElement.style.setProperty('--primary-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    document.documentElement.style.setProperty('--primary-medium', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
    
    console.log(`🎨 Tema caricato con colore primario: ${primaryColor}`);
  }, []);

  return {
    primaryColor: config.app.primaryColor
  };
};
