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
  
  const generateCardSVG = () => {
    const nom = profile?.full_name?.split(' ')[0]?.toUpperCase() || 'NOM';
    const prenoms = profile?.full_name?.split(' ').slice(1).join(' ')?.toUpperCase() || 'PRENOMS';
    const dateNaissance = profile?.birth_date 
      ? new Date(profile.birth_date).toLocaleDateString('fr-FR')
      : '01/01/1990';
    const sexe = profile?.gender === 'male' ? 'M' : profile?.gender === 'female' ? 'F' : 'M';
    const numeroCard = profile?.cnamgs_number || '000-000-000-0';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="650" viewBox="0 0 1050 650">
      <rect width="1050" height="650" fill="#F5F5DC"/>
      <rect x="40" y="150" width="970" height="6" fill="#28A745"/>
      
      <rect x="64" y="42" width="120" height="86" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>
      <text x="124" y="90" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">ARMOIRIES</text>
      
      <text x="280" y="80" font-family="Arial" font-size="32" font-weight="bold" fill="#000000">RÉPUBLIQUE</text>
      <text x="280" y="120" font-family="Arial" font-size="32" font-weight="bold" fill="#000000">GABONAISE</text>
      
      <rect x="740" y="42" width="250" height="86" fill="#FFFFFF" stroke="#28A745" stroke-width="2"/>
      <text x="865" y="90" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#28A745">CNAMGS</text>
      
      <text x="525" y="245" text-anchor="middle" font-family="Arial" font-size="28" font-weight="bold" fill="#000000">Secteur Privé</text>
      <text x="525" y="285" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#000000">Carte d'Assurance Maladie</text>
      
      <rect x="380" y="130" width="320" height="48" fill="#FFFFFF" stroke="#000000" stroke-width="1" rx="4"/>
      <text x="540" y="160" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#000000">${numeroCard}</text>
      
      <rect x="120" y="200" width="150" height="110" fill="#FFD700" stroke="#000000" stroke-width="2" rx="8"/>
      <rect x="135" y="215" width="50" height="40" fill="#C0C0C0" rx="4"/>
      <rect x="195" y="215" width="60" height="40" fill="#C0C0C0" rx="4"/>
      <rect x="135" y="260" width="120" height="40" fill="#C0C0C0" rx="4"/>
      
      <text x="120" y="345" font-family="Arial" font-size="18" font-weight="bold" fill="#000000">Nom</text>
      <rect x="120" y="352" width="430" height="48" fill="#FFFFFF" stroke="#000000" stroke-width="1" rx="4"/>
      <text x="335" y="382" text-anchor="middle" font-family="Arial" font-size="28" font-weight="bold" fill="#000000">${nom}</text>
      
      <text x="120" y="429" font-family="Arial" font-size="18" font-weight="bold" fill="#000000">Prénoms</text>
      <rect x="120" y="436" width="430" height="48" fill="#FFFFFF" stroke="#000000" stroke-width="1" rx="4"/>
      <text x="335" y="466" text-anchor="middle" font-family="Arial" font-size="28" fill="#000000">${prenoms}</text>
      
      <text x="120" y="513" font-family="Arial" font-size="18" font-weight="bold" fill="#000000">Date de naissance</text>
      <rect x="120" y="520" width="220" height="48" fill="#FFFFFF" stroke="#000000" stroke-width="1" rx="4"/>
      <text x="230" y="550" text-anchor="middle" font-family="Arial" font-size="24" fill="#000000">${dateNaissance}</text>
      
      <text x="380" y="513" font-family="Arial" font-size="18" font-weight="bold" fill="#000000">Sexe</text>
      <rect x="380" y="520" width="80" height="48" fill="#FFFFFF" stroke="#000000" stroke-width="1" rx="4"/>
      <text x="420" y="550" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#000000">${sexe}</text>
      
      <rect x="720" y="320" width="200" height="250" fill="#FFFFFF" stroke="#000000" stroke-width="2" rx="8"/>
      ${profile?.avatar_url 
        ? `<image x="720" y="320" width="200" height="250" href="${profile.avatar_url}" preserveAspectRatio="xMidYMid slice"/>`
        : `<ellipse cx="820" cy="400" rx="60" ry="70" fill="#CCCCCC"/>
           <path d="M 760 500 Q 820 450 880 500" fill="#CCCCCC"/>
           <text x="820" y="480" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">PHOTO</text>`
      }
    </svg>`;
  };

  const handleExportPDF = async () => {
    try {
      const svgString = generateCardSVG();
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1050, 650],
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 1050;
      canvas.height = 650;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
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
