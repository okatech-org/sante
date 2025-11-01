import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  User, Phone, Calendar, MapPin, Heart, FileText,
  CreditCard, AlertCircle, CheckCircle, Search,
  Building, Stethoscope, Bed, Shield, UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { DossierHospitalisation } from '@/types/hospitalisation.types';

interface AdmissionModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: Partial<DossierHospitalisation>) => void;
  origine?: 'hdj' | 'urgences' | 'programmee' | 'transfert';
  patientData?: any;
}

export function AdmissionModal({
  open,
  onClose,
  onComplete,
  origine = 'programmee',
  patientData
}: AdmissionModalProps) {
  const [activeTab, setActiveTab] = useState('patient');
  const [searchQuery, setSearchQuery] = useState('');
  const [patientExistant, setPatientExistant] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Infos patient
    nom: patientData?.nom || '',
    prenom: patientData?.prenom || '',
    dateNaissance: patientData?.dateNaissance || '',
    sexe: patientData?.sexe || 'M',
    telephone: patientData?.telephone || '',
    email: '',
    adresse: '',
    
    // Contact urgence
    contactNom: '',
    contactTelephone: '',
    contactLien: '',
    
    // Admission
    service: '',
    medecin: '',
    motifAdmission: '',
    dateAdmission: new Date().toISOString().split('T')[0],
    dateSortiePrevue: '',
    categoryChambre: 'standard',
    
    // Assurance
    typeAssurance: 'CNAMGS',
    numeroAssure: '',
    
    // Documents
    consentement: false,
    pieceIdentite: false,
    carteAssurance: false,
    
    // Notes
    notes: ''
  });

  const [verificationAssurance, setVerificationAssurance] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const services = [
    'Médecine générale',
    'Chirurgie',
    'Maternité',
    'Pédiatrie',
    'Cardiologie',
    'Neurologie',
    'Orthopédie',
    'Urgences'
  ];

  const medecins = [
    { id: '1', nom: 'Dr. NZENGUE', specialite: 'Cardiologue' },
    { id: '2', nom: 'Dr. MBOUMBA', specialite: 'Gynécologue' },
    { id: '3', nom: 'Dr. OKEMBA', specialite: 'Chirurgien' },
    { id: '4', nom: 'Dr. NGUEMA', specialite: 'Médecin généraliste' }
  ];

  const handleSearchPatient = () => {
    // Simulation recherche patient existant
    if (searchQuery.length > 3) {
      setPatientExistant({
        nom: 'MOUSSAVOU',
        prenom: 'Jean',
        dateNaissance: '1975-03-15',
        telephone: '077123456',
        numeroAssure: 'GA123456789'
      });
      // Pré-remplir le formulaire
      setFormData(prev => ({
        ...prev,
        ...patientExistant,
        numeroAssure: patientExistant.numeroAssure
      }));
      toast.success('Patient trouvé dans la base de données');
    } else {
      toast.error('Aucun patient trouvé');
    }
  };

  const handleVerificationAssurance = async () => {
    setIsVerifying(true);
    // Simulation vérification CNAMGS
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVerificationAssurance({
      statut: 'actif',
      fond: 'Secteur Public',
      plafondAnnuel: 5000000,
      consomme: 1500000,
      plafondRestant: 3500000,
      tauxPriseEnCharge: 80
    });
    setIsVerifying(false);
    toast.success('Droits vérifiés avec succès');
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.nom || !formData.prenom || !formData.service || !formData.medecin) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Création du dossier d'hospitalisation
    const dossier: Partial<DossierHospitalisation> = {
      numeroAdmission: `HOS-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      patientInfo: {
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance,
        sexe: formData.sexe as 'M' | 'F',
        telephone: formData.telephone,
        numeroAssure: formData.numeroAssure,
        contactUrgence: {
          nom: formData.contactNom,
          telephone: formData.contactTelephone,
          lien: formData.contactLien
        }
      },
      origine: origine,
      dateAdmission: formData.dateAdmission,
      dateSortiePrevue: formData.dateSortiePrevue,
      service: formData.service,
      motifAdmission: formData.motifAdmission,
      statut: 'pre_admission',
      notes: formData.notes ? [formData.notes] : []
    };

    onComplete(dossier);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Nouvelle Admission Hospitalisation
            {origine !== 'programmee' && (
              <Badge variant={origine === 'urgences' ? 'destructive' : 'secondary'}>
                {origine === 'urgences' && '🚨 Depuis Urgences'}
                {origine === 'hdj' && '🏥 Depuis HDJ'}
                {origine === 'transfert' && '↔️ Transfert'}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="assurance">Assurance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="patient" className="space-y-4">
            {/* Recherche patient existant */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rechercher patient existant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom, téléphone ou numéro CNAMGS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearchPatient} variant="secondary">
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                </div>
                {patientExistant && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      ✓ Patient trouvé : {patientExistant.nom} {patientExistant.prenom}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations patient */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    placeholder="Nom de famille"
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    placeholder="Prénom(s)"
                  />
                </div>
                <div>
                  <Label htmlFor="dateNaissance">Date de naissance *</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Sexe *</Label>
                  <RadioGroup 
                    value={formData.sexe}
                    onValueChange={(value) => setFormData({...formData, sexe: value})}
                  >
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="homme" />
                        <Label htmlFor="homme">Homme</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="femme" />
                        <Label htmlFor="femme">Femme</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    placeholder="077 XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    placeholder="Adresse complète"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact d'urgence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contact d'urgence</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactNom">Nom complet *</Label>
                  <Input
                    id="contactNom"
                    value={formData.contactNom}
                    onChange={(e) => setFormData({...formData, contactNom: e.target.value})}
                    placeholder="Nom et prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="contactTelephone">Téléphone *</Label>
                  <Input
                    id="contactTelephone"
                    value={formData.contactTelephone}
                    onChange={(e) => setFormData({...formData, contactTelephone: e.target.value})}
                    placeholder="077 XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="contactLien">Lien avec le patient *</Label>
                  <Select
                    value={formData.contactLien}
                    onValueChange={(value) => setFormData({...formData, contactLien: value})}
                  >
                    <SelectTrigger id="contactLien">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="epoux">Époux/Épouse</SelectItem>
                      <SelectItem value="enfant">Enfant</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="frere_soeur">Frère/Sœur</SelectItem>
                      <SelectItem value="ami">Ami(e)</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admission" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Détails de l'admission</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service">Service *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({...formData, service: value})}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medecin">Médecin traitant *</Label>
                  <Select
                    value={formData.medecin}
                    onValueChange={(value) => setFormData({...formData, medecin: value})}
                  >
                    <SelectTrigger id="medecin">
                      <SelectValue placeholder="Sélectionner un médecin" />
                    </SelectTrigger>
                    <SelectContent>
                      {medecins.map(medecin => (
                        <SelectItem key={medecin.id} value={medecin.nom}>
                          {medecin.nom} - {medecin.specialite}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateAdmission">Date d'admission *</Label>
                  <Input
                    id="dateAdmission"
                    type="date"
                    value={formData.dateAdmission}
                    onChange={(e) => setFormData({...formData, dateAdmission: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateSortiePrevue">Date sortie prévue</Label>
                  <Input
                    id="dateSortiePrevue"
                    type="date"
                    value={formData.dateSortiePrevue}
                    onChange={(e) => setFormData({...formData, dateSortiePrevue: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="motifAdmission">Motif d'admission *</Label>
                  <Textarea
                    id="motifAdmission"
                    value={formData.motifAdmission}
                    onChange={(e) => setFormData({...formData, motifAdmission: e.target.value})}
                    placeholder="Décrivez le motif de l'hospitalisation"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Catégorie de chambre souhaitée</Label>
                  <RadioGroup 
                    value={formData.categoryChambre}
                    onValueChange={(value) => setFormData({...formData, categoryChambre: value})}
                  >
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="superieure" id="superieure" />
                        <Label htmlFor="superieure">Supérieure</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vip" id="vip" />
                        <Label htmlFor="vip">VIP</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suite" id="suite" />
                        <Label htmlFor="suite">Suite</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assurance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informations assurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typeAssurance">Type d'assurance</Label>
                    <Select
                      value={formData.typeAssurance}
                      onValueChange={(value) => setFormData({...formData, typeAssurance: value})}
                    >
                      <SelectTrigger id="typeAssurance">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNAMGS">CNAMGS</SelectItem>
                        <SelectItem value="CNSS">CNSS</SelectItem>
                        <SelectItem value="privee">Assurance privée</SelectItem>
                        <SelectItem value="aucune">Aucune assurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="numeroAssure">Numéro assuré</Label>
                    <Input
                      id="numeroAssure"
                      value={formData.numeroAssure}
                      onChange={(e) => setFormData({...formData, numeroAssure: e.target.value})}
                      placeholder="GA123456789"
                    />
                  </div>
                </div>

                {formData.numeroAssure && (
                  <Button 
                    onClick={handleVerificationAssurance}
                    disabled={isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? (
                      <>Vérification en cours...</>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Vérifier les droits
                      </>
                    )}
                  </Button>
                )}

                {verificationAssurance && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Droits vérifiés avec succès
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Statut:</span>
                        <span className="ml-2 font-medium">{verificationAssurance.statut}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fond:</span>
                        <span className="ml-2 font-medium">{verificationAssurance.fond}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Plafond restant:</span>
                        <span className="ml-2 font-medium">
                          {new Intl.NumberFormat('fr-GA').format(verificationAssurance.plafondRestant)} FCFA
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Taux PEC:</span>
                        <span className="ml-2 font-medium">{verificationAssurance.tauxPriseEnCharge}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Documents requis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consentement"
                      checked={formData.consentement}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, consentement: checked as boolean})
                      }
                    />
                    <Label htmlFor="consentement" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Consentement aux soins signé
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pieceIdentite"
                      checked={formData.pieceIdentite}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, pieceIdentite: checked as boolean})
                      }
                    />
                    <Label htmlFor="pieceIdentite" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Pièce d'identité (copie)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="carteAssurance"
                      checked={formData.carteAssurance}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, carteAssurance: checked as boolean})
                      }
                    />
                    <Label htmlFor="carteAssurance" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Carte d'assurance
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes additionnelles</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Informations supplémentaires..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Confirmer l'admission
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
