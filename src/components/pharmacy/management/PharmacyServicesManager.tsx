// ============================================
// MANAGER: Services & Équipements Pharmacie
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Pharmacie, ServicesDisponibles } from '@/types/pharmacy';
import { Package, Truck, Smartphone, Stethoscope, Save, FlaskConical, Snowflake, Lock, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PharmacyServicesManagerProps {
  pharmacy: Pharmacie;
  onUpdate: (data: { id: string; updates: Partial<Pharmacie> }) => void;
}

const SERVICES: { value: ServicesDisponibles; label: string; icon: any; description: string }[] = [
  { value: 'garde_24h', label: 'Garde 24h', icon: Package, description: 'Service de garde 24h/24' },
  { value: 'livraison', label: 'Livraison', icon: Truck, description: 'Livraison à domicile' },
  { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone, description: 'Paiement Mobile Money' },
  { value: 'conseil_pharmaceutique', label: 'Conseil', icon: Stethoscope, description: 'Conseil pharmaceutique' },
  { value: 'tests_rapides', label: 'Tests Rapides', icon: FlaskConical, description: 'Tests diagnostiques rapides' },
  { value: 'depot_ordonnance', label: 'Dépôt Ordonnance', icon: Package, description: 'Dépôt et préparation différée' },
  { value: 'click_and_collect', label: 'Click & Collect', icon: Package, description: 'Commander et retirer' },
];

export function PharmacyServicesManager({ pharmacy, onUpdate }: PharmacyServicesManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState<ServicesDisponibles[]>(pharmacy.services_disponibles);
  const [equipements, setEquipements] = useState({
    dispose_chambre_froide: pharmacy.dispose_chambre_froide,
    dispose_armoire_securisee: pharmacy.dispose_armoire_securisee,
    dispose_balance_electronique: pharmacy.dispose_balance_electronique,
  });

  const toggleService = (service: ServicesDisponibles) => {
    if (services.includes(service)) {
      setServices(services.filter(s => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const handleSubmit = () => {
    onUpdate({
      id: pharmacy.id,
      updates: {
        services_disponibles: services,
        ...equipements,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Services Disponibles
          </CardTitle>
          <CardDescription>
            Activez les services proposés par votre pharmacie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isActive = services.includes(service.value);
              return (
                <div
                  key={service.value}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-all
                    ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                    ${!isEditing && 'cursor-default'}
                  `}
                  onClick={() => isEditing && toggleService(service.value)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                    `}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{service.label}</p>
                        {isActive && (
                          <Badge variant="default" className="text-xs">Actif</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Équipements & Installations
          </CardTitle>
          <CardDescription>
            Équipements spécialisés disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Snowflake className="h-5 w-5" />
              </div>
              <div>
                <Label>Chambre Froide</Label>
                <p className="text-sm text-muted-foreground">
                  Stockage vaccins, insuline (+2°C à +8°C)
                </p>
              </div>
            </div>
            <Switch
              checked={equipements.dispose_chambre_froide}
              onCheckedChange={(checked) => 
                setEquipements({ ...equipements, dispose_chambre_froide: checked })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <Label>Armoire Sécurisée</Label>
                <p className="text-sm text-muted-foreground">
                  Stockage médicaments stupéfiants et contrôlés
                </p>
              </div>
            </div>
            <Switch
              checked={equipements.dispose_armoire_securisee}
              onCheckedChange={(checked) => 
                setEquipements({ ...equipements, dispose_armoire_securisee: checked })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <Label>Balance Électronique</Label>
                <p className="text-sm text-muted-foreground">
                  Pesée précise pour préparations magistrales
                </p>
              </div>
            </div>
            <Switch
              checked={equipements.dispose_balance_electronique}
              onCheckedChange={(checked) => 
                setEquipements({ ...equipements, dispose_balance_electronique: checked })
              }
              disabled={!isEditing}
            />
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

