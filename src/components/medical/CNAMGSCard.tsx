import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Download, CreditCard, User, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import cnamgsCardImage from "@/assets/carte_cnamgs.png";
import { generateCNAMGSCard, validateCardData } from "@/utils/cnamgs-card-generator";
import { useState, useEffect } from "react";

interface CNAMGSCardProps {
  profile: any;
}

export const CNAMGSCard = ({ profile }: CNAMGSCardProps) => {
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);

  // Générer la carte au chargement
  useEffect(() => {
    const generateCard = async () => {
      if (!profile) return;

      try {
        const nom = profile?.full_name?.split(' ')[0] || 'NOM';
        const prenoms = profile?.full_name?.split(' ').slice(1).join(' ') || 'PRENOMS';
        const dateNaissance = profile?.birth_date 
          ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr })
          : '01/01/1990';
        const sexe = profile?.gender === 'male' ? 'M' : profile?.gender === 'female' ? 'F' : 'M';
        const numeroCard = profile?.cnamgs_number || '000-000-000-0';

        const cardData = {
          numero_carte: numeroCard,
          nom: nom,
          prenoms: prenoms,
          date_naissance: dateNaissance,
          sexe: sexe,
          photo_url: profile?.avatar_url,
        };

        const templateImg = new Image();
        templateImg.src = cnamgsCardImage;

        templateImg.onload = async () => {
          try {
            const canvas = await generateCNAMGSCard(templateImg, cardData);
            const dataUrl = canvas.toDataURL('image/png');
            setGeneratedCardUrl(dataUrl);
          } catch (error) {
            console.error("Error generating card preview:", error);
          }
        };
      } catch (error) {
        console.error("Error in card generation:", error);
      }
    };

    generateCard();
  }, [profile]);
  
  const handleExportPDF = async () => {
    try {
      // Préparer les données
      const nom = profile?.full_name?.split(' ')[0] || 'NOM';
      const prenoms = profile?.full_name?.split(' ').slice(1).join(' ') || 'PRENOMS';
      const dateNaissance = profile?.birth_date 
        ? format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr })
        : '01/01/1990';
      const sexe = profile?.gender === 'male' ? 'M' : profile?.gender === 'female' ? 'F' : 'M';
      const numeroCard = profile?.cnamgs_number || '000-000-000-0';

      const cardData = {
        numero_carte: numeroCard,
        nom: nom,
        prenoms: prenoms,
        date_naissance: dateNaissance,
        sexe: sexe,
        photo_url: profile?.avatar_url,
      };

      // Valider les données
      const validation = validateCardData(cardData);
      if (!validation.valid) {
        toast.error(`Données invalides: ${validation.errors.join(', ')}`);
        return;
      }

      // Charger l'image template
      const templateImg = new Image();
      templateImg.src = cnamgsCardImage;

      templateImg.onload = async () => {
        try {
          // Générer la carte personnalisée
          const canvas = await generateCNAMGSCard(templateImg, cardData);

          // Créer le PDF
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [1050, 650],
          });

          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 0, 0, 1050, 650);
          doc.save(`carte-cnamgs-${profile?.full_name || 'patient'}.pdf`);
          
          toast.success("Carte CNAMGS personnalisée téléchargée");
        } catch (error) {
          console.error("Error generating card:", error);
          toast.error("Erreur lors de la génération de la carte");
        }
      };

      templateImg.onerror = () => {
        toast.error("Erreur lors du chargement du template");
      };
    } catch (error) {
      console.error("Error in PDF export:", error);
      toast.error("Erreur lors de l'export PDF");
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
      
      {/* Image de la carte CNAMGS personnalisée */}
      <div className="mb-3 rounded-lg overflow-hidden border border-border/50">
        <img 
          src={generatedCardUrl || cnamgsCardImage} 
          alt="Carte CNAMGS" 
          className="w-full h-auto"
        />
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
