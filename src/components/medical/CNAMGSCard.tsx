import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Download, CreditCard, User, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface CNAMGSCardProps {
  profile: any;
}

export const CNAMGSCard = ({ profile }: CNAMGSCardProps) => {
  
  const handleExportPDF = async () => {
    try {
      // Generate card via edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-cnamgs-card`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const result = await response.json();
      
      // Convert SVG to PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1050, 650],
      });
      
      // Create a temporary canvas to render SVG
      const canvas = document.createElement('canvas');
      canvas.width = 1050;
      canvas.height = 650;
      const ctx = canvas.getContext('2d');
      
      // Create image from SVG
      const img = new Image();
      const svgBlob = new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 0, 0, 1050, 650);
        doc.save(`carte-cnamgs-${profile?.full_name || 'patient'}.pdf`);
        URL.revokeObjectURL(url);
        toast.success("Carte CNAMGS téléchargée");
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        toast.error("Erreur lors du rendu de la carte");
      };
      
      img.src = url;
      
    } catch (error) {
      console.error("Error generating card:", error);
      toast.error("Erreur lors de la génération de la carte");
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
