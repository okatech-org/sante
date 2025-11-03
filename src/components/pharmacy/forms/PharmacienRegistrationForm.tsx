// ============================================
// FORMULAIRE: Inscription Dr en Pharmacie
// Date: 3 novembre 2025
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { InscriptionPharmacienFormData, validatePharmacienForm } from '@/types/pharmacy';
import { useRegisterPharmacien } from '@/hooks/usePharmacyProfessionals';

export function PharmacienRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<InscriptionPharmacienFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: register, isPending, isSuccess } = useRegisterPharmacien();

  const handleStepSubmit = (stepData: Partial<InscriptionPharmacienFormData>) => {
    setFormData({ ...formData, ...stepData });
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      const completeData = { ...formData, ...stepData } as InscriptionPharmacienFormData;
      const validationErrors = validatePharmacienForm(completeData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      register(completeData);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            Inscription Réussie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Votre compte a été créé avec succès. Vous recevrez un email de confirmation 
              une fois que votre profil aura été vérifié par l'administration (sous 48h).
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Prochaines étapes :</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Télécharger copie de votre diplôme</li>
              <li>Télécharger copie de votre carte ONPG</li>
              <li>Télécharger copie de votre CNI</li>
              <li>Attendre la validation administrative</li>
            </ol>
          </div>

          <Button onClick={() => window.location.href = '/login'} className="w-full">
            Se connecter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${step >= s ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'}
            `}>
              {s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Informations Personnelles */}
      {step === 1 && (
        <StepOne 
          data={formData} 
          onSubmit={handleStepSubmit} 
          errors={errors}
        />
      )}

      {/* Step 2: Formation & ONPG */}
      {step === 2 && (
        <StepTwo 
          data={formData} 
          onSubmit={handleStepSubmit} 
          onBack={() => setStep(1)}
          errors={errors}
        />
      )}

      {/* Step 3: Pharmacie & Compte */}
      {step === 3 && (
        <StepThree 
          data={formData} 
          onSubmit={handleStepSubmit} 
          onBack={() => setStep(2)}
          errors={errors}
          isPending={isPending}
        />
      )}
    </div>
  );
}

// ============================================
// STEP 1: Informations Personnelles
// ============================================

function StepOne({ 
  data, 
  onSubmit, 
  errors 
}: { 
  data: Partial<InscriptionPharmacienFormData>; 
  onSubmit: (data: Partial<InscriptionPharmacienFormData>) => void;
  errors: Record<string, string>;
}) {
  const [formData, setFormData] = useState({
    nom: data.nom || '',
    prenom: data.prenom || '',
    sexe: data.sexe || 'M',
    date_naissance: data.date_naissance || '',
    nationalite: data.nationalite || 'Gabonaise',
    telephone_mobile: data.telephone_mobile || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Personnelles</CardTitle>
        <CardDescription>Étape 1/3 - Vos informations de base</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> La nationalité gabonaise est <strong>obligatoire</strong> pour 
              les Docteurs en Pharmacie selon les règlements de l'ONPG.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className={errors.nom ? 'border-red-500' : ''}
              />
              {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
            </div>

            <div>
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className={errors.prenom ? 'border-red-500' : ''}
              />
              {errors.prenom && <p className="text-sm text-red-500 mt-1">{errors.prenom}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="sexe">Sexe</Label>
              <Select value={formData.sexe} onValueChange={(v) => setFormData({ ...formData, sexe: v as 'M' | 'F' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date_naissance">Date de Naissance</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nationalite">Nationalité * (Gabonaise OBLIGATOIRE)</Label>
            <Input
              id="nationalite"
              value="Gabonaise"
              disabled
              className="bg-muted"
            />
            {errors.nationalite && <p className="text-sm text-red-500 mt-1">{errors.nationalite}</p>}
          </div>

          <div>
            <Label htmlFor="telephone_mobile">Téléphone Mobile *</Label>
            <Input
              id="telephone_mobile"
              type="tel"
              placeholder="+241 XX XX XX XX"
              value={formData.telephone_mobile}
              onChange={(e) => setFormData({ ...formData, telephone_mobile: e.target.value })}
              className={errors.telephone_mobile ? 'border-red-500' : ''}
            />
            {errors.telephone_mobile && <p className="text-sm text-red-500 mt-1">{errors.telephone_mobile}</p>}
          </div>

          <Button type="submit" className="w-full">
            Suivant
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================
// STEP 2: Formation & ONPG
// ============================================

function StepTwo({ 
  data, 
  onSubmit, 
  onBack,
  errors 
}: { 
  data: Partial<InscriptionPharmacienFormData>; 
  onSubmit: (data: Partial<InscriptionPharmacienFormData>) => void;
  onBack: () => void;
  errors: Record<string, string>;
}) {
  const [formData, setFormData] = useState({
    diplome_pharmacie: data.diplome_pharmacie || '',
    universite: data.universite || '',
    annee_obtention_diplome: data.annee_obtention_diplome || new Date().getFullYear(),
    numero_inscription_onpg: data.numero_inscription_onpg || '',
    date_inscription_onpg: data.date_inscription_onpg || '',
    annees_experience: data.annees_experience || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formation & Inscription ONPG</CardTitle>
        <CardDescription>Étape 2/3 - Vos qualifications professionnelles</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <strong>Requis ONPG:</strong> Votre numéro d'inscription à l'Ordre National 
              des Pharmaciens du Gabon est <strong>obligatoire</strong>. 
              Contact ONPG: +241 76 87 99 00
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="diplome">Diplôme de Pharmacie *</Label>
            <Input
              id="diplome"
              placeholder="Doctorat d'État en Pharmacie"
              value={formData.diplome_pharmacie}
              onChange={(e) => setFormData({ ...formData, diplome_pharmacie: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="universite">Université *</Label>
              <Input
                id="universite"
                placeholder="Université des Sciences de la Santé Libreville"
                value={formData.universite}
                onChange={(e) => setFormData({ ...formData, universite: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="annee">Année d'Obtention *</Label>
              <Input
                id="annee"
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                value={formData.annee_obtention_diplome}
                onChange={(e) => setFormData({ ...formData, annee_obtention_diplome: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="onpg">Numéro Inscription ONPG *</Label>
              <Input
                id="onpg"
                placeholder="ONPG-GAB-XXXX-XXX"
                value={formData.numero_inscription_onpg}
                onChange={(e) => setFormData({ ...formData, numero_inscription_onpg: e.target.value })}
                className={errors.numero_inscription_onpg ? 'border-red-500' : ''}
              />
              {errors.numero_inscription_onpg && (
                <p className="text-sm text-red-500 mt-1">{errors.numero_inscription_onpg}</p>
              )}
            </div>

            <div>
              <Label htmlFor="date_onpg">Date Inscription ONPG *</Label>
              <Input
                id="date_onpg"
                type="date"
                value={formData.date_inscription_onpg}
                onChange={(e) => setFormData({ ...formData, date_inscription_onpg: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="experience">Années d'Expérience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.annees_experience}
              onChange={(e) => setFormData({ ...formData, annees_experience: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Retour
            </Button>
            <Button type="submit" className="flex-1">
              Suivant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================
// STEP 3: Compte & Validation
// ============================================

function StepThree({ 
  data, 
  onSubmit, 
  onBack,
  errors,
  isPending
}: { 
  data: Partial<InscriptionPharmacienFormData>; 
  onSubmit: (data: Partial<InscriptionPharmacienFormData>) => void;
  onBack: () => void;
  errors: Record<string, string>;
  isPending: boolean;
}) {
  const [formData, setFormData] = useState({
    email: data.email || '',
    password: data.password || '',
    password_confirmation: data.password_confirmation || '',
    est_pharmacien_titulaire: data.est_pharmacien_titulaire || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Création de Compte</CardTitle>
        <CardDescription>Étape 3/3 - Finalisation de votre inscription</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Professionnel *</Label>
            <Input
              id="email"
              type="email"
              placeholder="dr.pharmacie@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">Mot de Passe *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 caractères"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="password_confirmation">Confirmer Mot de Passe *</Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Répéter le mot de passe"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              className={errors.password_confirmation ? 'border-red-500' : ''}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-red-500 mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="titulaire"
              checked={formData.est_pharmacien_titulaire}
              onChange={(e) => setFormData({ ...formData, est_pharmacien_titulaire: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="titulaire" className="cursor-pointer">
              Je suis pharmacien titulaire (propriétaire)
            </Label>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              En vous inscrivant, vous acceptez que vos informations soient vérifiées par 
              l'administration SANTE.GA et l'ONPG. Votre compte sera activé sous 48h après validation.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isPending}>
              Retour
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? 'Inscription...' : 'Créer mon compte'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PharmacienRegistrationForm;

