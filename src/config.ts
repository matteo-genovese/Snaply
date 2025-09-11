// 🔧 CONFIGURAZIONE SNAPLY
// ========================
// Modifica questi valori per personalizzare la tua app

export const config = {
  // 🎨 PERSONALIZZAZIONE UI
  app: {
    title: "Il Mio Evento Snaply",
    subtitle: "Condividi foto e video! ✨", 
    primaryColor: "#5b0822", // Bordeaux elegante
  },

  // ☁️ CLOUDINARY - Storage per foto e video
  // 1. Registrati su https://cloudinary.com (gratis fino a 25GB)
  // 2. Dashboard → copia il "Cloud Name" 
  // 3. Settings → Upload → Upload Presets → Crea preset "Unsigned"
  cloudinary: {
    cloudName: "your_cloud_name_here",
    uploadPreset: "snaply_upload_preset",
  },

  // 📦 JSONBIN - Database per sincronizzazione (OPZIONALE)
  // 1. Registrati su https://jsonbin.io (opzionale)
  // 2. Crea bin con: {"media": []}
  // 3. Copia ID, Master Key, Access Key
  // NOTA: Se lasci vuoto, usa solo localStorage (funziona comunque!)
  jsonbin: {
    id: "", // Lascia vuoto per disabilitare
    masterKey: "",
    accessKey: "",
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
