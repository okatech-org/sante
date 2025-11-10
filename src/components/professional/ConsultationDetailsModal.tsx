import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, User, FileText, Stethoscope, 
  ClipboardList, Pill, Printer, Download
} from "lucide-react";
import { Consultation } from "@/hooks/useConsultations";
import { useState } from "react";
import { ElectronicPrescriptionModal } from "./ElectronicPrescriptionModal";
import { toast } from "sonner";

interface ConsultationDetailsModalProps {
  consultation: Consultation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionalId: string;
}

export function ConsultationDetailsModal({ 
  consultation, 
  open, 
  onOpenChange,
  professionalId 
}: ConsultationDetailsModalProps) {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  if (!consultation) return null;

  const date = new Date(consultation.date);

  const handlePrint = () => {
    // Créer une fenêtre d'impression avec contenu formaté
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Consultation - ${consultation.patient}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section-title { font-weight: bold; font-size: 16px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .label { font-weight: bold; min-width: 150px; }
            .value { color: #555; }
            .content-box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Consultation Médicale</h1>
            <p>${date.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} - ${consultation.time}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Informations Patient</div>
            <div class="info-row">
              <span class="label">Patient:</span>
              <span class="value">${consultation.patient}</span>
            </div>
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">${consultation.type}</span>
            </div>
          </div>

          ${consultation.diagnosis ? `
            <div class="section">
              <div class="section-title">Diagnostic</div>
              <div class="content-box">${consultation.diagnosis}</div>
            </div>
          ` : ''}

          ${consultation.notes ? `
            <div class="section">
              <div class="section-title">Notes de Consultation</div>
              <div class="content-box">${consultation.notes.replace(/\n/g, '<br>')}</div>
            </div>
          ` : ''}

          ${consultation.examens && consultation.examens.length > 0 ? `
            <div class="section">
              <div class="section-title">Examens Prescrits</div>
              <ul>
                ${consultation.examens.map(exam => `<li>${exam}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${consultation.prescription ? `
            <div class="section">
              <div class="section-title">Ordonnance</div>
              <p style="color: green;">✓ Ordonnance créée</p>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      toast.success('Ouverture de l\'aperçu d\'impression');
    } else {
      toast.error('Impossible d\'ouvrir la fenêtre d\'impression');
    }
  };

  const handleExportPDF = async () => {
    toast.info('Génération du PDF en cours...', {
      duration: 2000
    });
    
    // Utiliser l'impression pour générer le PDF
    // L'utilisateur peut choisir "Enregistrer en PDF" dans la boîte de dialogue d'impression
    handlePrint();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              Détails de la consultation
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Patient Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{consultation.patient}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {date.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {consultation.time}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type de consultation */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Type de consultation
              </h4>
              <Badge variant="secondary" className="text-sm">
                {consultation.type}
              </Badge>
            </div>

            <Separator />

            {/* Diagnostic */}
            {consultation.diagnosis && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Diagnostic
                </h4>
                <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
                  {consultation.diagnosis}
                </p>
              </div>
            )}

            {/* Notes */}
            {consultation.notes && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Notes de consultation
                </h4>
                <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg whitespace-pre-wrap">
                  {consultation.notes}
                </p>
              </div>
            )}

            {/* Examens */}
            {consultation.examens && consultation.examens.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Examens prescrits
                </h4>
                <ul className="space-y-1">
                  {consultation.examens.map((exam, index) => (
                    <li key={index} className="text-muted-foreground pl-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {exam}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prescription */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Ordonnance
              </h4>
              {consultation.prescription ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Ordonnance créée
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Voir l'ordonnance
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowPrescriptionModal(true)}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Créer une ordonnance
                </Button>
              )}
            </div>

            {/* Prochaine visite */}
            {consultation.nextVisit && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Prochaine visite
                </h4>
                <p className="text-muted-foreground">
                  {new Date(consultation.nextVisit).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ElectronicPrescriptionModal
        open={showPrescriptionModal}
        onOpenChange={setShowPrescriptionModal}
        professionalId={professionalId}
        patientId={consultation.patient}
        teleconsultationId={consultation.id}
      />
    </>
  );
}
