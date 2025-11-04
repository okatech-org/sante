// ============================================
// MANAGER: Médias Pharmacie (Logo & Photos)
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pharmacie } from '@/types/pharmacy';
import { Image as ImageIcon, Upload, Trash2, Save, Plus, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PharmacyMediaManagerProps {
  pharmacy: Pharmacie;
  onUpdate: (data: { id: string; updates: Partial<Pharmacie> }) => void;
}

export function PharmacyMediaManager({ pharmacy, onUpdate }: PharmacyMediaManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [logo_url, setLogoUrl] = useState(pharmacy.logo_url || '');
  const [photos, setPhotos] = useState<string[]>(pharmacy.photos_pharmacie || []);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const addPhoto = () => {
    if (newPhotoUrl.trim() && !photos.includes(newPhotoUrl.trim())) {
      setPhotos([...photos, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const removePhoto = (url: string) => {
    setPhotos(photos.filter(p => p !== url));
  };

  const handleSubmit = () => {
    onUpdate({
      id: pharmacy.id,
      updates: {
        logo_url: logo_url || null,
        photos_pharmacie: photos.length > 0 ? photos : null,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          Les images améliorent la visibilité de votre pharmacie. Utilisez des URLs hébergées sur un service sécurisé (Cloudinary, AWS S3, etc.)
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo de la Pharmacie
          </CardTitle>
          <CardDescription>
            Logo affiché sur la carte et dans les résultats de recherche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logo_url && (
            <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/30">
              <img
                src={logo_url}
                alt="Logo pharmacie"
                className="max-h-32 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo';
                }}
              />
            </div>
          )}

          <div>
            <Label htmlFor="logo">URL du Logo</Label>
            <div className="flex gap-2">
              <Input
                id="logo"
                type="url"
                value={logo_url}
                onChange={(e) => setLogoUrl(e.target.value)}
                disabled={!isEditing}
                placeholder="https://..."
              />
              {logo_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(logo_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {!isEditing && !logo_url && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun logo configuré
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Photos de la Pharmacie
          </CardTitle>
          <CardDescription>
            Photos de l'extérieur et de l'intérieur de votre pharmacie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image';
                    }}
                  />
                  {isEditing && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="new_photo">Ajouter une Photo</Label>
              <div className="flex gap-2">
                <Input
                  id="new_photo"
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
                />
                <Button type="button" variant="outline" onClick={addPhoto}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          )}

          {!isEditing && photos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune photo configurée
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload de Fichiers</CardTitle>
          <CardDescription>
            Pour uploader des images depuis votre ordinateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Fonctionnalité d'upload à implémenter
            </p>
            <p className="text-xs text-muted-foreground">
              Intégrer avec votre service de stockage (Supabase Storage, AWS S3, etc.)
            </p>
            <Button variant="outline" className="mt-4" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Sélectionner des fichiers
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Modifier
          </Button>
        )}
      </div>
    </div>
  );
}

