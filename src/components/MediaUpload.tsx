import React, { useState, useCallback } from 'react';
import { Upload, Image, Video, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useDropzone } from 'react-dropzone';
import { config } from '@/config';

interface MediaUploadProps {
  onUploadSuccess: () => void;
}

// Non servono più dichiarazioni globali per il widget

// Timer globale per debouncing sync JSONBin
let syncTimeout: NodeJS.Timeout | null = null;

// 🚀 Sync JSONBin debounced (riduce chiamate API del 90%)
const debouncedSyncToJSONBin = (mediaList: any[]) => {
  // Cancella timer precedente se esiste
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  // Schedula nuovo sync tra 3 secondi
  // Solo se JSONBin è configurato
  if (!config.jsonbin.id || !config.jsonbin.masterKey || !config.jsonbin.accessKey) {
    console.log('⚠️ JSONBin non configurato - skip sync');
    return;
  }

  syncTimeout = setTimeout(async () => {
    try {
      console.log('🔄 Sync background JSONBin...');

      const JSONBIN_ID = config.jsonbin.id;
      const JSONBIN_MASTER_KEY = config.jsonbin.masterKey;
      const JSONBIN_ACCESS_KEY = config.jsonbin.accessKey;
      const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

      const response = await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_MASTER_KEY,
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify({
          media: mediaList
        })
      });

      if (response.ok) {
        console.log('✅ Sync JSONBin completato in background!');
        // Aggiorna timestamp cache
        localStorage.setItem('Snaply-last-sync', Date.now().toString());
      } else {
        console.log('⚠️ Sync JSONBin fallito:', response.status);
      }
    } catch (error) {
      console.log('⚠️ Errore sync background:', error);
    }
  }, 3000); // 3 secondi di debounce
};

const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  // 🔧 Credenziali Cloudinary da configurazione:
  const CLOUDINARY_CLOUD_NAME = config.cloudinary.cloudName;
  const CLOUDINARY_UPLOAD_PRESET = config.cloudinary.uploadPreset;
  
  const { toast } = useToast();
  
  // 🎨 Carica il tema dinamico
  useTheme();

  // 🚀 Sync JSONBin debounced  
  const handleDebouncedSync = (mediaList: any[]) => {
    debouncedSyncToJSONBin(mediaList);
  };

  // 📁 Gestione drag & drop con upload immediato
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (uploading) return; // Evita upload multipli simultanei
    
    const validFiles = acceptedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type === 'video/mp4' || file.type === 'video/webm' || file.type === 'video/mov';
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB
      
      if (!isImage && !isVideo) {
        toast({
          title: 'Formato non supportato',
          description: `${file.name} non è un formato supportato`,
          variant: 'destructive'
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: 'File troppo grande',
          description: `${file.name} supera i 100MB`,
          variant: 'destructive'
        });
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      // 🚀 Upload immediato non appena i file sono selezionati!
      setSelectedFiles(validFiles);
      uploadFilesImmediate(validFiles);
    }
  }, [toast, uploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/mov': ['.mov']
    },
    multiple: true,
    disabled: uploading
  });

  // 🗑️ Rimuovi file dalla lista
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🚀 Upload immediato non appena i file sono selezionati
  const uploadFilesImmediate = async (filesToUpload: File[]) => {
    setUploading(true);
    const uploadedMedia: any[] = [];
    
    try {
      for (const [index, file] of filesToUpload.entries()) {
        const fileId = `${index}-${file.name}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        try {
          // Prepara FormData per Cloudinary
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          formData.append('folder', 'Snaply');
          formData.append('tags', 'Snaply,event,' + new Date().toISOString().split('T')[0]);
          
          // Upload a Cloudinary con feedback immediato
          console.log(`📤 Caricamento ${file.name}...`);
          
          const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const result = await response.json();
            
            const newMedia = {
              id: result.public_id,
              title: result.original_filename || file.name,
              url: result.secure_url,
              publicUrl: result.secure_url,
              created_at: new Date().toISOString(),
              isVideo: result.resource_type === 'video'
            };
            
            uploadedMedia.push(newMedia);
            setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
            
            console.log(`✅ ${file.name} caricato con successo`);
            
            // Notifica immediata per ogni file completato
            toast({
              title: `✅ ${file.name} caricato!`,
              description: `File ${index + 1} di ${filesToUpload.length} completato`
            });
            
          } else {
            throw new Error(`Upload fallito: ${response.status}`);
          }
        } catch (fileError) {
          console.error(`Errore upload ${file.name}:`, fileError);
          toast({
            title: 'Errore upload',
            description: `Errore nel caricare ${file.name}`,
            variant: 'destructive'
          });
        }
      }

      if (uploadedMedia.length > 0) {
        // 1. Aggiorna localStorage con nuovi file
        const existingMedia = JSON.parse(localStorage.getItem('Snaply-media') || '[]');
        const allMedia = [...uploadedMedia, ...existingMedia];
        localStorage.setItem('Snaply-media', JSON.stringify(allMedia));
        
        // 2. 🚀 AGGIORNA CACHE IMMEDIATAMENTE per mostrare i file subito!
        localStorage.setItem('Snaply-last-sync', Date.now().toString());
        console.log('✅ Cache aggiornata immediatamente - galleria mostrerà i nuovi file!');
        
        // 3. Sync JSONBin in background per altri dispositivi
        handleDebouncedSync(allMedia);
        
        // 4. 🔄 FORZA REFRESH IMMEDIATO DELLA GALLERIA
        onUploadSuccess();
        
        // 5. Notifica finale di completamento
        toast({
          title: 'Tutti i file caricati! 🎉',
          description: `${uploadedMedia.length} file ora visibili a tutti!`
        });
        
        // 6. Reset UI dopo 2 secondi
        setTimeout(() => {
          setSelectedFiles([]);
          setUploadProgress({});
        }, 2000);
        
        console.log(`📱 ${uploadedMedia.length} nuovi file aggiunti e cache aggiornata!`);
      }
    } catch (error) {
      console.error('Errore upload batch:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante il caricamento',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  // 🎉 Tutto gestito con drag & drop nativo - molto più semplice!

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Area drag & drop semplice e intuitiva */}
      <Card className="card-elegant p-6 relative">
        {/* Stelline che appaiono quando si fa upload */}
        {isDragActive && (
          <>
            <div className="absolute top-2 left-4 text-lg text-yellow-400 animate-bounce">✨</div>
            <div className="absolute top-3 right-6 text-sm text-amber-400 animate-pulse delay-200">⭐</div>
            <div className="absolute bottom-4 left-6 text-sm text-yellow-500 animate-bounce delay-400">🌟</div>
            <div className="absolute bottom-2 right-4 text-lg text-amber-500 animate-pulse delay-600">✨</div>
          </>
        )}
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-primary bg-primary-10 shadow-lg scale-[1.02]' 
              : uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-primary-60 hover:border-primary hover:bg-primary-5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className={`p-6 rounded-full transition-all duration-300 ${
              isDragActive 
                ? 'bg-primary shadow-lg' 
                : uploading
                ? 'bg-gray-400'
                : 'bg-primary-20 hover:bg-primary-30'
            }`}>
              <Upload className={`w-8 h-8 ${
                isDragActive || uploading ? 'text-white' : 'text-primary'
              }`} />
            </div>
            
            {isDragActive ? (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Rilascia qui i tuoi file! 📸</h3>
                <p className="text-primary-80">Foto e video saranno caricati automaticamente</p>
              </div>
            ) : uploading ? (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-700">Caricamento in corso...</h3>
                <p className="text-gray-600">Attendere prego</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-primary">Trascina qui le tue foto e video</h3>
                <p className="text-primary-70 text-lg">
                  oppure <span className="text-primary font-semibold">clicca per selezionare</span>
                </p>
                <p className="text-sm text-primary bg-primary-5 px-4 py-2 rounded-full border border-primary-30">
                  🚀 Caricamento automatico • JPG, PNG, MP4, WebM, MOV (max 100MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Progress dei file in caricamento */}
      {selectedFiles.length > 0 && (
        <Card className="card-elegant p-6 bg-gradient-to-r from-primary-5 to-primary-10 border-2 border-primary-30">
          <h4 className="font-bold text-lg mb-4 text-primary">
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                Caricamento in corso... ({selectedFiles.length} file)
              </div>
            ) : (
              `✅ Caricamento completato! (${selectedFiles.length} file)`
            )}
          </h4>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const fileId = `${index}-${file.name}`;
              const progress = uploadProgress[fileId] || 0;
              const isCompleted = progress === 100;
              
              return (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-primary-10 border-primary-30' 
                    : uploading 
                    ? 'bg-primary-5 border-primary-20' 
                    : 'bg-white/70 border-gray-200'
                }`}>
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary text-white' 
                      : 'bg-gradient-to-r from-primary-20 to-primary-30'
                  }`}>
                    {isCompleted ? (
                      <div className="w-4 h-4 flex items-center justify-center">✓</div>
                    ) : file.type.startsWith('image/') ? (
                      <Image className="w-4 h-4 text-primary" />
                    ) : (
                      <Video className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isCompleted ? 'text-primary' : 'text-primary-80'
                    }`}>
                      {file.name}
                    </p>
                    <p className="text-xs text-primary-60">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                      {uploading && progress > 0 && ` • ${progress}%`}
                      {isCompleted && ' • Caricato! ✅'}
                    </p>
                    
                    {uploading && progress > 0 && !isCompleted && (
                      <div className="w-full bg-primary-20 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {!uploading && (
            <p className="text-center text-primary mt-4 font-medium bg-primary-10 py-2 rounded-lg">
              🎉 Tutti i file sono stati caricati e sono ora visibili a tutti!
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default MediaUpload;
