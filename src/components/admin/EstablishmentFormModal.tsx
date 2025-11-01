import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Establishment, 
  EstablishmentFormData, 
  validateEstablishment,
  GABON_PROVINCES 
} from "@/types/establishment";
import { AlertCircle, Save, X } from "lucide-react";

interface EstablishmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EstablishmentFormData) => Promise<void>;
  establishment?: Establishment | null;
  mode: 'create' | 'edit';
  loading?: boolean;
}

export const EstablishmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  establishment,
  mode,
  loading = false
}: EstablishmentFormModalProps) => {
  const [formData, setFormData] = useState<EstablishmentFormData>({
    name: '',
    category: 'centre_sante',
    level: 'local',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    address: '',
    city: '',
    province: 'Estuaire',
    phoneMain: '',
    email: '',
    totalBeds: 0,
    doctors: 0,
    nurses: 0,
    services: [],
    insuranceAccepted: [],
    isPublic: true,
    isEmergencyCenter: false,
    hasAmbulance: false,
    hasPharmacy: false,
    hasLaboratory: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (establishment && mode === 'edit') {
      setFormData({
        name: establishment.name,
        fullName: establishment.fullName,
        category: establishment.category,
        level: establishment.level,
        status: establishment.status,
        managingAuthority: establishment.managingAuthority,
        director: establishment.director,
        directorContact: establishment.directorContact,
        address: establishment.location.address,
        city: establishment.location.city,
        province: establishment.location.province,
        postalCode: establishment.location.postalCode,
        latitude: establishment.location.coordinates?.latitude,
        longitude: establishment.location.coordinates?.longitude,
        phoneMain: establishment.contact.phoneMain,
        phoneEmergency: establishment.contact.phoneEmergency,
        email: establishment.contact.email,
        website: establishment.contact.website,
        totalBeds: establishment.metrics.totalBeds,
        doctors: establishment.staff.doctors,
        nurses: establishment.staff.nurses,
        services: establishment.services.map(s => s.name),
        insuranceAccepted: establishment.insuranceAccepted,
        isPublic: establishment.isPublic,
        isEmergencyCenter: establishment.isEmergencyCenter,
        hasAmbulance: establishment.hasAmbulance,
        hasPharmacy: establishment.hasPharmacy,
        hasLaboratory: establishment.hasLaboratory,
      });
    }
  }, [establishment, mode]);

  const handleSubmit = async () => {
    const validationErrors = validateEstablishment(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setActiveTab("general"); // Retour au premier onglet si erreur
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  const updateField = (field: keyof EstablishmentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleInsurance = (insurance: 'CNAMGS' | 'CNSS' | 'Privé') => {
    const current = formData.insuranceAccepted || [];
    const updated = current.includes(insurance)
      ? current.filter(i => i !== insurance)
      : [...current, insurance];
    updateField('insuranceAccepted', updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nouvel Établissement' : 'Modifier l\'Établissement'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Créer un nouvel établissement de santé dans le système'
              : `Modifier les informations de ${establishment?.name}`}
          </DialogDescription>
        </DialogHeader>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Veuillez corriger les erreurs avant de soumettre le formulaire.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
            <TabsTrigger value="capacity">Capacités</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: CHU de Libreville"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ''}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Centre Hospitalier Universitaire de Libreville"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateField('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gouvernemental">Gouvernemental</SelectItem>
                    <SelectItem value="universitaire">CHU</SelectItem>
                    <SelectItem value="regional">CHR</SelectItem>
                    <SelectItem value="departemental">CHD</SelectItem>
                    <SelectItem value="militaire">Militaire</SelectItem>
                    <SelectItem value="prive">Privé</SelectItem>
                    <SelectItem value="confessionnel">Confessionnel</SelectItem>
                    <SelectItem value="centre_sante">Centre de Santé</SelectItem>
                    <SelectItem value="dispensaire">Dispensaire</SelectItem>
                    <SelectItem value="laboratoire">Laboratoire</SelectItem>
                    <SelectItem value="pharmacie">Pharmacie</SelectItem>
                    <SelectItem value="specialise">Spécialisé</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label htmlFor="level">Niveau *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => updateField('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="regional">Régional</SelectItem>
                    <SelectItem value="provincial">Provincial</SelectItem>
                    <SelectItem value="departemental">Départemental</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="communautaire">Communautaire</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-sm text-red-500 mt-1">{errors.level}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Statut *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operationnel">Opérationnel</SelectItem>
                    <SelectItem value="partiel">Partiellement Opérationnel</SelectItem>
                    <SelectItem value="maintenance">En Maintenance</SelectItem>
                    <SelectItem value="construction">En Construction</SelectItem>
                    <SelectItem value="renovation">En Rénovation</SelectItem>
                    <SelectItem value="ferme">Fermé</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="managingAuthority">Autorité de tutelle *</Label>
              <Input
                id="managingAuthority"
                value={formData.managingAuthority}
                onChange={(e) => updateField('managingAuthority', e.target.value)}
                placeholder="Ex: Ministère de la Santé"
              />
              {errors.managingAuthority && (
                <p className="text-sm text-red-500 mt-1">{errors.managingAuthority}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="director">Directeur</Label>
                <Input
                  id="director"
                  value={formData.director || ''}
                  onChange={(e) => updateField('director', e.target.value)}
                  placeholder="Nom du directeur"
                />
              </div>

              <div>
                <Label htmlFor="directorContact">Contact directeur</Label>
                <Input
                  id="directorContact"
                  value={formData.directorContact || ''}
                  onChange={(e) => updateField('directorContact', e.target.value)}
                  placeholder="Email ou téléphone"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Adresse complète"
                rows={2}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Ex: Libreville"
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <Label htmlFor="province">Province *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) => updateField('province', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GABON_PROVINCES.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && (
                  <p className="text-sm text-red-500 mt-1">{errors.province}</p>
                )}
              </div>

              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode || ''}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  placeholder="Ex: 00000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude (GPS)</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude || ''}
                  onChange={(e) => updateField('latitude', parseFloat(e.target.value))}
                  placeholder="Ex: 0.3924"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude (GPS)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude || ''}
                  onChange={(e) => updateField('longitude', parseFloat(e.target.value))}
                  placeholder="Ex: 9.4537"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneMain">Téléphone principal *</Label>
                <Input
                  id="phoneMain"
                  value={formData.phoneMain}
                  onChange={(e) => updateField('phoneMain', e.target.value)}
                  placeholder="+241 01-00-00-00"
                />
                {errors.phoneMain && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneMain}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneEmergency">Téléphone urgences</Label>
                <Input
                  id="phoneEmergency"
                  value={formData.phoneEmergency || ''}
                  onChange={(e) => updateField('phoneEmergency', e.target.value)}
                  placeholder="+241 01-00-00-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contact@etablissement.ga"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  value={formData.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://exemple.ga"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="capacity" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalBeds">Nombre de lits</Label>
                <Input
                  id="totalBeds"
                  type="number"
                  min="0"
                  value={formData.totalBeds}
                  onChange={(e) => updateField('totalBeds', parseInt(e.target.value) || 0)}
                />
                {errors.totalBeds && (
                  <p className="text-sm text-red-500 mt-1">{errors.totalBeds}</p>
                )}
              </div>

              <div>
                <Label htmlFor="doctors">Nombre de médecins</Label>
                <Input
                  id="doctors"
                  type="number"
                  min="0"
                  value={formData.doctors}
                  onChange={(e) => updateField('doctors', parseInt(e.target.value) || 0)}
                />
                {errors.doctors && (
                  <p className="text-sm text-red-500 mt-1">{errors.doctors}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nurses">Nombre d'infirmiers</Label>
                <Input
                  id="nurses"
                  type="number"
                  min="0"
                  value={formData.nurses}
                  onChange={(e) => updateField('nurses', parseInt(e.target.value) || 0)}
                />
                {errors.nurses && (
                  <p className="text-sm text-red-500 mt-1">{errors.nurses}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => updateField('isPublic', !!checked)}
                />
                <Label htmlFor="isPublic" className="font-normal">
                  Établissement public
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isEmergencyCenter"
                  checked={formData.isEmergencyCenter}
                  onCheckedChange={(checked) => updateField('isEmergencyCenter', !!checked)}
                />
                <Label htmlFor="isEmergencyCenter" className="font-normal">
                  Service d'urgence disponible
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAmbulance"
                  checked={formData.hasAmbulance}
                  onCheckedChange={(checked) => updateField('hasAmbulance', !!checked)}
                />
                <Label htmlFor="hasAmbulance" className="font-normal">
                  Ambulance disponible
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPharmacy"
                  checked={formData.hasPharmacy}
                  onCheckedChange={(checked) => updateField('hasPharmacy', !!checked)}
                />
                <Label htmlFor="hasPharmacy" className="font-normal">
                  Pharmacie sur site
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLaboratory"
                  checked={formData.hasLaboratory}
                  onCheckedChange={(checked) => updateField('hasLaboratory', !!checked)}
                />
                <Label htmlFor="hasLaboratory" className="font-normal">
                  Laboratoire d'analyses
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div>
              <Label>Assurances acceptées</Label>
              <div className="space-y-2 mt-2">
                {['CNAMGS', 'CNSS', 'Privé'].map(insurance => (
                  <div key={insurance} className="flex items-center space-x-2">
                    <Checkbox
                      id={insurance}
                      checked={formData.insuranceAccepted?.includes(insurance as any) || false}
                      onCheckedChange={() => toggleInsurance(insurance as any)}
                    />
                    <Label htmlFor={insurance} className="font-normal">
                      {insurance}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Services disponibles</Label>
              <div className="space-y-2 mt-2">
                {[
                  'Consultation générale',
                  'Urgences 24/7',
                  'Maternité',
                  'Pédiatrie',
                  'Chirurgie',
                  'Radiologie',
                  'Échographie',
                  'Scanner',
                  'IRM',
                  'Laboratoire',
                  'Pharmacie',
                  'Vaccination',
                  'Dentisterie',
                  'Ophtalmologie',
                  'Cardiologie',
                  'Gynécologie',
                  'Traumatologie',
                  'Réanimation',
                ].map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services?.includes(service) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.services || [];
                        const updated = checked
                          ? [...current, service]
                          : current.filter(s => s !== service);
                        updateField('services', updated);
                      }}
                    />
                    <Label htmlFor={service} className="font-normal">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Créer' : 'Enregistrer'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
