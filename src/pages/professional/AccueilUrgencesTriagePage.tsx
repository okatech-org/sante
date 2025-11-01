import { useState, useEffect } from 'react';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, User, Heart, Thermometer, Activity, Loader2, CheckCircle, Save, FileText, X, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface TriageForm {
  nom: string;
  prenom: string;
  age: string;
  sexe: 'M' | 'F';
  telephone: string;
  motif: string;
  gravite: string;
  constantes: {
    tensionArterielle: string;
    frequenceCardiaque: string;
    temperature: string;
    saturationO2: string;
    douleur: string;
  };
  notes: string;
}

export default function AccueilUrgencesTriagePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TriageForm>({
    nom: '',
    prenom: '',
    age: '',
    sexe: 'M',
    telephone: '',
    motif: '',
    gravite: '3',
    constantes: {
      tensionArterielle: '',
      frequenceCardiaque: '',
      temperature: '',
      saturationO2: '',
      douleur: ''
    },
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isUrgenceVitale, setIsUrgenceVitale] = useState(false);

  const niveauxGravite = [
    { value: '1', label: 'Niveau 1 - Urgence vitale', color: 'bg-red-600', desc: 'Réanimation immédiate' },
    { value: '2', label: 'Niveau 2 - Très urgent', color: 'bg-orange-600', desc: 'Prise en charge < 10 min' },
    { value: '3', label: 'Niveau 3 - Urgent', color: 'bg-yellow-600', desc: 'Prise en charge < 60 min' },
    { value: '4', label: 'Niveau 4 - Peu urgent', color: 'bg-green-600', desc: 'Prise en charge < 2h' },
    { value: '5', label: 'Niveau 5 - Non urgent', color: 'bg-blue-600', desc: 'Peut attendre ou réorientation' }
  ];

  // Détection des changements
  useEffect(() => {
    const hasChanged = Object.values(formData).some(value => {
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object') return Object.values(value).some(v => v.trim() !== '');
      return false;
    });
    setIsDirty(hasChanged);
  }, [formData]);

  // Charger brouillon si disponible
  useEffect(() => {
    const savedDraft = localStorage.getItem('triage_brouillon');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
        toast.info('Brouillon restauré');
      } catch (err) {
        localStorage.removeItem('triage_brouillon');
      }
    }
  }, []);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    
    if (!formData.age.trim()) {
      newErrors.age = 'L\'âge est obligatoire';
    } else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) < 0 || parseInt(formData.age) > 120) {
      newErrors.age = 'Âge invalide (0-120 ans)';
    }
    
    if (!formData.motif.trim()) newErrors.motif = 'Le motif est obligatoire';
    
    if (formData.telephone.trim()) {
      const phoneRegex = /^(06|07)\d{7}$/;
      if (!phoneRegex.test(formData.telephone.replace(/\s/g, ''))) {
        newErrors.telephone = 'Format téléphone invalide';
      }
    }

    // Constantes obligatoires pour niveaux critiques
    if (['1', '2', '3'].includes(formData.gravite)) {
      if (!formData.constantes.tensionArterielle.trim()) {
        newErrors.tensionArterielle = 'Obligatoire pour ce niveau';
      }
      if (!formData.constantes.frequenceCardiaque.trim()) {
        newErrors.frequenceCardiaque = 'Obligatoire pour ce niveau';
      }
      if (!formData.constantes.temperature.trim()) {
        newErrors.temperature = 'Obligatoire pour ce niveau';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestionnaires d'événements
  const handleUrgenceVitale = async () => {
    setIsUrgenceVitale(true);
    setFormData(prev => ({ ...prev, gravite: '1' }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('🚨 URGENCE VITALE - Équipe médicale alertée');
    } catch (err) {
      toast.error('Erreur lors de l\'alerte d\'urgence vitale');
    }
  };

  const handleSauvegarderBrouillon = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('triage_brouillon', JSON.stringify(formData));
      toast.success('Brouillon sauvegardé');
      setIsDirty(false);
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleValiderTriage = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const numeroDossier = `URG-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      setSuccess(`Dossier ${numeroDossier} créé - Patient ${formData.nom} ${formData.prenom}`);
      toast.success(`Patient enregistré: ${numeroDossier}`);
      
      localStorage.removeItem('triage_brouillon');
      setTimeout(() => navigate('/professional/accueil-urgences'), 2000);
      
    } catch (err) {
      toast.error('Erreur lors du triage');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnuler = () => {
    if (isDirty && !confirm('Modifications non sauvées. Continuer ?')) return;
    localStorage.removeItem('triage_brouillon');
    navigate('/professional/accueil-urgences');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateConstantes = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      constantes: { ...prev.constantes, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Messages */}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {isUrgenceVitale && (
          <Alert variant="destructive" className="animate-pulse">
            <Siren className="h-4 w-4" />
            <AlertDescription>
              🚨 MODE URGENCE VITALE - Équipe notifiée
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Triage Rapide</h1>
            <p className="text-muted-foreground">Évaluation et orientation des patients urgents</p>
          </div>
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleUrgenceVitale}
            disabled={isUrgenceVitale}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            {isUrgenceVitale ? 'URGENCE VITALE ACTIVÉE' : 'URGENCE VITALE'}
          </Button>
        </div>

        {/* Formulaire de triage */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations patient */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Identification du patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input 
                    id="nom" 
                    placeholder="Nom du patient" 
                    value={formData.nom}
                    onChange={(e) => updateFormData('nom', e.target.value.toUpperCase())}
                    className={errors.nom ? 'border-red-500' : ''}
                  />
                  {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input 
                    id="prenom" 
                    placeholder="Prénom" 
                    value={formData.prenom}
                    onChange={(e) => updateFormData('prenom', e.target.value)}
                    className={errors.prenom ? 'border-red-500' : ''}
                  />
                  {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Âge *</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="Âge" 
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
                </div>
                <div>
                  <Label>Sexe *</Label>
                  <RadioGroup 
                    value={formData.sexe} 
                    onValueChange={(value) => updateFormData('sexe', value)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="M" />
                      <Label htmlFor="M">Masculin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="F" />
                      <Label htmlFor="F">Féminin</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input 
                  id="telephone" 
                  placeholder="077 XX XX XX" 
                  value={formData.telephone}
                  onChange={(e) => updateFormData('telephone', e.target.value)}
                  className={errors.telephone ? 'border-red-500' : ''}
                />
                {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>}
              </div>
              <div>
                <Label htmlFor="motif">Motif de consultation *</Label>
                <Textarea 
                  id="motif" 
                  placeholder="Décrire le motif..." 
                  rows={3}
                  value={formData.motif}
                  onChange={(e) => updateFormData('motif', e.target.value)}
                  className={errors.motif ? 'border-red-500' : ''}
                />
                {errors.motif && <p className="text-xs text-red-500 mt-1">{errors.motif}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Gravité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Niveau de gravité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.gravite} 
                onValueChange={(value) => updateFormData('gravite', value)}
              >
                {niveauxGravite.map((niveau) => (
                  <div key={niveau.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={niveau.value} id={`gravite-${niveau.value}`} />
                    <Label htmlFor={`gravite-${niveau.value}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${niveau.color}`} />
                        <span className="font-semibold">{niveau.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{niveau.desc}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Constantes vitales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Constantes vitales
              {['1', '2', '3'].includes(formData.gravite) && (
                <Badge variant="destructive" className="text-xs">
                  OBLIGATOIRE
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              <div>
                <Label htmlFor="ta">Tension *</Label>
                <Input 
                  id="ta" 
                  placeholder="120/80" 
                  value={formData.constantes.tensionArterielle}
                  onChange={(e) => updateConstantes('tensionArterielle', e.target.value)}
                  className={errors.tensionArterielle ? 'border-red-500' : ''}
                />
                {errors.tensionArterielle && <p className="text-xs text-red-500">{errors.tensionArterielle}</p>}
              </div>
              <div>
                <Label htmlFor="fc">FC (bpm) *</Label>
                <Input 
                  id="fc" 
                  type="number" 
                  placeholder="80" 
                  value={formData.constantes.frequenceCardiaque}
                  onChange={(e) => updateConstantes('frequenceCardiaque', e.target.value)}
                  className={errors.frequenceCardiaque ? 'border-red-500' : ''}
                />
                {errors.frequenceCardiaque && <p className="text-xs text-red-500">{errors.frequenceCardiaque}</p>}
              </div>
              <div>
                <Label htmlFor="temp">Temp (°C) *</Label>
                <Input 
                  id="temp" 
                  type="number" 
                  step="0.1" 
                  placeholder="37.0" 
                  value={formData.constantes.temperature}
                  onChange={(e) => updateConstantes('temperature', e.target.value)}
                  className={errors.temperature ? 'border-red-500' : ''}
                />
                {errors.temperature && <p className="text-xs text-red-500">{errors.temperature}</p>}
              </div>
              <div>
                <Label htmlFor="spo2">SpO₂ (%)</Label>
                <Input 
                  id="spo2" 
                  type="number" 
                  placeholder="98" 
                  value={formData.constantes.saturationO2}
                  onChange={(e) => updateConstantes('saturationO2', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="douleur">Douleur (0-10)</Label>
                <Input 
                  id="douleur" 
                  type="number" 
                  min="0" 
                  max="10" 
                  placeholder="5" 
                  value={formData.constantes.douleur}
                  onChange={(e) => updateConstantes('douleur', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes et actions */}
        <Card>
          <CardHeader>
            <CardTitle>Notes complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Antécédents, allergies, observations..." 
              rows={4}
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={handleAnnuler}
                disabled={isSubmitting || isSaving}
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSauvegarderBrouillon}
                disabled={isSubmitting || isSaving || !isDirty}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Brouillon
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleValiderTriage}
                disabled={isSubmitting || isSaving}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Valider triage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques - Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {niveauxGravite.map((niveau, index) => (
                <div key={niveau.value} className="text-center">
                  <div className={`h-2 ${niveau.color} rounded-full mb-2`} />
                  <div className="font-bold text-2xl">{[8, 5, 12, 7, 3][index]}</div>
                  <div className="text-xs text-muted-foreground">Niveau {niveau.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}