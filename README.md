# 📸 Snaply

Una semplice web app per caricare e visualizzare foto e video di eventi. **Deploy facile senza backend da gestire!**

## ✨ Caratteristiche

- 📤 Upload drag & drop di foto e video (fino a 100MB)
- ☁️ Storage sicuro su Cloudinary
- 📱 Design responsive mobile-first
- 📊 QR code per condivisione istantanea
- 🎨 Colori e testi personalizzabili
- ⚡ **Zero backend da gestire**
- 🔄 **Sincronizzazione multi-device opzionale**

## 🚀 Setup Semplificato

### 1. Clona e Installa
```bash
git clone https://github.com/matteo-genovese/Snaply
cd snaply
npm install
```

### 2. Setup Cloudinary (UNICO PASSO RICHIESTO)
1. Registrati su [cloudinary.com](https://cloudinary.com)
2. Dashboard → copia **Cloud Name**
3. Settings → Upload → Upload Presets → Create preset:
   - Nome: `snaply-upload` (o personalizzato)
   - Mode: **Unsigned**
   - Folder: `event-media`

### 3. Setup JSONBin (OPZIONALE per sincronizzazione multi-device)
1. **Opzionale**: Registrati su [jsonbin.io](https://jsonbin.io)
2. Create Bin → inserisci: `{"media": []}`
3. API Keys → copia **Master Key** e **Access Key**
4. Copia l'ID del bin dall'URL

**Nota**: Senza JSONBin, l'app funziona perfettamente con solo localStorage!

### 4. Configura l'App
Modifica il file `src/config.ts` con le tue impostazioni:

```typescript
export const config = {
  // 🎨 Personalizzazione
  app: {
    title: "Il Mio Evento",
    subtitle: "Condividi foto e video! ✨", 
    primaryColor: "#dc2626", // Cambia colore qui!
  },

  // ☁️ Cloudinary (obbligatorio)
  cloudinary: {
    cloudName: "your_cloud_name_here",
    uploadPreset: "your_upload_preset_here",
  },

  // 📦 JSONBin (opzionale - lascia vuoto per disabilitare)
  jsonbin: {
    id: "", // Opzionale
    masterKey: "",
    accessKey: "",
  },
};
```

### 5. Test Locale
```bash
npm run dev
```
Apri [localhost:8080](http://localhost:8080)

## 🚀 Deploy (ZERO Configurazione!)

Il progetto è progettato per essere deployato senza alcuna configurazione aggiuntiva. Tutte le impostazioni sono nel file `src/config.ts`.

### 📦 Deploy su Vercel

1. **Installa Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login e Deploy**:
```bash
vercel login
vercel --prod
```

3. **Fatto!** Il tuo sito è online in pochi secondi.

### 📦 Deploy su Cloudflare Pages

1. **Connetti Repository**:
   - Vai su [Cloudflare Pages](https://pages.cloudflare.com/)
   - "Connect to Git" → Seleziona il tuo repository

2. **Configurazioni Build**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

3. **Deploy**: Clicca "Save and Deploy"

### 📦 Deploy su Netlify

1. **Connetti Repository**:
   - Vai su [Netlify](https://netlify.com)
   - "New site from Git" → Seleziona repository

2. **Configurazioni Build**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Deploy**: Clicca "Deploy site"

### ⚡ Deploy Automatico

Una volta configurato, ogni push al branch `main` triggerà automaticamente un nuovo deploy!

### 🎯 Deploy da GitHub (Raccomandato)

1. **Push su GitHub**:
```bash
git add .
git commit -m "feat: personalizza per il mio evento"
git push origin main
```

2. **Connetti Repository** su una delle piattaforme:
   - [Vercel](https://vercel.com) - Deploy istantaneo
   - [Cloudflare Pages](https://pages.cloudflare.com) - CDN globale
   - [Netlify](https://netlify.com) - Facile da usare

3. **Configura Build** (se richiesto):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Deploy** - Il sito sarà online in 1-2 minuti!

### 📱 URL Personalizzato

Dopo il deploy, avrai un URL tipo:
- `https://il-tuo-progetto.vercel.app`
- `https://il-tuo-progetto.pages.dev`
- `https://il-tuo-progetto.netlify.app`

Condividi questo URL con i tuoi invitati per caricare foto e video!

**✅ Zero configurazione richiesta!** Tutto è hardcoded nel file `src/config.ts`


## 🛠️ Tecnologie

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/ui
- **Storage**: Cloudinary
- **Database**: localStorage (o JSONBin opzionale)
- **Deploy**: Vercel / Cloudflare Pages

## 🎨 Personalizzazione

Personalizzare Snaply è semplicissimo! Basta modificare il file `src/config.ts`.

### 🚀 Personalizzazione Rapida

#### 1. Cambia Colore e Titoli
```typescript
// src/config.ts
export const config = {
  app: {
    title: "Il Mio Evento 🎉",
    subtitle: "Condividi i momenti speciali!", 
    primaryColor: "#dc2626", // Rosso
  },
  // ... resto della configurazione
};
```

#### 2. Usa Eventi Predefiniti
```typescript
// src/config.ts
import { eventExamples } from './config';

// Copia un evento predefinito
export const config = {
  app: eventExamples.wedding, // Matrimonio
  // oppure
  app: eventExamples.birthday, // Compleanno
  // ... resto della configurazione
};
```

### 🎨 Colori Disponibili

```typescript
export const presetColors = {
  bordeaux: "#5b0822",   // Elegante (default)
  red: "#dc2626",        // Passione  
  blue: "#1e40af",       // Professionale
  green: "#059669",      // Natura
  purple: "#7c3aed",     // Moderno
  orange: "#ea580c",     // Caldo
  pink: "#be185d",       // Intenso
};
```

### 📋 Eventi Predefiniti

#### 💍 Matrimonio
```typescript
app: {
  title: "Martina & Marco Wedding",
  subtitle: "I nostri momenti speciali! 💍",
  primaryColor: "#dc2626", // Rosso
}
```

#### 🎂 Compleanno
```typescript
app: {
  title: "I miei 30 Anni 🎂", 
  subtitle: "Festa da ricordare! 🎉",
  primaryColor: "#ea580c", // Arancione
}
```

#### 🎓 Laurea
```typescript
app: {
  title: "Laurea di Nicola 🎓",
  subtitle: "Celebriamo insieme! 🥳", 
  primaryColor: "#1e40af", // Blu
}
```

#### 🏖️ Vacanza
```typescript
app: {
  title: "Estate 2025 ☀️",
  subtitle: "I ricordi più belli! 📸",
  primaryColor: "#0891b2", // Azzurro
}
```

### ⚙️ Configurazione Avanzata

#### Disabilita JSONBin (solo localStorage)
```typescript
jsonbin: {
  id: "",        // Lascia vuoto
  masterKey: "", // per disabilitare
  accessKey: "", // la sincronizzazione
}
```

#### Configura Cloudinary
```typescript
cloudinary: {
  cloudName: "il_tuo_cloud_name",
  uploadPreset: "il_tuo_preset_unsigned",
}
```

### 🔄 Applica le Modifiche

1. **Modifica** `src/config.ts`
2. **Riavvia** il server: `npm run dev`
3. **Deploy** - nessuna configurazione aggiuntiva richiesta!

### 🎯 Tips per la Personalizzazione

- **Emoji nei titoli** rendono l'app più accattivante
- **Colori coerenti** con il tema dell'evento
- **Sottotitoli chiari** spiegano cosa fare agli utenti
- **Testa sempre** in locale prima del deploy

## 🔧 Troubleshooting

### Problemi Comuni

**❌ Upload non funziona**
- Verifica che l'Upload Preset su Cloudinary sia configurato come "Unsigned"
- Controlla `cloudName` e `uploadPreset` in `src/config.ts`

**❌ Colori non cambiano**
- Riavvia il server: `npm run dev` dopo modifiche a `src/config.ts`
- Verifica che il colore sia in formato hex: `#dc2626`

**❌ JSONBin non sincronizza**
- Controlla le credenziali in `src/config.ts`
- Se vuoi solo localStorage, lascia vuoti i campi JSONBin

**❌ Deploy fallisce**
- Verifica che `npm run build` funzioni in locale
- Controlla i log di build sulla piattaforma di deploy


## 🤝 Contribuire

1. Fork il progetto
2. Crea feature branch (`git checkout -b feature/nome`)
3. Commit (`git commit -m 'Add: nuova feature'`)
4. Push (`git push origin feature/nome`)
5. Apri Pull Request

## 📄 Licenza

MIT License - vedi [LICENSE](LICENSE)

---

⭐ **Se ti piace il progetto, lascia una stella!** ⭐
