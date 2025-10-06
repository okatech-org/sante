import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Syringe, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VaccinationBookletProps {
  profile: any;
}

// Vaccinations recommandées au Gabon
const RECOMMENDED_VACCINES = [
  { name: "BCG", description: "Tuberculose", ageRecommended: "À la naissance" },
  { name: "Hépatite B", description: "Protection hépatique", ageRecommended: "0, 6 semaines, 6 mois" },
  { name: "Polio", description: "Poliomyélite", ageRecommended: "6, 10, 14 semaines" },
  { name: "DTC", description: "Diphtérie, Tétanos, Coqueluche", ageRecommended: "6, 10, 14 semaines" },
  { name: "Haemophilus", description: "Méningite", ageRecommended: "6, 10, 14 semaines" },
  { name: "Pneumocoque", description: "Pneumonie", ageRecommended: "6, 10, 14 semaines" },
  { name: "Rougeole", description: "Rougeole", ageRecommended: "9 mois" },
  { name: "Fièvre Jaune", description: "Obligatoire au Gabon", ageRecommended: "9 mois" },
  { name: "Méningite A+C", description: "Protection méningite", ageRecommended: "Selon recommandation" },
  { name: "COVID-19", description: "Protection COVID", ageRecommended: "Selon recommandation" },
];

export const VaccinationBooklet = ({ profile }: VaccinationBookletProps) => {
  
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Titre
      doc.setFontSize(20);
      doc.setTextColor(0, 212, 255);
      doc.text("Carnet de Vaccination", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      // Informations patient
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Patient: ${profile?.full_name || 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`Date de naissance: ${profile?.birth_date ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr }) : 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`N° CNAMGS: ${profile?.cnamgs_number || 'N/A'}`, 20, yPos);
      yPos += 15;

      // Vaccinations recommandées
      doc.setFontSize(14);
      doc.setTextColor(0, 136, 255);
      doc.text("Vaccinations Recommandées au Gabon", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      RECOMMENDED_VACCINES.forEach((vaccine) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(`${vaccine.name}`, 25, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 6;
        doc.text(`  ${vaccine.description}`, 25, yPos);
        yPos += 6;
        doc.text(`  Âge recommandé: ${vaccine.ageRecommended}`, 25, yPos);
        yPos += 6;
        doc.text(`  Statut: À compléter`, 25, yPos);
        yPos += 10;
      });

      yPos += 10;
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text("Note: Ce carnet doit être complété par un professionnel de santé lors de chaque vaccination.", 20, yPos);

      // Pied de page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} sur ${totalPages} - SANTE.GA`, pageWidth / 2, 285, { align: "center" });
      }

      doc.save(`carnet-vaccination-${profile?.full_name || 'patient'}.pdf`);
      toast.success("Carnet de vaccination téléchargé");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <Card className="p-6 bg-card/50 border backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Syringe className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Carnet de Vaccination</h2>
        </div>
        <Button onClick={handleExportPDF} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter PDF
        </Button>
      </div>
      <Separator className="mb-4" />
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {RECOMMENDED_VACCINES.map((vaccine, index) => (
          <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground">{vaccine.name}</p>
                  <Badge variant="outline" className="text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    À compléter
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{vaccine.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Âge recommandé: {vaccine.ageRecommended}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-600 dark:text-blue-400">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          Ce carnet doit être complété par un professionnel de santé lors de chaque vaccination.
        </p>
      </div>
    </Card>
  );
};
