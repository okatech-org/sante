import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService } from "@/services/patientService";
import { generateCNAMGSCard, generateAttestationDroits, generateRelevéRemboursements } from "@/utils/pdfGenerator";
import { CNAMGSCard } from "@/components/medical/CNAMGSCard";
import { 
  Shield, Download, Calendar, CheckCircle, 
  AlertCircle, Loader2, CreditCard, User,
  Building2, Phone, Mail, FileText, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function PatientCNAMGS() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCNAMGSData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const profile = await patientService.getProfile(user.id);
        setProfileData(profile);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des données CNAMGS');
      } finally {
        setLoading(false);
      }
    };

    loadCNAMGSData();
  }, [user?.id]);

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos droits CNAMGS...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  const coveragePercentage = 100;
  const insuranceStatus = 'active';

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Droits CNAMGS
          </h1>
          <p className="text-muted-foreground">Consultez votre couverture et vos droits d'assurance maladie</p>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">Couverture Active</h2>
                  <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Actif
                  </Badge>
                </div>
                
                <p className="text-lg font-medium text-muted-foreground mb-4">
                  Numéro d'assuré : {profileData?.cnamgs_number || 'Non renseigné'}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taux de couverture</span>
                    <span className="font-bold text-primary">{coveragePercentage}%</span>
                  </div>
                  <Progress value={coveragePercentage} className="h-3" />
                </div>
              </div>
              
              <Button 
                className="flex-shrink-0"
                onClick={() => generateCNAMGSCard(profileData)}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger Carte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Carte CNAMGS Interactive avec Attestation PDF */}
        {profileData && (
          <CNAMGSCard profile={profileData} />
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations Personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium">{profileData?.full_name || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium">
                  {profileData?.date_of_birth ? 
                    new Date(profileData.date_of_birth).toLocaleDateString('fr-FR') : 
                    'Non renseignée'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Numéro CNAMGS</p>
                <p className="font-mono font-bold text-primary">
                  {profileData?.cnamgs_number || 'Non renseigné'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge className={insuranceStatus === 'active' ? 
                  'bg-green-500/20 text-green-700 border-green-500/30' :
                  'bg-red-500/20 text-red-700 border-red-500/30'
                }>
                  {insuranceStatus === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Droits et Couverture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Droits et Couverture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Consultations</p>
                  <p className="font-medium">100%</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Hospitalisations</p>
                  <p className="font-medium">100%</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Médicaments</p>
                  <p className="font-medium">80%</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Analyses</p>
                  <p className="font-medium">100%</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CNAMGS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Contact CNAMGS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">+241 11 76 60 00</p>
                  <p className="text-xs text-muted-foreground mt-1">Lun-Ven: 7h30-16h00</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">contact@cnamgs.ga</p>
                  <p className="text-xs text-muted-foreground mt-1">Réponse sous 48h</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Building2 className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Siège</p>
                  <p className="font-medium">Libreville, Gabon</p>
                  <p className="text-xs text-muted-foreground mt-1">Quartier Batterie IV</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documents et Attestations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Carte d'assuré CNAMGS</p>
                    <p className="text-sm text-muted-foreground">Valide jusqu'au 31/12/2025</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateCNAMGSCard(profileData)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Attestation de droits</p>
                    <p className="text-sm text-muted-foreground">Générée le {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateAttestationDroits(profileData)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Relevé de remboursements</p>
                    <p className="text-sm text-muted-foreground">Année 2024</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateRelevéRemboursements(2024)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="border-blue-500/20 bg-blue-500/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Information importante
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Votre couverture CNAMGS est active et à jour. En cas de consultation, présentez votre carte d'assuré 
                  ou votre numéro CNAMGS au professionnel de santé. Pour toute question concernant vos droits ou remboursements, 
                  contactez le service CNAMGS aux coordonnées ci-dessus.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}
