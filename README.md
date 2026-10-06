# 📸 Snaply

Una semplice web app per caricare e visualizzare foto e video di eventi. **Deploy facile senza backend da gestire!**

## 🌟 Demo Live

Prova Snaply in azione: **[demo-snaply.vercel.app](https://demo-snaply.vercel.app)**
>
> **English** — Snaply is a drop-in photo & video gallery for events. Guests upload from their
> phone (drag & drop, up to 100 MB) straight to Cloudinary through an unsigned upload preset, and
> every device sees the same album via QR code — **no backend to run**. Stack: React + TypeScript +
> Vite, Tailwind CSS and shadcn/ui; optional cross-device sync through a server-side JSONBin key;
> deploys on Vercel, Cloudflare Pages or Netlify. Live demo:
> **[demo-snaply.vercel.app](https://demo-snaply.vercel.app)** — setup and configuration notes
> below are in Italian.


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

#### 2.1 Registrazione e Setup Iniziale
1. **Registrati** su [cloudinary.com](https://cloudinary.com)
2. **Dashboard** → copia il **Cloud Name** (lo trovi in alto a sinistra)

#### 2.2 Crea la Cartella per i Media
1. Vai su **Media Library** (nel menu laterale sinistra)
2. Clicca su **"Create Folder"** (pulsante blu) o l'icona cartella ➕
3. Nomina la cartella: `event-media` (o il nome che preferisci)
4. Clicca **"Create"**

> **📁 Importante**: Questa cartella conterrà tutti i media caricati dall'app. Puoi organizzarli per evento creando sottocartelle se necessario.

#### 2.3 Configura Upload Preset
1. Vai su **Settings** ⚙️ → **Upload** → **Upload Presets**
2. Clicca **"Add upload preset"** (pulsante verde)
3. Configura il preset:
   - **Preset name**: `snaply-upload` (o personalizzato)
   - **Signing Mode**: **Unsigned** ⚠️ IMPORTANTE!
   - **Folder**: `event-media` (la cartella creata al punto 2.2)
   - **Access Mode**: **Public**
   - **Resource Type**: **Auto** (per supportare sia foto che video)
4. Clicca **"Save"**

> **💡 Nota**: Il mode "Unsigned" è essenziale per permettere upload diretti dal frontend senza autenticazione server.

#### 2.4 Verifica Configurazione
Alla fine dovresti avere:
- ✅ **Cloud Name**: copiato dalla dashboard
- ✅ **Cartella**: `event-media` creata in Media Library  
- ✅ **Upload Preset**: `snaply-upload` configurato come Unsigned
- ✅ **Configurazione**: aggiornata nel file `.env`

### 3. Setup JSONBin (OPZIONALE per sincronizzazione multi-device)
1. **Opzionale**: Registrati su [jsonbin.io](https://jsonbin.io)
2. Create Bin → inserisci: `{"media": []}`
3. API Keys → copia **Master Key** e **Access Key**
4. Copia l'ID del bin dall'URL

**Nota**: Senza JSONBin, l'app funziona perfettamente con solo localStorage!

### 4. Configura l'App
Copia il file `.env.example` come `.env` (nel caso di deploy su VPS) e personalizza le tue impostazioni:

```bash
cp .env.example .env
```

Modifica il file `.env` con le tue configurazioni:

```bash
# 🎨 PERSONALIZZAZIONE UI
VITE_APP_TITLE="Il Mio Evento"
VITE_APP_SUBTITLE="Condividi foto e video! ✨"
VITE_APP_PRIMARY_COLOR="#dc2626"

# ☁️ CLOUDINARY (obbligatorio)
VITE_CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
VITE_CLOUDINARY_UPLOAD_PRESET="your_upload_preset_here"

# 📦 JSONBIN (opzionale - lascia vuoto per disabilitare)
VITE_JSONBIN_ID=""
VITE_JSONBIN_MASTER_KEY=""
VITE_JSONBIN_ACCESS_KEY=""
```

### 5. Test Locale
```bash
npm run dev
```
Apri [localhost:8080](http://localhost:8080)

## 🚀 Deploy su Vercel

Il progetto è ottimizzato per Vercel che permette di configurare le variabili d'ambiente direttamente nella dashboard prima del deploy.

### 📦 Deploy su Vercel (Raccomandato)

1. **Push su GitHub**:
```bash
git add .
git commit -m "feat: configurazione con variabili d'ambiente"
git push origin main
```

2. **Connetti Repository**:
   - Vai su [vercel.com](https://vercel.com)
   - "New Project" → Importa il tuo repository GitHub

3. **Configura Variabili d'Ambiente**:
   - Nella dashboard Vercel → Settings → Environment Variables
   - Aggiungi tutte le variabili dal tuo file `.env`:
   ```
   VITE_APP_TITLE = "Il Mio Evento"
   VITE_APP_SUBTITLE = "Condividi foto e video! ✨"
   VITE_APP_PRIMARY_COLOR = "#dc2626"
   VITE_CLOUDINARY_CLOUD_NAME = "your_cloud_name"
   VITE_CLOUDINARY_UPLOAD_PRESET = "your_preset"
   VITE_JSONBIN_ID = "your_bin_id" (opzionale)
   VITE_JSONBIN_MASTER_KEY = "your_master_key" (opzionale)
   VITE_JSONBIN_ACCESS_KEY = "your_access_key" (opzionale)
   ```

4. **Deploy**: Clicca "Deploy" - Il sito sarà online in 1-2 minuti!

### 📦 Deploy Alternativo con CLI

1. **Installa Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login e Deploy**:
```bash
vercel login
vercel --prod
```

3. **Configura Variabili**: Segui le istruzioni interattive per impostare le variabili d'ambiente.

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

**✅ Configurazione flessibile!** Usa variabili d'ambiente per personalizzare facilmente l'app


## 🛠️ Tecnologie

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/ui
- **Storage**: Cloudinary
- **Database**: localStorage (o JSONBin opzionale)
- **Deploy**: Vercel / Cloudflare Pages

## 🎨 Personalizzazione

Personalizzare Snaply è semplicissimo! Basta modificare il file `.env`.

### 🚀 Personalizzazione Rapida

#### 1. Cambia Colore e Titoli
```bash
# .env
VITE_APP_TITLE="Il Mio Evento 🎉"
VITE_APP_SUBTITLE="Condividi i momenti speciali!"
VITE_APP_PRIMARY_COLOR="#dc2626"
```

#### 2. Usa Colori Predefiniti
Puoi utilizzare uno dei colori predefiniti disponibili:
```bash
# Rosso passione
VITE_APP_PRIMARY_COLOR="#dc2626"

# Blu professionale  
VITE_APP_PRIMARY_COLOR="#1e40af"

# Verde natura
VITE_APP_PRIMARY_COLOR="#059669"

# Viola moderno
VITE_APP_PRIMARY_COLOR="#7c3aed"
```

### 🎨 Colori Disponibili

```bash
# Elegante (default)
VITE_APP_PRIMARY_COLOR="#5b0822"

# Passione
VITE_APP_PRIMARY_COLOR="#dc2626"

# Professionale  
VITE_APP_PRIMARY_COLOR="#1e40af"

# Natura
VITE_APP_PRIMARY_COLOR="#059669"

# Moderno
VITE_APP_PRIMARY_COLOR="#7c3aed"

# Caldo
VITE_APP_PRIMARY_COLOR="#ea580c"

# Intenso
VITE_APP_PRIMARY_COLOR="#be185d"
```

### 📋 Esempi di Configurazione per Eventi

#### 💍 Matrimonio
```bash
VITE_APP_TITLE="Martina & Marco Wedding"
VITE_APP_SUBTITLE="I nostri momenti speciali! 💍"
VITE_APP_PRIMARY_COLOR="#dc2626"
```

#### 🎂 Compleanno
```bash
VITE_APP_TITLE="I miei 30 Anni 🎂"
VITE_APP_SUBTITLE="Festa da ricordare! 🎉"
VITE_APP_PRIMARY_COLOR="#ea580c"
```

#### 🎓 Laurea
```bash
VITE_APP_TITLE="Laurea di Nicola 🎓"
VITE_APP_SUBTITLE="Celebriamo insieme! 🥳"
VITE_APP_PRIMARY_COLOR="#1e40af"
```

#### 🏖️ Vacanza
```bash
VITE_APP_TITLE="Estate 2025 ☀️"
VITE_APP_SUBTITLE="I ricordi più belli! 📸"
VITE_APP_PRIMARY_COLOR="#0891b2"
```

### ⚙️ Configurazione Avanzata

#### Disabilita JSONBin (solo localStorage)
```bash
# Lascia vuote queste variabili per disabilitare la sincronizzazione
VITE_JSONBIN_ID=""
VITE_JSONBIN_MASTER_KEY=""
VITE_JSONBIN_ACCESS_KEY=""
```

#### Configura Cloudinary
```bash
VITE_CLOUDINARY_CLOUD_NAME="il_tuo_cloud_name"
VITE_CLOUDINARY_UPLOAD_PRESET="il_tuo_preset_unsigned"
```

### 🔄 Applica le Modifiche

1. **Modifica** il file `.env`
2. **Riavvia** il server: `npm run dev`
3. **Deploy** - le variabili d'ambiente vengono configurate sulla piattaforma!

### 🎯 Tips per la Personalizzazione

- **Emoji nei titoli** rendono l'app più accattivante
- **Colori coerenti** con il tema dell'evento
- **Sottotitoli chiari** spiegano cosa fare agli utenti
- **Testa sempre** in locale prima del deploy

## 🔧 Troubleshooting

### Problemi Comuni

**❌ Upload non funziona**
- Verifica che l'Upload Preset su Cloudinary sia configurato come "Unsigned"
- Controlla che la cartella `event-media` esista su Cloudinary
- Verifica che `VITE_CLOUDINARY_CLOUD_NAME` e `VITE_CLOUDINARY_UPLOAD_PRESET` nel file `.env` siano corretti
- Assicurati che l'Upload Preset abbia **Access Mode** impostato su "Public"

**❌ Cartella non trovata su Cloudinary**
- Vai su **Media Library** e verifica che la cartella `event-media` esista
- Se non esiste, creala manualmente: **Media Library** → **Create Folder**
- Assicurati che il nome della cartella nel preset corrisponda a quella creata

**❌ Errore "Invalid upload preset"**
- Controlla che il nome dell'upload preset sia corretto nel file `.env`
- Verifica che il preset sia stato salvato correttamente su Cloudinary
- Il preset deve essere **Unsigned** per funzionare dal frontend

**❌ Colori non cambiano**
- Riavvia il server: `npm run dev` dopo modifiche al file `.env`
- Verifica che il colore sia in formato hex: `#dc2626`

**❌ JSONBin non sincronizza**
- Controlla le credenziali nel file `.env`
- Se vuoi solo localStorage, lascia vuote le variabili JSONBIN

**❌ Variabili d'ambiente non funzionano**
- Assicurati che le variabili inizino con `VITE_` (obbligatorio per Vite)
- Riavvia il server dopo modifiche al file `.env`
- Verifica che il file `.env` sia nella root del progetto

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