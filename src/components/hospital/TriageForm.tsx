import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { 
  AlertTriangle, User, Activity, Thermometer, 
  Heart, Droplets, Wind, Gauge, AlertCircle,
  Zap, Clock, CheckCircle, Info
} from 'lucide-react';
import { 
  DossierUrgence, 
  NiveauGravite, 
  ConstantesVitales,
  NIVEAUX_GRAVITE,
  formatNumeroDossier 
} from '@/types/accueil.types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TriageFormProps {
  open: boolean;
  onClose: () => void;
  onComplete: (dossier: DossierUrgence) => void;
  urgenceVitale?: boolean;
}

export function TriageForm({ open, onClose, onComplete, urgenceVitale = false }: TriageFormProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    sexe: 'M' as 'M' | 'F',
    motifConsultation: '',
    niveauGravite: urgenceVitale ? 1 : 3 as NiveauGravite
  });

  const [constantesVitales, setConstantesVitales] = useState<ConstantesVitales>({
    tensionArterielle: { systolique: 120, diastolique: 80 },
    frequenceCardiaque: 70,
    temperature: 37,
    saturationO2: 98,
    douleur: 0,
    frequenceRespiratoire: 16
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConstantes, setShowConstantes] = useState(formData.niveauGravite <= 3);

  // Suggestions de motifs fréquents
  const motifsFrequents = [
    'Douleur thoracique',
    'Détresse respiratoire',
    'Trauma crânien',
    'Douleur abdominale',
    'Fièvre élevée',
    'Traumatisme membre',
    'Malaise',
    'Convulsions',
    'Hémorragie',
    'Intoxication'
  ];

  const handleSubmit = async () => {
    // Validation
    if (!formData.nom || !formData.motifConsultation) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler la création du dossier
      await new Promise(resolve => setTimeout(resolve, 500));

      const sequence = Math.floor(Math.random() * 999) + 1;
      const numeroDossier = formatNumeroDossier('URG', new Date(), sequence);

      const dossier: DossierUrgence = {
        id: `urg-${Date.now()}`,
        numeroDossier,
        patientInfo: {
          nom: formData.nom,
          prenom: formData.prenom,
          age: formData.age ? parseInt(formData.age) : undefined,
          sexe: formData.sexe
        },
        heureArrivee: new Date().toISOString(),
        motifConsultation: formData.motifConsultation,
        niveauGravite: formData.niveauGravite,
        constantesVitales: showConstantes ? constantesVitales : undefined,
        statut: formData.niveauGravite === 1 ? 'en_consultation' : 'en_attente',
        boxId: formData.niveauGravite === 1 ? 'reanimation-1' : undefined,
        enregistrementAdminComplet: false,
        notes: [],
        alertes: formData.niveauGravite === 1 ? ['URGENCE VITALE'] : [],
        tempsAttente: 0,
        delaiMaximal: NIVEAUX_GRAVITE[formData.niveauGravite].delaiMaximal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transitions: [{
          statut: formData.niveauGravite === 1 ? 'en_consultation' : 'en_attente',
          timestamp: new Date().toISOString(),
          userId: 'user-1'
        }]
      };

      onComplete(dossier);
    } catch (error) {
      toast.error('Erreur lors de la création du dossier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNiveauChange = (niveau: string) => {
    const niveauNum = parseInt(niveau) as NiveauGravite;
    setFormData(prev => ({ ...prev, niveauGravite: niveauNum }));
    setShowConstantes(niveauNum <= 3);
  };

  const getSliderColor = (value: number, type: 'douleur' | 'saturation' | 'temperature') => {
    if (type === 'douleur') {
      if (value <= 3) return 'bg-green-500';
      if (value <= 6) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (type === 'saturation') {
      if (value >= 95) return 'bg-green-500';
      if (value >= 90) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (type === 'temperature') {
      if (value >= 36 && value <= 37.5) return 'bg-green-500';
      if (value >= 37.6 && value <= 38.5) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    return 'bg-gray-500';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {urgenceVitale ? (
              <>
                <Zap className="h-6 w-6 text-red-500 animate-pulse" />
                Triage URGENCE VITALE
              </>
            ) : (
              <>
                <Activity className="h-6 w-6 text-primary" />
                Triage nouveau patient
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations patient */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations patient
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Nom *</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value.toUpperCase() }))}
                  placeholder="NOM"
                  className={urgenceVitale ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <Label>Prénom</Label>
                <Input
                  value={formData.prenom}
                  onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <Label>Âge</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Âge"
                />
              </div>
              <div>
                <Label>Sexe</Label>
                <RadioGroup 
                  value={formData.sexe} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sexe: value as 'M' | 'F' }))}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="M" id="M" />
                    <Label htmlFor="M" className="ml-2 cursor-pointer">M</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="F" id="F" />
                    <Label htmlFor="F" className="ml-2 cursor-pointer">F</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Motif de consultation */}
          <div className="space-y-4">
            <Label>Motif de consultation *</Label>
            <Textarea
              value={formData.motifConsultation}
              onChange={(e) => setFormData(prev => ({ ...prev, motifConsultation: e.target.value }))}
              placeholder="Décrire le motif principal..."
              rows={3}
              className={urgenceVitale ? 'border-red-500' : ''}
            />
            
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {motifsFrequents.map(motif => (
                <Button
                  key={motif}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, motifConsultation: motif }))}
                >
                  {motif}
                </Button>
              ))}
            </div>
          </div>

          {/* Niveau de gravité */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Niveau de gravité
            </h4>

            <RadioGroup 
              value={formData.niveauGravite.toString()} 
              onValueChange={handleNiveauChange}
            >
              <div className="space-y-3">
                {Object.entries(NIVEAUX_GRAVITE).map(([niveau, info]) => (
                  <Card 
                    key={niveau}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      formData.niveauGravite === parseInt(niveau) && "ring-2 ring-primary"
                    )}
                    onClick={() => handleNiveauChange(niveau)}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={niveau} id={`niveau-${niveau}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full bg-${info.couleur}-500`} />
                          <Label htmlFor={`niveau-${niveau}`} className="cursor-pointer">
                            <strong>Niveau {niveau}</strong> - {info.label}
                          </Label>
                          {info.delaiMaximal === 0 && (
                            <Badge variant="destructive" className="ml-2">Immédiat</Badge>
                          )}
                          {info.delaiMaximal > 0 && (
                            <Badge variant="outline" className="ml-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {info.delaiMaximal} min max
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Exemples : {info.exemples.join(', ')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Constantes vitales (optionnelles sauf niveaux 1-3) */}
          {showConstantes && (
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Constantes vitales
                {formData.niveauGravite > 3 && (
                  <Badge variant="secondary">Optionnel</Badge>
                )}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tension artérielle */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Tension artérielle
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={constantesVitales.tensionArterielle?.systolique}
                      onChange={(e) => setConstantesVitales(prev => ({
                        ...prev,
                        tensionArterielle: {
                          ...prev.tensionArterielle!,
                          systolique: parseInt(e.target.value)
                        }
                      }))}
                      className="w-20"
                      placeholder="120"
                    />
                    <span>/</span>
                    <Input
                      type="number"
                      value={constantesVitales.tensionArterielle?.diastolique}
                      onChange={(e) => setConstantesVitales(prev => ({
                        ...prev,
                        tensionArterielle: {
                          ...prev.tensionArterielle!,
                          diastolique: parseInt(e.target.value)
                        }
                      }))}
                      className="w-20"
                      placeholder="80"
                    />
                    <span className="text-sm text-muted-foreground">mmHg</span>
                  </div>
                </div>

                {/* Fréquence cardiaque */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Fréquence cardiaque
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={constantesVitales.frequenceCardiaque}
                      onChange={(e) => setConstantesVitales(prev => ({
                        ...prev,
                        frequenceCardiaque: parseInt(e.target.value)
                      }))}
                      className="w-24"
                      placeholder="70"
                    />
                    <span className="text-sm text-muted-foreground">bpm</span>
                  </div>
                </div>

                {/* Température */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Température
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      step="0.1"
                      value={constantesVitales.temperature}
                      onChange={(e) => setConstantesVitales(prev => ({
                        ...prev,
                        temperature: parseFloat(e.target.value)
                      }))}
                      className="w-24"
                      placeholder="37.0"
                    />
                    <span className="text-sm text-muted-foreground">°C</span>
                  </div>
                </div>

                {/* Saturation O2 */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Saturation O2
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={constantesVitales.saturationO2}
                      onChange={(e) => setConstantesVitales(prev => ({
                        ...prev,
                        saturationO2: parseInt(e.target.value)
                      }))}
                      className="w-24"
                      placeholder="98"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>

                {/* Fréquence respiratoire */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    Fréquence respiratoire
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={constantesVitales.frequenceRespiratoire}
                      onChange={(e) => setConstantesVitales(prev => ({
                        ...prev,
                        frequenceRespiratoire: parseInt(e.target.value)
                      }))}
                      className="w-24"
                      placeholder="16"
                    />
                    <span className="text-sm text-muted-foreground">/min</span>
                  </div>
                </div>

                {/* Échelle de douleur */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Douleur (0-10)
                  </Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={constantesVitales.douleur}
                      onChange={(e) => setConstantesVitales(prev => ({
                        ...prev,
                        douleur: parseInt(e.target.value)
                      }))}
                      className="flex-1"
                    />
                    <span className={cn(
                      "font-bold text-lg w-8 text-center",
                      constantesVitales.douleur! <= 3 && "text-green-600",
                      constantesVitales.douleur! > 3 && constantesVitales.douleur! <= 6 && "text-yellow-600",
                      constantesVitales.douleur! > 6 && "text-red-600"
                    )}>
                      {constantesVitales.douleur}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>😊 Aucune</span>
                    <span>😐 Modérée</span>
                    <span>😣 Intense</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alerte pour niveau 1-2 */}
          {formData.niveauGravite <= 2 && (
            <Alert variant={formData.niveauGravite === 1 ? "destructive" : "warning"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {formData.niveauGravite === 1 ? (
                  <strong>URGENCE VITALE - Le patient sera pris en charge immédiatement en réanimation</strong>
                ) : (
                  <strong>Très urgent - Le médecin urgentiste sera notifié immédiatement</strong>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.nom || !formData.motifConsultation}
            variant={formData.niveauGravite === 1 ? "destructive" : "default"}
          >
            {isSubmitting ? "Création..." : formData.niveauGravite === 1 ? "URGENCE VITALE - Créer" : "Créer dossier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
