import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, User, Calendar, Clock, Stethoscope, Phone,
  CreditCard, Shield, CheckCircle, AlertTriangle, Printer,
  Edit, Download, X, Activity, DollarSign, MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

interface VoirDossierHDJModalProps {
  open: boolean;
  onClose: () => void;
  dossier: DossierHDJ;
  onEdit?: () => void;
  onDownload?: () => void;
}

export function VoirDossierHDJModal({
  open,
  onClose,
  dossier,
  onEdit,
  onDownload
}: VoirDossierHDJModalProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'termine': return 'bg-green-500 text-white';
      case 'en_cours': return 'bg-blue-500 text-white';
      case 'en_attente': return 'bg-yellow-500 text-white';
      case 'annule': return 'bg-gray-500 text-white';
      default: return '';
    }
  };

  const getCnamgsColor = (status: string) => {
    switch(status) {
      case 'verifie': return 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30';
      case 'rejete': return 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30';
      case 'non_verifie': return 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950/30';
      default: return '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GA').format(amount) + ' FCFA';
  };

  const handlePrint = () => {
    toast.info('Impression du dossier...');
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Dossier {dossier.id}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(dossier.status)}>
                {dossier.status === 'termine' && 'Terminé'}
                {dossier.status === 'en_cours' && 'En cours'}
                {dossier.status === 'en_attente' && 'En attente'}
                {dossier.status === 'annule' && 'Annulé'}
              </Badge>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription>
            Détails du dossier et informations patient.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="medical">Médical</TabsTrigger>
            <TabsTrigger value="financier">Financier</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="general" className="space-y-4">
              {/* Informations patient */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations Patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nom complet</p>
                    <p className="font-semibold">{dossier.patient}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {dossier.service}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date de création</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(dossier.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Heure RDV</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {dossier.heure}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informations médicales de base */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Médecin traitant</p>
                    <p className="font-semibold">{dossier.medecin}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Motif de consultation</p>
                    <p className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
                      {dossier.motif}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Statut CNAMGS */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Assurance Maladie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className={cn("text-sm px-3 py-1", getCnamgsColor(dossier.cnamgs))}>
                    {dossier.cnamgs === 'verifie' && (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        CNAMGS Vérifié
                      </>
                    )}
                    {dossier.cnamgs === 'rejete' && (
                      <>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        CNAMGS Rejeté
                      </>
                    )}
                    {dossier.cnamgs === 'non_verifie' && (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        En attente de vérification
                      </>
                    )}
                  </Badge>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              {/* Diagnostics */}
              {dossier.diagnostics && dossier.diagnostics.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Diagnostics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {dossier.diagnostics.map((diag, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{diag}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Prescriptions */}
              {dossier.prescriptions && dossier.prescriptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Prescriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {dossier.prescriptions.map((presc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-sm">{presc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {(!dossier.diagnostics || dossier.diagnostics.length === 0) && 
               (!dossier.prescriptions || dossier.prescriptions.length === 0) && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucune donnée médicale enregistrée
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Les informations seront ajoutées après la consultation
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="financier" className="space-y-4">
              {/* Reste à charge */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Facturation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Reste à charge patient</p>
                    <p className={cn(
                      "text-3xl font-bold",
                      dossier.reste === 0 ? "text-green-600" : "text-orange-600"
                    )}>
                      {formatCurrency(dossier.reste)}
                    </p>
                    {dossier.reste === 0 && (
                      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Facture réglée
                      </p>
                    )}
                  </div>

                  {/* Détail si CNAMGS vérifié */}
                  {dossier.cnamgs === 'verifie' && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
                        <p className="text-muted-foreground">Prise en charge CNAMGS</p>
                        <p className="font-semibold">80%</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
                        <p className="text-muted-foreground">Ticket modérateur</p>
                        <p className="font-semibold">20%</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Créé le {format(new Date(dossier.dateCreation), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            {onEdit && dossier.status !== 'termine' && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            )}
            {onDownload && (
              <Button variant="default" size="sm" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
