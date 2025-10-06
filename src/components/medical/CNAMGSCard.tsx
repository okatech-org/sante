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
    <Card className="p-6 bg-card/50 border backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Carte CNAMGS</h2>
        </div>
        <Button onClick={handleExportPDF} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter PDF
        </Button>
      </div>
      <Separator className="mb-4" />
      
      {/* Carte visuelle */}
      <div className="relative mb-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs opacity-80 mb-1">CNAMGS</p>
              <p className="text-sm font-medium">Carte d'Assuré Social</p>
            </div>
            <Shield className="h-8 w-8 opacity-80" />
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 opacity-80" />
              <p className="text-lg font-bold">{profile?.cnamgs_number || 'Non attribué'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 opacity-80" />
              <p className="text-sm font-medium">{profile?.full_name || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 opacity-80" />
              <p className="text-xs opacity-80">
                Né(e) le: {profile?.birth_date ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr }) : 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 opacity-80" />
              <p className="text-xs opacity-80">Groupe: {profile?.blood_group || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations de couverture */}
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Couverture</p>
          <p className="text-sm font-bold text-foreground">80% des frais médicaux</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Plafond annuel</p>
          <p className="text-sm font-bold text-foreground">5 000 000 FCFA</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Statut</p>
              <p className="text-sm font-bold text-foreground">Actif</p>
            </div>
            <Badge className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valide
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-600 dark:text-blue-400">
          <Shield className="h-3 w-3 inline mr-1" />
          Présentez cette carte lors de chaque consultation dans un établissement conventionné.
        </p>
      </div>
    </Card>
  );
};
