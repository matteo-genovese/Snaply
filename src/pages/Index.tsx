import React, { useState } from 'react';
import MediaUpload from '@/components/MediaUpload';
import MediaGallery from '@/components/MediaGallery';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { useTheme } from '@/hooks/useTheme';
import { config } from '@/config';

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 🎨 Carica il tema dinamico
  useTheme();

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      {/* Decorazioni dorate di sfondo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stelline dorate sparse */}
        <div className="absolute top-10 left-10 text-2xl text-yellow-400 animate-pulse">✨</div>
        <div className="absolute top-20 right-20 text-xl text-yellow-500 animate-bounce delay-300">⭐</div>
        <div className="absolute top-32 left-1/4 text-lg text-amber-400 animate-pulse delay-500">✨</div>
        <div className="absolute top-40 right-1/3 text-2xl text-yellow-400 animate-bounce delay-700">🌟</div>
        <div className="absolute top-60 left-16 text-xl text-amber-500 animate-pulse delay-1000">⭐</div>
        <div className="absolute top-80 right-12 text-lg text-yellow-400 animate-bounce delay-1200">✨</div>
        
        {/* Stelline mobili */}
        <div className="absolute top-1/3 left-8 text-xl text-yellow-400 animate-bounce delay-200">🌟</div>
        <div className="absolute top-1/2 right-8 text-lg text-amber-400 animate-pulse delay-600">✨</div>
        <div className="absolute bottom-40 left-12 text-2xl text-yellow-500 animate-bounce delay-900">⭐</div>
        <div className="absolute bottom-60 right-16 text-xl text-amber-400 animate-pulse delay-1100">🌟</div>
        <div className="absolute bottom-32 left-1/3 text-lg text-yellow-400 animate-bounce delay-1400">✨</div>
        <div className="absolute bottom-20 right-1/4 text-2xl text-amber-500 animate-pulse delay-1600">⭐</div>
        
        {/* Coriandoli dorati nelle parti laterali */}
        <div className="absolute top-24 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-44 right-6 w-1 h-1 bg-amber-500 rounded-full animate-bounce delay-400"></div>
        <div className="absolute top-64 left-8 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse delay-800"></div>
        <div className="absolute bottom-48 right-4 w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-1300"></div>
        <div className="absolute bottom-24 left-6 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-1500"></div>
      </div>
      
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-primary-20 sticky top-0 z-10 shadow-lg relative">
        {/* Stelline nell'header */}
        <div className="absolute top-2 left-4 text-lg text-yellow-400 animate-pulse">✨</div>
        <div className="absolute top-1 right-6 text-sm text-amber-400 animate-bounce delay-500">⭐</div>
        
        <div className="container mx-auto px-2 py-2">
          <div className="flex items-center justify-center">
            <div className="text-center relative">
              <h1 className="text-3xl font-bold text-primary relative">
                {config.app.title}
                {/* Emoji decorativo */}
                <span className="absolute -top-2 -right-8 text-lg font-bold text-amber-500 animate-pulse">🎂</span>
              </h1>
              <p className="text-primary-70 font-medium">{config.app.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Upload Section */}
        <section className="relative">
          {/* Decorazioni dorate per sezione upload */}
          <div className="absolute -top-4 left-8 text-2xl text-yellow-400 animate-pulse">🎉</div>
          <div className="absolute -top-2 right-12 text-lg text-amber-500 animate-bounce delay-300">✨</div>
          
          <div className="text-center mb-12 relative">
            <h2 className="text-4xl font-bold mb-4 text-primary relative">
              Carica i tuoi file
              <span className="absolute -top-1 -right-6 text-lg text-yellow-400 animate-pulse">📸</span>
            </h2>
            <p className="text-xl text-primary-70 font-medium">
              Condividi foto e video fino a 100MB ciascuno ⭐
            </p>
          </div>
          <MediaUpload onUploadSuccess={handleUploadSuccess} />
        </section>

        {/* Gallery Section */}
        <section>
          <MediaGallery refreshTrigger={refreshTrigger} />
        </section>

        {/* QR Code Generator */}
        <section>
          <QRCodeGenerator />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-md border-t border-primary-20 py-8 mt-20 relative">
        {/* Decorazioni footer */}
        <div className="absolute top-2 left-8 text-lg text-yellow-400 animate-pulse">🎂</div>
        <div className="absolute top-1 right-10 text-sm text-amber-400 animate-bounce delay-700">⭐</div>
        
        <div className="container mx-auto px-4 text-center text-primary-70">
          <p className="font-medium">Condividiamo i momenti speciali! ✨🎉</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
