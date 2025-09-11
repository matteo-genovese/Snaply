import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Video, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { config } from '@/config';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  created_at: string;
  isVideo: boolean;
  publicUrl?: string; // Per visualizzazione diretta
}

interface MediaGalleryProps {
  refreshTrigger: number;
}

// Configurazione da file config
const CLOUDINARY_CLOUD_NAME = config.cloudinary.cloudName;

// Database JSONBin.io per sincronizzazione cross-device (opzionale)
const JSONBIN_ID = config.jsonbin.id;
const JSONBIN_MASTER_KEY = config.jsonbin.masterKey;
const JSONBIN_ACCESS_KEY = config.jsonbin.accessKey;
const JSONBIN_URL = JSONBIN_ID ? `https://api.jsonbin.io/v3/b/${JSONBIN_ID}` : null;

const MediaGallery: React.FC<MediaGalleryProps> = ({ refreshTrigger }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🎨 Carica il tema dinamico
  useTheme();

  const fetchMediaWithSmartCache = async () => {
    try {
      setLoading(true);
      
      // 🧠 CACHE INTELLIGENTE: controlla se la cache è "fresca"
      const CACHE_DURATION = 1 * 60 * 1000; // 1 minuto
      const lastSync = localStorage.getItem('lovaloha-last-sync');
      const now = Date.now();
      
      // Se cache è fresca (< 2 minuti), usa localStorage
      if (lastSync && (now - parseInt(lastSync)) < CACHE_DURATION) {
        console.log('📱 Cache fresca: uso localStorage (nessuna chiamata API)');
        
        const savedMedia = localStorage.getItem('lovaloha-media');
        if (savedMedia) {
          const media = JSON.parse(savedMedia) as MediaItem[];
          const sortedMedia = media.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setMediaItems(sortedMedia);
          console.log(`✅ ${media.length} file dalla cache locale (risparmiata 1 chiamata API)`);
        } else {
          setMediaItems([]);
        }
        setLoading(false);
        return;
      }
      
      // Cache vecchia o assente → tentativo sincronizzazione da JSONBin (se configurato)
      console.log('🔄 Cache vecchia: tentativo sincronizzazione da JSONBin...');

      if (JSONBIN_URL && JSONBIN_ID && JSONBIN_MASTER_KEY && JSONBIN_ACCESS_KEY) {
        try {
          const response = await fetch(`${JSONBIN_URL}/latest`, {
            headers: {
              'X-Master-Key': JSONBIN_MASTER_KEY,
              'X-Access-Key': JSONBIN_ACCESS_KEY
            }
          });

          if (response.ok) {
            const data = await response.json();
            const syncedMedia = data.record?.media || [];

            if (Array.isArray(syncedMedia)) {
              console.log(`✅ ${syncedMedia.length} file sincronizzati da JSONBin`);

              const sortedMedia = syncedMedia.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );

              setMediaItems(sortedMedia);

              // Aggiorna cache + timestamp
              localStorage.setItem('lovaloha-media', JSON.stringify(sortedMedia));
              localStorage.setItem('lovaloha-last-sync', now.toString());

              console.log('✅ Cache aggiornata - prossimi 2min useranno localStorage');
              return;
            }
          } else {
            console.log('JSONBin non disponibile:', response.status);
          }
        } catch (jsonbinError) {
          console.log('Errore JSONBin:', jsonbinError);
        }
      } else {
        console.log('⚠️ JSONBin non configurato - uso solo localStorage');
      }
      
      // Fallback: localStorage anche se datato
      const savedMedia = localStorage.getItem('lovaloha-media');
      if (savedMedia) {
        const media = JSON.parse(savedMedia) as MediaItem[];
        const sortedMedia = media.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setMediaItems(sortedMedia);
        console.log(`📱 Fallback: ${media.length} file da cache locale`);
      } else {
        setMediaItems([]);
      }
      
    } catch (error) {
      console.error('Errore caricamento:', error);
      const savedMedia = localStorage.getItem('lovaloha-media');
      setMediaItems(savedMedia ? JSON.parse(savedMedia) : []);
    } finally {
      setLoading(false);
    }
  };

  // Cache intelligente che riduce chiamate API del 80-90%
  const fetchMedia = fetchMediaWithSmartCache;

  const removeMedia = (id: string) => {
    try {
      // Rimuove dalla lista locale
      const updatedItems = mediaItems.filter(item => item.id !== id);
      setMediaItems(updatedItems);
      
      // Aggiorna localStorage
      localStorage.setItem('lovaloha-media', JSON.stringify(updatedItems));
      
      console.log(`File ${id} rimosso dalla galleria locale (rimane su Cloudinary)`);
    } catch (error) {
      console.error('Errore nella rimozione del media:', error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data non disponibile';
    try {
      return new Date(dateString).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data non valida';
    }
  };

  if (loading) {
    return (
      <Card className="card-elegant p-8 border-2 border-primary-20">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-20 border-t-primary"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 bg-gradient-to-r from-primary-20 to-primary-30"></div>
          </div>
          <p className="text-primary-70 mt-4 font-medium">Caricamento galleria...</p>
        </div>
      </Card>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <Card className="card-elegant p-8 border-2 border-primary-20">
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gradient-to-r from-primary-20 to-primary-30 rounded-full mb-6">
            <ImageIcon className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-primary">Nessun file caricato</h3>
          <p className="text-primary-70 text-lg font-medium">
            Carica le prime foto e video per iniziare! ✨
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Galleria ({mediaItems.length} elementi)
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <Card key={item.id} className="card-elegant overflow-hidden group gallery-item border-2 border-primary-10 hover:border-primary-30 relative">
            {/* Stellina dorata che appare solo al hover */}
            <div className="absolute -top-1 -right-1 z-20 text-xs text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">✨</div>
            
            <div className="aspect-square bg-gradient-to-br from-primary-10 to-primary-20 relative overflow-hidden">
              {/* Badge tipo media */}
              <div className="absolute top-3 left-3 z-10 media-badge rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                {item.isVideo ? (
                  <Video className="w-3 h-3 text-white" />
                ) : (
                  <ImageIcon className="w-3 h-3 text-white" />
                )}
                <span className="text-xs text-white font-medium">
                  {item.isVideo ? 'Video' : 'Foto'}
                </span>
              </div>

              {/* Pulsanti azione */}
              <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={() => window.open(item.url, '_blank')}
                  title="Apri in Cloudinary"
                >
                  <ExternalLink className="w-3 h-3 text-primary" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
                  onClick={() => removeMedia(item.id)}
                  title="Rimuovi dalla galleria"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </Button>
              </div>

              {/* Visualizzazione diretta o placeholder */}
              {item.publicUrl && !item.isVideo ? (
                <div className="w-full h-full relative">
                  <img 
                    src={item.publicUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback se l'immagine non carica
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-accent/10">
                            <div class="text-center space-y-3">
                              <div class="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                              </div>
                              <p class="text-sm font-medium text-muted-foreground">Click per aprire sul browser</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : item.publicUrl && item.isVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <video 
                    src={item.publicUrl}
                    controls
                    className="max-w-full max-h-full object-contain"
                    preload="metadata"
                    onError={() => {
                      // Fallback per video che non caricano
                      console.log('Video loading error for:', item.publicUrl);
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-10 to-primary-20">
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                      item.isVideo 
                        ? 'bg-primary-20 text-primary' 
                        : 'bg-primary-20 text-primary'
                    }`}>
                      {item.isVideo ? (
                        <Video className="w-8 h-8" />
                      ) : (
                        <ImageIcon className="w-8 h-8" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-primary-70">
						Click per aprire su Cloudinary
                    </p>
                  </div>
                </div>
              )}
              
              {/* Click overlay per aprire Cloudinary */}
              <div 
                className="absolute inset-0 cursor-pointer bg-black/0 hover:bg-black/5 transition-colors duration-200"
                onClick={() => window.open(item.url, '_blank')}
              />
            </div>
            
            <div className="p-4 bg-gradient-to-r from-card to-primary-5 relative">
              {/* Piccola stellina nell'angolo del titolo */}
              <div className="absolute top-2 right-2 text-xs text-amber-400 opacity-60">⭐</div>
              
              <p className="text-sm font-medium text-primary truncate pr-6" title={item.title}>
                {item.title}
              </p>
              <p className="text-xs text-primary-60 mt-1 font-medium">
                {formatDate(item.created_at)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
