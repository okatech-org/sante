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
    <Card className="p-4 sm:p-6 bg-card/50 border backdrop-blur-sm flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Syringe className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Vaccinations</h2>
            <p className="text-xs text-muted-foreground">Complété par le médecin</p>
          </div>
        </div>
        <Button onClick={handleExportPDF} size="sm" variant="outline" className="self-start sm:self-auto">
          <Download className="h-3 w-3 mr-1.5" />
          <span className="text-xs">PDF</span>
        </Button>
      </div>
      
      <Separator className="mb-3" />
      
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2 max-h-[280px] sm:max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
          {RECOMMENDED_VACCINES.map((vaccine, index) => (
            <div key={index} className="p-2.5 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border transition-all">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm text-foreground truncate">{vaccine.name}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 flex-shrink-0">
                      À faire
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{vaccine.description}</p>
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                    {vaccine.ageRecommended}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
          <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <span>Seul un professionnel de santé peut valider les vaccinations dans ce carnet.</span>
        </p>
      </div>
    </Card>
  );
};
