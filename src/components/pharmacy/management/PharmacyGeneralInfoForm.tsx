// ============================================
// FORM: Informations Générales Pharmacie
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Pharmacie, PROVINCES_GABON, VILLES_PRINCIPALES } from '@/types/pharmacy';
import { MapPin, Phone, Mail, Building2, Save } from 'lucide-react';

interface PharmacyGeneralInfoFormProps {
  pharmacy: Pharmacie;
  onUpdate: (data: { id: string; updates: Partial<Pharmacie> }) => void;
}

export function PharmacyGeneralInfoForm({ pharmacy, onUpdate }: PharmacyGeneralInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom_commercial: pharmacy.nom_commercial,
    enseigne: pharmacy.enseigne || '',
    adresse_complete: pharmacy.adresse_complete,
    quartier: pharmacy.quartier || '',
    ville: pharmacy.ville,
    province: pharmacy.province,
    code_postal: pharmacy.code_postal || '',
    reperes_geographiques: pharmacy.reperes_geographiques || '',
    telephone_principal: pharmacy.telephone_principal,
    telephone_secondaire: pharmacy.telephone_secondaire || '',
    telephone_urgence: pharmacy.telephone_urgence || '',
    email: pharmacy.email || '',
    site_web: pharmacy.site_web || '',
    latitude: pharmacy.latitude,
    longitude: pharmacy.longitude,
    surface_m2: pharmacy.surface_m2 || 0,
    capacite_stockage_medicaments: pharmacy.capacite_stockage_medicaments || 0,
    visible_plateforme: pharmacy.visible_plateforme,
    accepte_commandes_en_ligne: pharmacy.accepte_commandes_en_ligne,
    accepte_reservations: pharmacy.accepte_reservations,
    delai_preparation_moyen_minutes: pharmacy.delai_preparation_moyen_minutes,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      id: pharmacy.id,
      updates: formData,
    });
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations de Base
          </CardTitle>
          <CardDescription>
            Nom commercial, enseigne et type d'établissement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="nom_commercial">Nom Commercial *</Label>
              <Input
                id="nom_commercial"
                value={formData.nom_commercial}
                onChange={(e) => setFormData({ ...formData, nom_commercial: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="enseigne">Enseigne (si différent)</Label>
              <Input
                id="enseigne"
                value={formData.enseigne}
                onChange={(e) => setFormData({ ...formData, enseigne: e.target.value })}
                disabled={!isEditing}
                placeholder="Optionnel"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="surface">Surface (m²)</Label>
              <Input
                id="surface"
                type="number"
                value={formData.surface_m2}
                onChange={(e) => setFormData({ ...formData, surface_m2: parseFloat(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="capacite">Capacité Stockage (références)</Label>
              <Input
                id="capacite"
                type="number"
                value={formData.capacite_stockage_medicaments}
                onChange={(e) => setFormData({ ...formData, capacite_stockage_medicaments: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation
          </CardTitle>
          <CardDescription>
            Adresse complète et coordonnées GPS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adresse">Adresse Complète *</Label>
            <Textarea
              id="adresse"
              value={formData.adresse_complete}
              onChange={(e) => setFormData({ ...formData, adresse_complete: e.target.value })}
              disabled={!isEditing}
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="quartier">Quartier</Label>
              <Input
                id="quartier"
                value={formData.quartier}
                onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="ville">Ville *</Label>
              <Select 
                value={formData.ville} 
                onValueChange={(value) => setFormData({ ...formData, ville: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VILLES_PRINCIPALES.map((ville) => (
                    <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="province">Province *</Label>
              <Select 
                value={formData.province} 
                onValueChange={(value) => setFormData({ ...formData, province: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES_GABON.map((province) => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="reperes">Repères Géographiques</Label>
            <Textarea
              id="reperes"
              value={formData.reperes_geographiques}
              onChange={(e) => setFormData({ ...formData, reperes_geographiques: e.target.value })}
              disabled={!isEditing}
              placeholder="Ex: Face à la station Total, après le rond-point..."
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="tel_principal">Téléphone Principal *</Label>
              <Input
                id="tel_principal"
                type="tel"
                value={formData.telephone_principal}
                onChange={(e) => setFormData({ ...formData, telephone_principal: e.target.value })}
                disabled={!isEditing}
                placeholder="+241 XX XX XX XX"
              />
            </div>
            <div>
              <Label htmlFor="tel_secondaire">Téléphone Secondaire</Label>
              <Input
                id="tel_secondaire"
                type="tel"
                value={formData.telephone_secondaire}
                onChange={(e) => setFormData({ ...formData, telephone_secondaire: e.target.value })}
                disabled={!isEditing}
                placeholder="+241 XX XX XX XX"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                placeholder="contact@pharmacie.ga"
              />
            </div>
            <div>
              <Label htmlFor="site_web">Site Web</Label>
              <Input
                id="site_web"
                type="url"
                value={formData.site_web}
                onChange={(e) => setFormData({ ...formData, site_web: e.target.value })}
                disabled={!isEditing}
                placeholder="https://"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres Plateforme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Visible sur la plateforme</Label>
              <p className="text-sm text-muted-foreground">
                Apparaître dans les résultats de recherche
              </p>
            </div>
            <Switch
              checked={formData.visible_plateforme}
              onCheckedChange={(checked) => setFormData({ ...formData, visible_plateforme: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Accepter commandes en ligne</Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux patients de commander
              </p>
            </div>
            <Switch
              checked={formData.accepte_commandes_en_ligne}
              onCheckedChange={(checked) => setFormData({ ...formData, accepte_commandes_en_ligne: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Accepter réservations</Label>
              <p className="text-sm text-muted-foreground">
                Réserver ordonnances à préparer
              </p>
            </div>
            <Switch
              checked={formData.accepte_reservations}
              onCheckedChange={(checked) => setFormData({ ...formData, accepte_reservations: checked })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="delai">Délai Préparation Moyen (minutes)</Label>
            <Input
              id="delai"
              type="number"
              value={formData.delai_preparation_moyen_minutes}
              onChange={(e) => setFormData({ ...formData, delai_preparation_moyen_minutes: parseInt(e.target.value) })}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Modifier
          </Button>
        )}
      </div>
    </form>
  );
}

