import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Download, CreditCard, User, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CNAMGSCardProps {
  profile: any;
}

export const CNAMGSCard = ({ profile }: CNAMGSCardProps) => {
  
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Titre avec logo CNAMGS (simulé)
      doc.setFontSize(24);
      doc.setTextColor(0, 136, 255);
      doc.text("CNAMGS", pageWidth / 2, yPos, { align: "center" });
      yPos += 8;
      doc.setFontSize(14);
      doc.text("Caisse Nationale d'Assurance Maladie", pageWidth / 2, yPos, { align: "center" });
      yPos += 6;
      doc.text("et de Garantie Sociale", pageWidth / 2, yPos, { align: "center" });
      yPos += 20;

      // Carte d'assuré
      doc.setFillColor(0, 136, 255);
      doc.rect(20, yPos, pageWidth - 40, 80, 'F');
      
      yPos += 15;
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("CARTE D'ASSURÉ SOCIAL", pageWidth / 2, yPos, { align: "center" });
      
      yPos += 15;
      doc.setFontSize(12);
      doc.text(`N° ${profile?.cnamgs_number || 'Non attribué'}`, pageWidth / 2, yPos, { align: "center" });
      
      yPos += 15;
      doc.setFontSize(14);
      doc.text(profile?.full_name || 'N/A', pageWidth / 2, yPos, { align: "center" });
      
      yPos += 10;
      doc.setFontSize(10);
      doc.text(`Né(e) le: ${profile?.birth_date ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr }) : 'N/A'}`, pageWidth / 2, yPos, { align: "center" });
      
      yPos += 10;
      doc.text(`Groupe sanguin: ${profile?.blood_group || 'N/A'}`, pageWidth / 2, yPos, { align: "center" });

      yPos += 35;

      // Informations complémentaires
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Droits et Couverture", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.text("• Couverture: 80% des frais médicaux", 25, yPos);
      yPos += 8;
      doc.text("• Plafond annuel: 5 000 000 FCFA", 25, yPos);
      yPos += 8;
      doc.text("• Validité: En cours", 25, yPos);
      yPos += 8;
      doc.text("• Statut: Actif", 25, yPos);
      yPos += 15;

      // Établissements conventionnés
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Établissements Conventionnés", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.text("Consultez la liste complète sur www.cnamgs.ga", 25, yPos);
      yPos += 8;
      doc.text("ou via l'application SANTE.GA", 25, yPos);

      yPos += 20;

      // Avertissement
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      const warningText = "Cette carte est personnelle et incessible. Elle doit être présentée lors de chaque consultation médicale. En cas de perte ou de vol, contactez immédiatement le +241 01 76 24 24.";
      const splitText = doc.splitTextToSize(warningText, pageWidth - 40);
      doc.text(splitText, 20, yPos);

      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Document généré le ${format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr })} - SANTE.GA`, pageWidth / 2, 285, { align: "center" });

      doc.save(`carte-cnamgs-${profile?.full_name || 'patient'}.pdf`);
      toast.success("Carte CNAMGS téléchargée");
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
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">CNAMGS</h2>
            <p className="text-xs text-muted-foreground">Carte d'assuré</p>
          </div>
        </div>
        <Button onClick={handleExportPDF} size="sm" variant="outline" className="self-start sm:self-auto">
          <Download className="h-3 w-3 mr-1.5" />
          <span className="text-xs">PDF</span>
        </Button>
      </div>
      
      <Separator className="mb-3" />
      
      {/* Carte visuelle compacte */}
      <div className="mb-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] opacity-70 mb-0.5">CNAMGS</p>
              <p className="text-xs font-medium">Assuré Social</p>
            </div>
            <Shield className="h-6 w-6 opacity-70" />
          </div>
          
          <div className="mb-3">
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3 w-3 opacity-70" />
              <p className="text-sm font-bold truncate">{profile?.cnamgs_number || 'Non attribué'}</p>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <User className="h-2.5 w-2.5 opacity-70" />
              <p className="text-xs font-medium truncate">{profile?.full_name || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-2.5 w-2.5 opacity-70" />
              <p className="text-[10px] opacity-80">
                {profile?.birth_date ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations de couverture compactes */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50">
          <p className="text-[10px] text-muted-foreground mb-0.5">Couverture</p>
          <p className="text-xs font-bold text-foreground">80%</p>
        </div>

        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50">
          <p className="text-[10px] text-muted-foreground mb-0.5">Plafond</p>
          <p className="text-xs font-bold text-foreground">5M FCFA</p>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground mb-0.5">Statut</p>
          <p className="text-xs font-bold text-foreground">Actif</p>
        </div>
        <Badge className="bg-green-600 h-6 text-[10px] px-2">
          <CheckCircle className="h-2.5 w-2.5 mr-1" />
          Valide
        </Badge>
      </div>

      <div className="mt-auto pt-3">
        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 flex items-start gap-1.5">
            <Shield className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span>Présentez cette carte dans les établissements conventionnés.</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
