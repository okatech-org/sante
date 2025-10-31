import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, User, Heart, Thermometer, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export default function AccueilUrgencesTriagePage() {
  const [gravite, setGravite] = useState('3');

  const niveauxGravite = [
    { value: '1', label: 'Niveau 1 - Urgence vitale', color: 'bg-red-600', desc: 'Réanimation immédiate' },
    { value: '2', label: 'Niveau 2 - Très urgent', color: 'bg-orange-600', desc: 'Prise en charge < 10 min' },
    { value: '3', label: 'Niveau 3 - Urgent', color: 'bg-yellow-600', desc: 'Prise en charge < 60 min' },
    { value: '4', label: 'Niveau 4 - Peu urgent', color: 'bg-green-600', desc: 'Prise en charge < 2h' },
    { value: '5', label: 'Niveau 5 - Non urgent', color: 'bg-blue-600', desc: 'Peut attendre ou réorientation' }
  ];

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header avec bouton urgence vitale */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Triage Rapide</h1>
            <p className="text-muted-foreground">Évaluation et orientation des patients urgents</p>
          </div>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="mr-2 h-5 w-5" />
            URGENCE VITALE
          </Button>
        </div>

        {/* Formulaire de triage */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations patient */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Identification du patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" placeholder="Nom du patient" />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" placeholder="Prénom du patient" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Âge</Label>
                  <Input id="age" type="number" placeholder="Âge" />
                </div>
                <div>
                  <Label htmlFor="sexe">Sexe</Label>
                  <RadioGroup defaultValue="M" className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="M" />
                      <Label htmlFor="M">Masculin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="F" />
                      <Label htmlFor="F">Féminin</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" placeholder="Numéro de téléphone" />
              </div>
              <div>
                <Label htmlFor="motif">Motif de consultation</Label>
                <Textarea 
                  id="motif" 
                  placeholder="Décrire brièvement le motif de consultation..." 
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Évaluation de gravité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Niveau de gravité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={gravite} onValueChange={setGravite}>
                {niveauxGravite.map((niveau) => (
                  <div key={niveau.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={niveau.value} id={`gravite-${niveau.value}`} />
                    <Label htmlFor={`gravite-${niveau.value}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${niveau.color}`} />
                        <span className="font-semibold">{niveau.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{niveau.desc}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Constantes vitales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Constantes vitales (Obligatoire pour niveaux 1-3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              <div>
                <Label htmlFor="ta">Tension artérielle</Label>
                <Input id="ta" placeholder="120/80" />
              </div>
              <div>
                <Label htmlFor="fc">Fréquence cardiaque</Label>
                <div className="flex gap-2">
                  <Input id="fc" type="number" placeholder="80" />
                  <span className="self-center text-sm text-muted-foreground">bpm</span>
                </div>
              </div>
              <div>
                <Label htmlFor="temp">Température</Label>
                <div className="flex gap-2">
                  <Input id="temp" type="number" step="0.1" placeholder="37.0" />
                  <span className="self-center text-sm text-muted-foreground">°C</span>
                </div>
              </div>
              <div>
                <Label htmlFor="spo2">Saturation O₂</Label>
                <div className="flex gap-2">
                  <Input id="spo2" type="number" placeholder="98" />
                  <span className="self-center text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <Label htmlFor="douleur">Échelle douleur</Label>
                <Input id="douleur" type="number" min="0" max="10" placeholder="0-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes et actions */}
        <Card>
          <CardHeader>
            <CardTitle>Notes complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Antécédents médicaux, allergies, médicaments en cours, observations cliniques..." 
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline">Annuler</Button>
              <Button variant="outline">Sauvegarder brouillon</Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Valider le triage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de triage du jour */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de triage - Aujourd'hui</CardTitle>
            <CardDescription>Répartition des patients par niveau de gravité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {niveauxGravite.map((niveau) => (
                <div key={niveau.value} className="text-center">
                  <div className={`h-2 ${niveau.color} rounded-full mb-2`} />
                  <div className="font-bold text-2xl">{Math.floor(Math.random() * 20)}</div>
                  <div className="text-xs text-muted-foreground">Niveau {niveau.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
