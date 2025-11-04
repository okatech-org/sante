import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Shield, 
  Clock, 
  CreditCard,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  Snowflake,
  Lock
} from "lucide-react";

interface PharmacyConfigurationProps {
  pharmacyId: string;
}

export const PharmacyConfiguration = ({ pharmacyId }: PharmacyConfigurationProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autorisations et Conventionnements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Conventionnement CNAMGS</p>
              <p className="text-sm text-muted-foreground">
                Numéro: CNAMGS-PH-2024-0145
              </p>
            </div>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Actif
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Autorisation d'ouverture</p>
              <p className="text-sm text-muted-foreground">
                N° AOA-2020-0234 - Expire le 31/12/2025
              </p>
            </div>
            <Badge variant="default">Valide</Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Inscription ONPG</p>
              <p className="text-sm text-muted-foreground">
                Pharmacien Titulaire: Dr. Marie NZAMBA
              </p>
            </div>
            <Badge variant="default" className="bg-blue-600">Vérifiée</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horaires et Disponibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="open-24-7">Ouvert 24h/24 - 7j/7</Label>
              <p className="text-sm text-muted-foreground">
                Pharmacie de garde permanente
              </p>
            </div>
            <Switch id="open-24-7" />
          </div>

          <div className="border-t pt-4">
            <p className="font-medium mb-3">Horaires standards</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Lundi - Vendredi</p>
                <p className="font-medium">08:00 - 20:00</p>
              </div>
              <div>
                <p className="text-muted-foreground">Samedi</p>
                <p className="font-medium">08:00 - 18:00</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dimanche</p>
                <p className="font-medium">09:00 - 13:00</p>
              </div>
              <div>
                <p className="text-muted-foreground">Jours fériés</p>
                <p className="font-medium">Sur demande</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Modes de Paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="cash">Espèces</Label>
            <Switch id="cash" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="card">Carte Bancaire</Label>
            <Switch id="card" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="mobile-money">Mobile Money (Airtel/Moov)</Label>
            <Switch id="mobile-money" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cnamgs">Tiers-payant CNAMGS</Label>
            <Switch id="cnamgs" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Services Additionnels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="delivery">Livraison à domicile</Label>
              <p className="text-sm text-muted-foreground">Rayon 5km</p>
            </div>
            <Switch id="delivery" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="online-orders">Commandes en ligne</Label>
              <p className="text-sm text-muted-foreground">Via plateforme SANTE.GA</p>
            </div>
            <Switch id="online-orders" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reservations">Réservations ordonnances</Label>
              <p className="text-sm text-muted-foreground">Préparation anticipée</p>
            </div>
            <Switch id="reservations" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Équipements Spécialisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Snowflake className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Chambre froide</p>
                <p className="text-sm text-muted-foreground">
                  Stockage vaccins et produits thermosensibles
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-blue-600">Disponible</Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium">Armoire sécurisée</p>
                <p className="text-sm text-muted-foreground">
                  Stupéfiants et substances contrôlées
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-600">Conforme</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Alertes Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-orange-800">
            <li>• Renouvellement autorisation d'ouverture requis dans 6 mois</li>
            <li>• Audit CNAMGS prévu le 15 décembre 2025</li>
            <li>• Formation continue ONPG obligatoire avant mars 2026</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Annuler</Button>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};
