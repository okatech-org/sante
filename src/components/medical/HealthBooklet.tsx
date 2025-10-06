import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Download, Calendar, User, Activity } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface HealthBookletProps {
  profile: any;
  medicalHistory: any[];
  treatments: any[];
  consultations: any[];
}

export const HealthBooklet = ({ profile, medicalHistory, treatments, consultations }: HealthBookletProps) => {
  
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Titre
      doc.setFontSize(20);
      doc.setTextColor(0, 212, 255);
      doc.text("Carnet de Santé", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      // Informations patient
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Patient: ${profile?.full_name || 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`Date de naissance: ${profile?.birth_date ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr }) : 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`Groupe sanguin: ${profile?.blood_group || 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`N° CNAMGS: ${profile?.cnamgs_number || 'N/A'}`, 20, yPos);
      yPos += 15;

      // Antécédents médicaux
      doc.setFontSize(14);
      doc.setTextColor(255, 0, 136);
      doc.text("Antécédents Médicaux", 20, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      if (medicalHistory.length === 0) {
        doc.text("Aucun antécédent médical", 25, yPos);
        yPos += 8;
      } else {
        medicalHistory.forEach((item) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`• ${item.condition_name} - ${item.status}`, 25, yPos);
          yPos += 6;
          if (item.diagnosed_date) {
            doc.text(`  Diagnostiqué le: ${format(new Date(item.diagnosed_date), "dd/MM/yyyy", { locale: fr })}`, 25, yPos);
            yPos += 6;
          }
        });
      }
      yPos += 10;

      // Traitements
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setTextColor(0, 136, 255);
      doc.text("Traitements en Cours", 20, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      if (treatments.length === 0) {
        doc.text("Aucun traitement en cours", 25, yPos);
        yPos += 8;
      } else {
        treatments.forEach((treatment) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`• ${treatment.medication_name} - ${treatment.dosage}`, 25, yPos);
          yPos += 6;
          doc.text(`  Fréquence: ${treatment.frequency}`, 25, yPos);
          yPos += 6;
        });
      }

      // Pied de page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} sur ${totalPages} - SANTE.GA`, pageWidth / 2, 285, { align: "center" });
      }

      doc.save(`carnet-sante-${profile?.full_name || 'patient'}.pdf`);
      toast.success("Carnet de santé téléchargé");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <Card className="p-6 bg-card/50 border backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Carnet de Santé</h2>
        </div>
        <Button onClick={handleExportPDF} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter PDF
        </Button>
      </div>
      <Separator className="mb-4" />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">Patient</p>
            </div>
            <p className="text-sm font-bold text-foreground">{profile?.full_name || 'N/A'}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">Naissance</p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {profile?.birth_date ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr }) : 'N/A'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">Groupe Sanguin</p>
            </div>
            <p className="text-sm font-bold text-foreground">{profile?.blood_group || 'N/A'}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">Consultations</p>
            </div>
            <p className="text-sm font-bold text-foreground">{consultations.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Antécédents médicaux</p>
          <p className="text-sm font-medium text-foreground">{medicalHistory.length} enregistré(s)</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/20 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Traitements actifs</p>
          <p className="text-sm font-medium text-foreground">{treatments.length} en cours</p>
        </div>
      </div>
    </Card>
  );
};
