// ============================================
// MANAGER: Modes de Paiement & Assurances
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pharmacie, ModesPaiement } from '@/types/pharmacy';
import { CreditCard, Banknote, Smartphone, FileText, Save, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PharmacyPaymentManagerProps {
  pharmacy: Pharmacie;
  onUpdate: (data: { id: string; updates: Partial<Pharmacie> }) => void;
}

const MODES_PAIEMENT: { value: ModesPaiement; label: string; icon: any }[] = [
  { value: 'especes', label: 'Espèces', icon: Banknote },
  { value: 'carte_bancaire', label: 'Carte Bancaire', icon: CreditCard },
  { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
  { value: 'cheque', label: 'Chèque', icon: FileText },
];

const MOBILE_MONEY_PROVIDERS = [
  { value: 'airtel_money', label: 'Airtel Money' },
  { value: 'moov_money', label: 'Moov Money' },
];

export function PharmacyPaymentManager({ pharmacy, onUpdate }: PharmacyPaymentManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [modes_paiement, setModesPaiement] = useState<ModesPaiement[]>(pharmacy.modes_paiement);
  const [mobile_money_providers, setMobileMoneyProviders] = useState<string[]>(
    pharmacy.mobile_money_providers || []
  );
  const [conventionnement_cnamgs, setConventionnementCNAMGS] = useState(pharmacy.conventionnement_cnamgs);
  const [numero_convention_cnamgs, setNumeroConventionCNAMGS] = useState(pharmacy.numero_convention_cnamgs || '');
  const [autres_assurances, setAutresAssurances] = useState<string[]>(
    pharmacy.autres_assurances_acceptees || []
  );
  const [newAssurance, setNewAssurance] = useState('');

  const togglePaiement = (mode: ModesPaiement) => {
    if (modes_paiement.includes(mode)) {
      setModesPaiement(modes_paiement.filter(m => m !== mode));
      if (mode === 'mobile_money') {
        setMobileMoneyProviders([]);
      }
    } else {
      setModesPaiement([...modes_paiement, mode]);
    }
  };

  const toggleMobileMoneyProvider = (provider: string) => {
    if (mobile_money_providers.includes(provider)) {
      setMobileMoneyProviders(mobile_money_providers.filter(p => p !== provider));
    } else {
      setMobileMoneyProviders([...mobile_money_providers, provider]);
    }
  };

  const addAssurance = () => {
    if (newAssurance.trim() && !autres_assurances.includes(newAssurance.trim())) {
      setAutresAssurances([...autres_assurances, newAssurance.trim()]);
      setNewAssurance('');
    }
  };

  const removeAssurance = (assurance: string) => {
    setAutresAssurances(autres_assurances.filter(a => a !== assurance));
  };

  const handleSubmit = () => {
    onUpdate({
      id: pharmacy.id,
      updates: {
        modes_paiement,
        mobile_money_providers: modes_paiement.includes('mobile_money') ? mobile_money_providers : null,
        conventionnement_cnamgs,
        numero_convention_cnamgs: conventionnement_cnamgs ? numero_convention_cnamgs : null,
        autres_assurances_acceptees: autres_assurances.length > 0 ? autres_assurances : null,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Modes de Paiement Acceptés
          </CardTitle>
          <CardDescription>
            Sélectionnez les méthodes de paiement disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {MODES_PAIEMENT.map((mode) => {
              const Icon = mode.icon;
              const isActive = modes_paiement.includes(mode.value);
              return (
                <div
                  key={mode.value}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-all
                    ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                    ${!isEditing && 'cursor-default'}
                  `}
                  onClick={() => isEditing && togglePaiement(mode.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                    `}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{mode.label}</p>
                        {isActive && (
                          <Badge variant="default" className="text-xs">Accepté</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {modes_paiement.includes('mobile_money') && (
            <div className="mt-6 space-y-3">
              <Label>Fournisseurs Mobile Money</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {MOBILE_MONEY_PROVIDERS.map((provider) => (
                  <div
                    key={provider.value}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-all
                      ${mobile_money_providers.includes(provider.value) ? 'border-primary bg-primary/5' : 'border-border'}
                      ${!isEditing && 'cursor-default'}
                    `}
                    onClick={() => isEditing && toggleMobileMoneyProvider(provider.value)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{provider.label}</p>
                      {mobile_money_providers.includes(provider.value) && (
                        <Badge variant="outline" className="text-xs">✓</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assurances & Mutuelles
          </CardTitle>
          <CardDescription>
            Configuration des conventionnements santé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Conventionnement CNAMGS</Label>
                <p className="text-sm text-muted-foreground">
                  Caisse Nationale d'Assurance Maladie et de Garantie Sociale
                </p>
              </div>
              <Switch
                checked={conventionnement_cnamgs}
                onCheckedChange={setConventionnementCNAMGS}
                disabled={!isEditing}
              />
            </div>

            {conventionnement_cnamgs && (
              <div>
                <Label htmlFor="numero_convention">Numéro de Convention CNAMGS</Label>
                <Input
                  id="numero_convention"
                  value={numero_convention_cnamgs}
                  onChange={(e) => setNumeroConventionCNAMGS(e.target.value)}
                  disabled={!isEditing}
                  placeholder="CNAMGS-CONV-XXXX-XXX"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Autres Assurances/Mutuelles Acceptées</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {autres_assurances.map((assurance) => (
                <Badge key={assurance} variant="secondary" className="gap-1">
                  {assurance}
                  {isEditing && (
                    <button
                      onClick={() => removeAssurance(assurance)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newAssurance}
                  onChange={(e) => setNewAssurance(e.target.value)}
                  placeholder="Ex: Mutuelle SOGARA"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAssurance())}
                />
                <Button type="button" variant="outline" onClick={addAssurance}>
                  Ajouter
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Modifier
          </Button>
        )}
      </div>
    </div>
  );
}

