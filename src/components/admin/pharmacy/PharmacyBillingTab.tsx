import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  TrendingUp, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  DollarSign
} from "lucide-react";

interface PharmacyBillingTabProps {
  pharmacyId: string;
}

export const PharmacyBillingTab = ({ pharmacyId }: PharmacyBillingTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Badge variant="secondary">Ce mois</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
            <p className="text-2xl font-bold text-green-700">8,450,000 FCFA</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <Badge variant="secondary">CNAMGS</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Tiers-payant</p>
            <p className="text-2xl font-bold text-blue-700">5,120,000 FCFA</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <Badge variant="secondary">Privé</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Paiements directs</p>
            <p className="text-2xl font-bold text-purple-700">3,330,000 FCFA</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <Badge variant="secondary">En attente</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Remboursements</p>
            <p className="text-2xl font-bold text-orange-700">1,245,000 FCFA</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dossiers CNAMGS en attente
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: 'TP-2025-0123',
                patient: 'OBAME Jean',
                cnamgs: '241-2024-0456',
                montant: 45000,
                date: '2025-11-01',
                status: 'soumis'
              },
              {
                id: 'TP-2025-0124',
                patient: 'NZAMBA Marie',
                cnamgs: '241-2023-0789',
                montant: 32000,
                date: '2025-11-02',
                status: 'en_traitement'
              },
              {
                id: 'TP-2025-0125',
                patient: 'MBADINGA Patrick',
                cnamgs: '241-2024-1234',
                montant: 67000,
                date: '2025-11-02',
                status: 'soumis'
              }
            ].map((dossier) => (
              <Card key={dossier.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold">{dossier.id}</p>
                        <Badge variant={dossier.status === 'soumis' ? 'secondary' : 'default'}>
                          {dossier.status === 'soumis' ? 'Soumis' : 'En traitement'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Patient</p>
                          <p className="font-medium">{dossier.patient}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">N° CNAMGS</p>
                          <p className="font-medium">{dossier.cnamgs}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Montant</p>
                          <p className="font-medium">{dossier.montant.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Soumis le {new Date(dossier.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Répartition des Paiements (30 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Tiers-payant CNAMGS</p>
                  <p className="text-sm text-muted-foreground">287 transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">5,120,000 FCFA</p>
                <p className="text-sm text-muted-foreground">60.6%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Espèces</p>
                  <p className="text-sm text-muted-foreground">156 transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">1,890,000 FCFA</p>
                <p className="text-sm text-muted-foreground">22.4%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Mobile Money</p>
                  <p className="text-sm text-muted-foreground">98 transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">1,440,000 FCFA</p>
                <p className="text-sm text-muted-foreground">17.0%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Remboursements CNAMGS validés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-800">
            Dernier virement reçu : 3,850,000 FCFA le 28 octobre 2025
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Prochain virement prévu : 15 novembre 2025
          </p>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            Actions requises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-orange-800">
            <li>• 12 dossiers CNAMGS incomplets à corriger</li>
            <li>• Facture fournisseur UbiPharm en attente de paiement (2,340,000 FCFA)</li>
            <li>• Déclaration fiscale mensuelle à soumettre avant le 10/11/2025</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
