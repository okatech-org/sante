import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Impossible d'accéder à la caméra");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 MB");
        return;
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadAvatar = async () => {
    if (!previewUrl) return;

    setUploading(true);
    try {
      // Get current session to ensure we have a valid auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Session check:', { hasSession: !!session, sessionError });
      
      if (sessionError || !session?.user) {
        console.error('Auth error:', sessionError);
        throw new Error("Vous devez être connecté pour uploader une photo");
      }

      const user = session.user;
      console.log('User ID:', user.id);

      // Convert preview URL to blob
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileExt = 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success("Photo de profil mise à jour");
      onAvatarUpdate(publicUrl);
      setIsOpen(false);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Erreur lors de l'upload de la photo");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setPreviewUrl(null);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#00d4ff] hover:bg-[#0088ff] transition-colors flex items-center justify-center border-2 border-[#1a1f2e]"
      >
        <Camera className="w-5 h-5 text-white" />
      </button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Photo de profil</DialogTitle>
            <DialogDescription>Prendre une photo ou importer une image (JPG/PNG, max 5 Mo).</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!showCamera && !previewUrl && (
              <div className="flex flex-col gap-3">
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Prendre une photo
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choisir une photo
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {showCamera && (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} className="flex-1">
                    Capturer
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={uploadAvatar} 
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer
                  </Button>
                  <Button 
                    onClick={() => setPreviewUrl(null)} 
                    variant="outline"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}