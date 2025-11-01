import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download, FileText, User, Stethoscope, CreditCard,
  CheckCircle, Loader2, AlertCircle, File, Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DossierHDJ {
  id: string;
  patient: string;
  service: string;
  medecin: string;
  heure: string;
  status: 'en_attente' | 'en_cours' | 'termine' | 'annule';
  cnamgs: 'verifie' | 'non_verifie' | 'rejete';
  reste: number;
  dateCreation: string;
  motif: string;
  diagnostics?: string[];
  prescriptions?: string[];
}

interface TelechargerDossierModalProps {
  open: boolean;
  onClose: () => void;
  dossier: DossierHDJ;
}

export function TelechargerDossierModal({
  open,
  onClose,
  dossier
}: TelechargerDossierModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [sections, setSections] = useState({
    infosGenerales: true,
    motifConsultation: true,
    diagnostics: true,
    prescriptions: true,
    financier: true,
    cnamgs: true
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const allSectionsSelected = Object.values(sections).every(v => v);
  const someSectionsSelected = Object.values(sections).some(v => v);

  const toggleAll = () => {
    const newValue = !allSectionsSelected;
    setSections({
      infosGenerales: newValue,
      motifConsultation: newValue,
      diagnostics: newValue,
      prescriptions: newValue,
      financier: newValue,
      cnamgs: newValue
    });
  };

  const handleGenerate = async () => {
    if (!someSectionsSelected) {
      toast.error('Veuillez sélectionner au moins une section');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulation génération PDF
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simuler téléchargement
      const filename = `${dossier.id}_${dossier.patient.replace(/\s/g, '_')}.${format}`;
      
      toast.success(`${format.toUpperCase()} généré avec succès`);
      toast.info(`Téléchargement : ${filename}`);

      // Ici, on créerait le vrai PDF avec jsPDF ou similaire
      // const blob = generatePDF(dossier, sections);
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = filename;
      // a.click();

      setTimeout(() => onClose(), 1000);

    } catch (err) {
      toast.error('Erreur lors de la génération du document');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSectionsCount = () => Object.values(sections).filter(v => v).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Télécharger le dossier {dossier.id}
          </DialogTitle>
          <DialogDescription>
            Choisissez le format et les sections à inclure dans l'export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations dossier */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Patient</p>
                  <p className="font-semibold">{dossier.patient}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Service</p>
                  <p className="font-semibold">{dossier.service}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Médecin</p>
                  <p className="font-semibold">{dossier.medecin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format d'export */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Format d'export</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={format === 'pdf' ? 'default' : 'outline'}
                onClick={() => setFormat('pdf')}
                className="justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF (Recommandé)
              </Button>
              <Button
                type="button"
                variant={format === 'excel' ? 'default' : 'outline'}
                onClick={() => setFormat('excel')}
                className="justify-start"
              >
                <File className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>

          {/* Sélection sections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Sections à inclure</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleAll}
                className="text-xs"
              >
                {allSectionsSelected ? 'Tout déselectionner' : 'Tout sélectionner'}
              </Button>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="infosGenerales"
                    checked={sections.infosGenerales}
                    onCheckedChange={() => toggleSection('infosGenerales')}
                  />
                  <Label 
                    htmlFor="infosGenerales" 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    Informations générales du patient
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="motifConsultation"
                    checked={sections.motifConsultation}
                    onCheckedChange={() => toggleSection('motifConsultation')}
                  />
                  <Label 
                    htmlFor="motifConsultation" 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <FileText className="h-4 w-4 text-purple-600" />
                    Motif de consultation
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="diagnostics"
                    checked={sections.diagnostics}
                    onCheckedChange={() => toggleSection('diagnostics')}
                    disabled={!dossier.diagnostics || dossier.diagnostics.length === 0}
                  />
                  <Label 
                    htmlFor="diagnostics" 
                    className={cn(
                      "flex items-center gap-2 cursor-pointer flex-1",
                      (!dossier.diagnostics || dossier.diagnostics.length === 0) && "opacity-50"
                    )}
                  >
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    Diagnostics
                    {dossier.diagnostics && dossier.diagnostics.length > 0 && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {dossier.diagnostics.length}
                      </Badge>
                    )}
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="prescriptions"
                    checked={sections.prescriptions}
                    onCheckedChange={() => toggleSection('prescriptions')}
                    disabled={!dossier.prescriptions || dossier.prescriptions.length === 0}
                  />
                  <Label 
                    htmlFor="prescriptions" 
                    className={cn(
                      "flex items-center gap-2 cursor-pointer flex-1",
                      (!dossier.prescriptions || dossier.prescriptions.length === 0) && "opacity-50"
                    )}
                  >
                    <FileText className="h-4 w-4 text-orange-600" />
                    Prescriptions
                    {dossier.prescriptions && dossier.prescriptions.length > 0 && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {dossier.prescriptions.length}
                      </Badge>
                    )}
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="financier"
                    checked={sections.financier}
                    onCheckedChange={() => toggleSection('financier')}
                  />
                  <Label 
                    htmlFor="financier" 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    Informations financières
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="cnamgs"
                    checked={sections.cnamgs}
                    onCheckedChange={() => toggleSection('cnamgs')}
                    disabled={dossier.cnamgs !== 'verifie'}
                  />
                  <Label 
                    htmlFor="cnamgs" 
                    className={cn(
                      "flex items-center gap-2 cursor-pointer flex-1",
                      dossier.cnamgs !== 'verifie' && "opacity-50"
                    )}
                  >
                    <CheckCircle className="h-4 w-4 text-teal-600" />
                    Informations CNAMGS
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">Aperçu de l'export</div>
              <div className="text-sm">
                Format : <strong>{format.toUpperCase()}</strong> • 
                Sections : <strong>{getSectionsCount()}/6</strong> • 
                Taille estimée : <strong>~{getSectionsCount() * 50} Ko</strong>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Annuler
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !someSectionsSelected}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Générer et télécharger
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
