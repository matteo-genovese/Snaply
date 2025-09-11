import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, QrCode, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { config } from '@/config';
import QRCode from 'qrcode';

const QRCodeGenerator: React.FC = () => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // 🎨 Assicura che il tema sia caricato
  useTheme();

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      const currentURL = window.location.href;
      
      // Genera QR code con opzioni personalizzate
      const dataURL = await QRCode.toDataURL(currentURL, {
        width: 512,
        margin: 2,
        color: {
          dark: config.app.primaryColor,
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrCodeDataURL(dataURL);
      
      toast({
        title: 'QR Code generato! ✨',
        description: 'Ora puoi scaricarlo come immagine PNG'
      });
    } catch (error) {
      console.error('Errore generazione QR Code:', error);
      toast({
        title: 'Errore',
        description: 'Non è stato possibile generare il QR Code',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataURL) {
      toast({
        title: 'Nessun QR Code',
        description: 'Genera prima un QR Code per poterlo scaricare',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Crea elemento temporaneo per download
      const link = document.createElement('a');
      link.download = `qr-code-${new Date().getTime()}.png`;
      link.href = qrCodeDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'QR Code scaricato! 📱',
        description: 'Il file PNG è stato salvato nei tuoi download'
      });
    } catch (error) {
      console.error('Errore download QR Code:', error);
      toast({
        title: 'Errore download',
        description: 'Non è stato possibile scaricare il QR Code',
        variant: 'destructive'
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copiato! 📋',
        description: 'Il link è stato copiato negli appunti'
      });
    } catch (error) {
      console.error('Errore copia link:', error);
      toast({
        title: 'Errore',
        description: 'Non è stato possibile copiare il link',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="card-elegant p-6 bg-gradient-to-br from-primary-5 to-primary-10 border-2 border-primary-20 relative">
      {/* Stelline decorative */}
      <div className="absolute -top-2 left-6 text-xl text-yellow-400 animate-bounce">🎊</div>
      <div className="absolute -top-1 right-8 text-lg text-amber-500 animate-pulse delay-400">✨</div>
      <div className="absolute top-4 -left-2 text-sm text-yellow-400 animate-bounce delay-600">⭐</div>
      <div className="absolute top-8 -right-2 text-sm text-amber-400 animate-pulse delay-800">🌟</div>
      <div className="absolute -bottom-2 left-12 text-lg text-yellow-500 animate-bounce delay-1000">🎉</div>
      <div className="absolute -bottom-3 right-10 text-xl text-amber-400 animate-pulse delay-1200">✨</div>
      
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="inline-block p-3 bg-gradient-to-r from-primary-20 to-primary-30 rounded-full mb-4 relative">
          <Share2 className="w-8 h-8 text-primary" />
          <div className="absolute -top-1 -right-1 text-xs text-yellow-400 animate-pulse">✨</div>
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-primary">Condividi questo album 🌟</h3>
        
        {/* URL Display */}
        <div className="text-sm text-primary-70 bg-primary-5 p-4 rounded-xl font-mono break-all max-w-3xl mx-auto border border-primary-20 relative">
          {window.location.href}
          <div className="absolute -top-2 left-4 text-xs text-yellow-400">⭐</div>
          <div className="absolute -bottom-2 right-6 text-xs text-amber-400">✨</div>
        </div>
        
        {/* Pulsanti di controllo */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={generateQRCode}
            disabled={isGenerating}
            className="bg-primary hover:bg-primary-90 text-white gap-2"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <QrCode className="w-4 h-4" />
            )}
            {isGenerating ? 'Generando...' : 'Genera QR Code'}
          </Button>
          
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="border-primary text-primary hover:bg-primary-10 gap-2"
          >
            <Share2 className="w-4 h-4" />
            Copia Link
          </Button>
          
          {qrCodeDataURL && (
            <Button
              onClick={downloadQRCode}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Download className="w-4 h-4" />
              Scarica PNG
            </Button>
          )}
        </div>
        
        {/* QR Code Display */}
        {qrCodeDataURL && (
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-primary">Il tuo QR Code 📱</h4>
            <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-2 border-primary-20 relative">
              <img 
                src={qrCodeDataURL} 
                alt="QR Code dell'album"
                className="w-48 h-48 mx-auto"
              />
              {/* Stelline attorno al QR code */}
              <div className="absolute -top-2 -left-2 text-lg text-yellow-400 animate-bounce">✨</div>
              <div className="absolute -top-2 -right-2 text-lg text-amber-400 animate-pulse delay-300">⭐</div>
              <div className="absolute -bottom-2 -left-2 text-lg text-amber-500 animate-pulse delay-600">🌟</div>
              <div className="absolute -bottom-2 -right-2 text-lg text-yellow-400 animate-bounce delay-900">✨</div>
            </div>
            <p className="text-sm text-primary-70 font-medium">
              Inquadra questo QR code per accedere istantaneamente all'album! 📸
            </p>
          </div>
        )}
        
        {/* Info aggiuntive */}
        <div className="mt-6 p-4 bg-primary-5 rounded-xl border border-primary-10">
          <p className="text-sm text-primary-80 font-medium">
            💡 <strong>Suggerimento:</strong> Stampa il QR code e mettilo vicino all'ingresso 
            così tutti potranno facilmente accedere e caricare le loro foto!
          </p>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
