// ============================================
// MANAGER: Configuration Pharmacie
// Contexte logique activité pharmaceutique
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pharmacie } from '@/types/pharmacy';
import { 
  Building2, 
  Clock, 
  Shield, 
  FileText, 
  Award,
  Save,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface PharmacyConfigurationManagerProps {
  pharmacy: Pharmacie;
  onUpdate: (data: { id: string; updates: Partial<Pharmacie> }) => void;
}

export function PharmacyConfigurationManager({ pharmacy, onUpdate }: PharmacyConfigurationManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Type d'établissement
  const [typeStructure, setTypeStructure] = useState(pharmacy.type_structure);
  
  // Services pharmaceutiques
  const [ouvert_24_7, setOuvert24_7] = useState(pharmacy.ouvert_24_7);
  
  // Autorisations et certifications
  const [numeroAutorisation, setNumeroAutorisation] = useState(pharmacy.numero_autorisation_ouverture || '');
  const [dateAutorisation, setDateAutorisation] = useState(pharmacy.date_autorisation || '');
  const [numeroONPG, setNumeroONPG] = useState(pharmacy.numero_inscription_onpg || '');
  const [dateONPG, setDateONPG] = useState(pharmacy.date_inscription_onpg || '');
  
  // Conventionnements
  const [cnamgs, setCnamgs] = useState(pharmacy.conventionnement_cnamgs);
  const [numeroConventionCNAMGS, setNumeroConventionCNAMGS] = useState(pharmacy.numero_convention_cnamgs || '');
  
  // Équipements obligatoires
  const [chambreFroide, setChambreFroide] = useState(pharmacy.dispose_chambre_froide);
  const [armoireSecurisee, setArmoireSecurisee] = useState(pharmacy.dispose_armoire_securisee);
  const [balanceElectronique, setBalanceElectronique] = useState(pharmacy.dispose_balance_electronique);
  
  // Personnel
  const [nombreEmployes, setNombreEmployes] = useState(pharmacy.nombre_employes);

  const handleSubmit = () => {
    onUpdate({
      id: pharmacy.id,
      updates: {
        type_structure: typeStructure,
        ouvert_24_7,
        numero_autorisation_ouverture: numeroAutorisation || null,
        date_autorisation: dateAutorisation || null,
        numero_inscription_onpg: numeroONPG || null,
        date_inscription_onpg: dateONPG || null,
        conventionnement_cnamgs: cnamgs,
        numero_convention_cnamgs: cnamgs ? numeroConventionCNAMGS : null,
        dispose_chambre_froide: chambreFroide,
        dispose_armoire_securisee: armoireSecurisee,
        dispose_balance_electronique: balanceElectronique,
        nombre_employes: nombreEmployes,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configuration spécifique aux pharmacies selon les normes ONPG (Ordre National des Pharmaciens du Gabon)
        </AlertDescription>
      </Alert>

      {/* Type d'Établissement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Type d'Établissement Pharmaceutique
          </CardTitle>
          <CardDescription>
            Classification selon la réglementation gabonaise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="type_structure">Type de Structure *</Label>
            <Select 
              value={typeStructure} 
              onValueChange={setTypeStructure}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="officine_privee">
                  <div className="flex flex-col">
                    <span className="font-medium">Officine Privée</span>
                    <span className="text-xs text-muted-foreground">Pharmacie privée indépendante</span>
                  </div>
                </SelectItem>
                <SelectItem value="officine_publique">
                  <div className="flex flex-col">
                    <span className="font-medium">Officine Publique</span>
                    <span className="text-xs text-muted-foreground">Pharmacie publique communale</span>
                  </div>
                </SelectItem>
                <SelectItem value="pharmacie_hospitaliere">
                  <div className="flex flex-col">
                    <span className="font-medium">Pharmacie Hospitalière</span>
                    <span className="text-xs text-muted-foreground">Pharmacie interne à un hôpital</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <Label>Service de Garde 24/7</Label>
                  <p className="text-sm text-muted-foreground">
                    Pharmacie de garde ouverte en continu
                  </p>
                </div>
              </div>
              <Switch
                checked={ouvert_24_7}
                onCheckedChange={setOuvert24_7}
                disabled={!isEditing}
              />
            </div>
            {ouvert_24_7 && (
              <Alert className="mt-3">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Cette pharmacie sera identifiée comme pharmacie de garde 24h/24 et 7j/7
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Autorisations et Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Autorisations & Certifications
          </CardTitle>
          <CardDescription>
            Documents officiels requis pour l'exploitation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Autorisation d'Ouverture */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <Label className="font-semibold">Autorisation d'Ouverture</Label>
            </div>
            <div className="grid gap-4 md:grid-cols-2 ml-6">
              <div>
                <Label htmlFor="numero_autorisation">Numéro d'Autorisation</Label>
                <Input
                  id="numero_autorisation"
                  value={numeroAutorisation}
                  onChange={(e) => setNumeroAutorisation(e.target.value)}
                  disabled={!isEditing}
                  placeholder="MS-GAB-XXXX-XXX"
                />
              </div>
              <div>
                <Label htmlFor="date_autorisation">Date d'Autorisation</Label>
                <Input
                  id="date_autorisation"
                  type="date"
                  value={dateAutorisation}
                  onChange={(e) => setDateAutorisation(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {numeroAutorisation && (
              <div className="ml-6">
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Autorisation enregistrée
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Inscription ONPG */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-primary" />
              <Label className="font-semibold">Inscription ONPG (Ordre National des Pharmaciens)</Label>
            </div>
            <div className="grid gap-4 md:grid-cols-2 ml-6">
              <div>
                <Label htmlFor="numero_onpg">Numéro ONPG Établissement</Label>
                <Input
                  id="numero_onpg"
                  value={numeroONPG}
                  onChange={(e) => setNumeroONPG(e.target.value)}
                  disabled={!isEditing}
                  placeholder="ONPG-PHAR-XXXX-XXX"
                />
              </div>
              <div>
                <Label htmlFor="date_onpg">Date d'Inscription</Label>
                <Input
                  id="date_onpg"
                  type="date"
                  value={dateONPG}
                  onChange={(e) => setDateONPG(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {numeroONPG && (
              <div className="ml-6">
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Inscription ONPG validée
                </Badge>
              </div>
            )}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Contact ONPG:</strong> +241 76 87 99 00 (Pharmacie Lalala, Libreville)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Conventionnements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Conventionnements Santé
          </CardTitle>
          <CardDescription>
            Agrément des organismes d'assurance maladie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Conventionnement CNAMGS</Label>
                <p className="text-sm text-muted-foreground">
                  Caisse Nationale d'Assurance Maladie et de Garantie Sociale
                </p>
              </div>
              <Switch
                checked={cnamgs}
                onCheckedChange={setCnamgs}
                disabled={!isEditing}
              />
            </div>

            {cnamgs && (
              <div className="ml-4">
                <Label htmlFor="numero_convention_cnamgs">Numéro de Convention CNAMGS</Label>
                <Input
                  id="numero_convention_cnamgs"
                  value={numeroConventionCNAMGS}
                  onChange={(e) => setNumeroConventionCNAMGS(e.target.value)}
                  disabled={!isEditing}
                  placeholder="CNAMGS-CONV-XXXX-XXX"
                />
                {numeroConventionCNAMGS && (
                  <Badge variant="default" className="mt-2 text-xs">
                    Convention active
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Équipements Obligatoires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Équipements Réglementaires
          </CardTitle>
          <CardDescription>
            Équipements obligatoires selon normes pharmaceutiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Chambre Froide</Label>
              <p className="text-sm text-muted-foreground">
                Stockage vaccins et médicaments thermosensibles (+2°C à +8°C)
              </p>
            </div>
            <Switch
              checked={chambreFroide}
              onCheckedChange={setChambreFroide}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Armoire Sécurisée</Label>
              <p className="text-sm text-muted-foreground">
                Stockage médicaments stupéfiants et substances contrôlées (obligatoire)
              </p>
            </div>
            <Switch
              checked={armoireSecurisee}
              onCheckedChange={setArmoireSecurisee}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Balance Électronique</Label>
              <p className="text-sm text-muted-foreground">
                Pesée précise pour préparations magistrales et officinales
              </p>
            </div>
            <Switch
              checked={balanceElectronique}
              onCheckedChange={setBalanceElectronique}
              disabled={!isEditing}
            />
          </div>

          {!armoireSecurisee && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                ⚠️ L'armoire sécurisée est <strong>obligatoire</strong> pour toute pharmacie dispensant des stupéfiants
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Configuration Personnel
          </CardTitle>
          <CardDescription>
            Effectif déclaré de l'établissement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="nombre_employes">Nombre Total d'Employés</Label>
            <Input
              id="nombre_employes"
              type="number"
              min="1"
              value={nombreEmployes}
              onChange={(e) => setNombreEmployes(parseInt(e.target.value))}
              disabled={!isEditing}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Incluant pharmaciens, vendeurs et personnel administratif
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Récapitulatif Statut */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Récapitulatif Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline">
                {typeStructure === 'officine_privee' && 'Officine Privée'}
                {typeStructure === 'officine_publique' && 'Officine Publique'}
                {typeStructure === 'pharmacie_hospitaliere' && 'Pharmacie Hospitalière'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Garde 24/7:</span>
              <Badge variant={ouvert_24_7 ? 'default' : 'secondary'}>
                {ouvert_24_7 ? 'Oui' : 'Non'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CNAMGS:</span>
              <Badge variant={cnamgs ? 'default' : 'secondary'}>
                {cnamgs ? 'Conventionnée' : 'Non conventionnée'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Autorisations:</span>
              <Badge variant={numeroAutorisation && numeroONPG ? 'default' : 'secondary'}>
                {numeroAutorisation && numeroONPG ? 'Complètes' : 'Incomplètes'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Équipements obligatoires:</span>
              <Badge variant={armoireSecurisee ? 'default' : 'destructive'}>
                {armoireSecurisee ? 'Conformes' : 'Non conformes'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Personnel:</span>
              <span className="font-medium">{nombreEmployes} employé{nombreEmployes > 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer la Configuration
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Modifier la Configuration
          </Button>
        )}
      </div>
    </div>
  );
}

export default PharmacyConfigurationManager;

