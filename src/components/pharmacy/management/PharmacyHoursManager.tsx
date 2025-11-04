// ============================================
// MANAGER: Horaires Pharmacie
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pharmacie, HorairesPharmacie, JoursSemaine } from '@/types/pharmacy';
import { Clock, Plus, Trash2, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PharmacyHoursManagerProps {
  pharmacy: Pharmacie;
  onUpdate: (data: { id: string; updates: Partial<Pharmacie> }) => void;
}

const JOURS: JoursSemaine[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export function PharmacyHoursManager({ pharmacy, onUpdate }: PharmacyHoursManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [ouvert_24_7, setOuvert24_7] = useState(pharmacy.ouvert_24_7);
  const [horaires, setHoraires] = useState<HorairesPharmacie>(pharmacy.horaires);

  const handleToggleDay = (jour: JoursSemaine, ouvert: boolean) => {
    setHoraires({
      ...horaires,
      [jour]: {
        ouvert,
        horaires: ouvert ? [{ debut: '08:00', fin: '18:00' }] : [],
      },
    });
  };

  const handleAddSlot = (jour: JoursSemaine) => {
    const jourData = horaires[jour];
    setHoraires({
      ...horaires,
      [jour]: {
        ...jourData,
        horaires: [...jourData.horaires, { debut: '14:00', fin: '18:00' }],
      },
    });
  };

  const handleRemoveSlot = (jour: JoursSemaine, index: number) => {
    const jourData = horaires[jour];
    setHoraires({
      ...horaires,
      [jour]: {
        ...jourData,
        horaires: jourData.horaires.filter((_, i) => i !== index),
      },
    });
  };

  const handleSlotChange = (
    jour: JoursSemaine,
    index: number,
    field: 'debut' | 'fin',
    value: string
  ) => {
    const jourData = horaires[jour];
    const newHoraires = [...jourData.horaires];
    newHoraires[index] = { ...newHoraires[index], [field]: value };
    setHoraires({
      ...horaires,
      [jour]: { ...jourData, horaires: newHoraires },
    });
  };

  const handleSubmit = () => {
    onUpdate({
      id: pharmacy.id,
      updates: {
        ouvert_24_7,
        horaires: ouvert_24_7 ? { mode: '24_7' } as any : horaires,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mode d'Ouverture
          </CardTitle>
          <CardDescription>
            Configuration des horaires d'ouverture de la pharmacie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ouvert 24/7</Label>
              <p className="text-sm text-muted-foreground">
                Service disponible 24h/24, 7j/7
              </p>
            </div>
            <Switch
              checked={ouvert_24_7}
              onCheckedChange={setOuvert24_7}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {!ouvert_24_7 && (
        <Card>
          <CardHeader>
            <CardTitle>Horaires par Jour</CardTitle>
            <CardDescription>
              Définissez les plages horaires pour chaque jour de la semaine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {JOURS.map((jour) => {
              const jourData = horaires[jour];
              return (
                <div key={jour} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={jourData.ouvert}
                        onCheckedChange={(checked) => handleToggleDay(jour, checked)}
                        disabled={!isEditing}
                      />
                      <Label className="capitalize font-semibold">
                        {jour}
                      </Label>
                      {jourData.ouvert && (
                        <Badge variant="outline" className="text-xs">
                          {jourData.horaires.length} plage{jourData.horaires.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    {jourData.ouvert && isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSlot(jour)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter plage
                      </Button>
                    )}
                  </div>

                  {jourData.ouvert && (
                    <div className="ml-11 space-y-2">
                      {jourData.horaires.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={slot.debut}
                            onChange={(e) => handleSlotChange(jour, index, 'debut', e.target.value)}
                            disabled={!isEditing}
                            className="w-32"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={slot.fin}
                            onChange={(e) => handleSlotChange(jour, index, 'fin', e.target.value)}
                            disabled={!isEditing}
                            className="w-32"
                          />
                          {isEditing && jourData.horaires.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSlot(jour, index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

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
            Modifier les Horaires
          </Button>
        )}
      </div>
    </div>
  );
}

