// ============================================
// MANAGER: Équipe Pharmacie
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pharmacie, ProfessionnelSantePharmacie } from '@/types/pharmacy';
import { Users, UserPlus, Mail, Phone, Shield, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useToggleEmployeeStatus,
  useUpdateEmployeePermissions,
} from '@/hooks/usePharmacyProfessionals';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PharmacyTeamManagerProps {
  pharmacyId: string;
  pharmacy: Pharmacie;
  employees: ProfessionnelSantePharmacie[];
}

export function PharmacyTeamManager({ pharmacyId, pharmacy, employees }: PharmacyTeamManagerProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<ProfessionnelSantePharmacie | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  const { mutate: toggleStatus } = useToggleEmployeeStatus();

  const handleToggleStatus = (employee: ProfessionnelSantePharmacie) => {
    toggleStatus({
      employeeId: employee.id,
      active: !employee.compte_actif,
      motif: employee.compte_actif ? 'Désactivation temporaire' : undefined,
    });
  };

  const handleInvite = () => {
    console.log('Invite:', inviteEmail);
    setInviteDialogOpen(false);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Équipe de la Pharmacie
              </CardTitle>
              <CardDescription>
                {employees.length} membre{employees.length > 1 ? 's' : ''} • {employees.filter(e => e.compte_actif).length} actif{employees.filter(e => e.compte_actif).length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inviter un Employé</DialogTitle>
                  <DialogDescription>
                    Envoyez une invitation par email pour rejoindre l'équipe
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="invite_email">Email *</Label>
                    <Input
                      id="invite_email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="employe@email.com"
                    />
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      L'employé recevra un lien d'inscription avec rattachement automatique à cette pharmacie.
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleInvite}>
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer l'Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((employee) => (
              <Card key={employee.id} className={!employee.compte_actif ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {employee.nom_complet?.charAt(0) || '?'}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{employee.nom_complet}</p>
                            {employee.est_pharmacien_titulaire && (
                              <Badge variant="default" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Titulaire
                              </Badge>
                            )}
                            {!employee.compte_actif && (
                              <Badge variant="destructive" className="text-xs">Inactif</Badge>
                            )}
                            {employee.statut_verification === 'verifie' && (
                              <Badge variant="outline" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {employee.type_professionnel === 'dr_pharmacie' 
                              ? 'Docteur en Pharmacie' 
                              : 'Vendeur en Pharmacie'}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {employee.telephone_mobile && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {employee.telephone_mobile}
                            </div>
                          )}
                          {employee.email_professionnel && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email_professionnel}
                            </div>
                          )}
                        </div>

                        {employee.numero_inscription_onpg && (
                          <p className="text-xs text-muted-foreground">
                            ONPG: {employee.numero_inscription_onpg}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {employee.acces_gestion_stocks && (
                            <Badge variant="outline" className="text-xs">Stocks</Badge>
                          )}
                          {employee.acces_facturation && (
                            <Badge variant="outline" className="text-xs">Facturation</Badge>
                          )}
                          {employee.acces_rapports_activite && (
                            <Badge variant="outline" className="text-xs">Rapports</Badge>
                          )}
                          {employee.acces_administration && (
                            <Badge variant="outline" className="text-xs">Admin</Badge>
                          )}
                        </div>

                        {employee.supervise_par && (
                          <p className="text-xs text-muted-foreground">
                            Supervisé par: {employee.supervise_par.nom_complet}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!employee.est_pharmacien_titulaire && (
                        <Button
                          variant={employee.compte_actif ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(employee)}
                        >
                          {employee.compte_actif ? 'Désactiver' : 'Activer'}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {employees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun employé enregistré</p>
                <Button className="mt-4" onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter le Premier Employé
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {employees.some(e => e.statut_verification === 'en_attente') && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Certains employés sont en attente de vérification. Vérifiez leurs documents avant validation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

