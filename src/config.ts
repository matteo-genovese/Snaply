// 🔧 CONFIGURAZIONE SNAPLY
// ========================
// Configurazione basata su variabili d'ambiente
// Copia .env.example come .env e personalizza i valori

export const config = {
  // 🎨 PERSONALIZZAZIONE UI
  app: {
    title: import.meta.env.VITE_APP_TITLE || "Il Mio Evento Snaply",
    subtitle: import.meta.env.VITE_APP_SUBTITLE || "Condividi foto e video! ✨", 
    primaryColor: import.meta.env.VITE_APP_PRIMARY_COLOR || "#1e40af",
  },

  // ☁️ CLOUDINARY - Storage per foto e video
  // Configura le variabili VITE_CLOUDINARY_* nel file .env
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
  },

  // 📦 JSONBIN - Database per sincronizzazione (OPZIONALE)
  // Configura le variabili VITE_JSONBIN_* nel file .env
  // NOTA: Se lasci vuoto, usa solo localStorage (funziona comunque!)
  jsonbin: {
    id: import.meta.env.VITE_JSONBIN_ID || "",
    masterKey: import.meta.env.VITE_JSONBIN_MASTER_KEY || "",
    accessKey: import.meta.env.VITE_JSONBIN_ACCESS_KEY || "",
  },
} as const;

// 🎨 COLORI PREDEFINITI (esempi)
export const presetColors = {
  bordeaux: "#5b0822",   // Default elegante
  red: "#dc2626",        // Rosso passione  
  blue: "#1e40af",       // Blu professionale
  green: "#059669",      // Verde natura
  purple: "#7c3aed",     // Viola moderno
  orange: "#ea580c",     // Arancione caldo
  pink: "#be185d",       // Rosa intenso
} as const;

// 📋 ESEMPI DI CONFIGURAZIONE PER EVENTI
export const eventExamples = {
  wedding: {
    title: "Martina & Marco Wedding",
    subtitle: "I nostri momenti speciali! 💍",
    primaryColor: presetColors.red,
  },
  birthday: {
    title: "I miei 30 Anni 🎂", 
    subtitle: "Festa da ricordare! 🎉",
    primaryColor: presetColors.orange,
  },
  graduation: {
    title: "Laurea di Nicola 🎓",
    subtitle: "Celebriamo insieme! 🥳", 
    primaryColor: presetColors.blue,
  },
  vacation: {
    title: "Estate 2025 ☀️",
    subtitle: "I ricordi più belli! 📸",
    primaryColor: presetColors.blue,
  },
} as const;
