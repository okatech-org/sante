import { useState } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, Edit, Trash2, UserPlus,
  CheckCircle, XCircle, AlertCircle, Eye, Shield, Building2, Calendar, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { HospitalDashboardLayout } from '@/components/layout/HospitalDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DemoStaffManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Obtenir les dates de la semaine actuelle
  const getWeekDates = (offset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + (offset * 7);
    const monday = new Date(today.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekOffset);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Créneaux horaires
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Planning exemple pour chaque membre
  const scheduleData = {
    '1': { // Dr. OBAME Jean
      'Lun': [{ start: '08:00', end: '16:00', type: 'consultation', label: 'Consultations' }],
      'Mar': [{ start: '08:00', end: '16:00', type: 'consultation', label: 'Consultations' }],
      'Mer': [{ start: '08:00', end: '16:00', type: 'consultation', label: 'Consultations' }],
      'Jeu': [{ start: '08:00', end: '16:00', type: 'consultation', label: 'Consultations' }],
      'Ven': [{ start: '08:00', end: '16:00', type: 'consultation', label: 'Consultations' }],
    },
    '2': { // Inf. NDONG Marie
      'Lun': [{ start: '08:00', end: '18:00', type: 'nursing', label: 'Soins' }],
      'Mar': [{ start: '08:00', end: '18:00', type: 'nursing', label: 'Soins' }],
      'Mer': [{ start: '08:00', end: '18:00', type: 'nursing', label: 'Soins' }],
      'Jeu': [{ start: '08:00', end: '18:00', type: 'nursing', label: 'Soins' }],
      'Ven': [{ start: '08:00', end: '18:00', type: 'nursing', label: 'Soins' }],
    },
    '3': { // Dr. ELLA Sophie
      'Mar': [{ start: '09:00', end: '17:00', type: 'surgery', label: 'Chirurgie' }],
      'Mer': [{ start: '09:00', end: '17:00', type: 'surgery', label: 'Chirurgie' }],
      'Jeu': [{ start: '09:00', end: '17:00', type: 'surgery', label: 'Chirurgie' }],
    },
    '4': { // MOUKAGNI Paul
      'Lun': [{ start: '07:00', end: '15:00', type: 'admin', label: 'Admission' }],
      'Mar': [{ start: '07:00', end: '15:00', type: 'admin', label: 'Admission' }],
      'Mer': [{ start: '07:00', end: '15:00', type: 'admin', label: 'Admission' }],
      'Jeu': [{ start: '07:00', end: '15:00', type: 'admin', label: 'Admission' }],
      'Ven': [{ start: '07:00', end: '15:00', type: 'admin', label: 'Admission' }],
      'Sam': [{ start: '07:00', end: '15:00', type: 'admin', label: 'Admission' }],
    },
  };

  const getScheduleColor = (type: string) => {
    const colors = {
      consultation: 'bg-blue-500/20 border-blue-500/40 text-blue-700',
      nursing: 'bg-green-500/20 border-green-500/40 text-green-700',
      surgery: 'bg-purple-500/20 border-purple-500/40 text-purple-700',
      admin: 'bg-orange-500/20 border-orange-500/40 text-orange-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/40 text-gray-700';
  };

  // Données exemple établissement
  const establishment = {
    id: '1',
    name: 'CHU Owendo',
    type: 'hospital',
    province: 'Estuaire',
    city: 'Libreville',
    status: 'active'
  };

  // Staff exemple avec multi-établissements
  const staffMembers = [
    {
      id: '1',
      name: 'Dr. OBAME Jean',
      email: 'obame@sante.ga',
      profession: 'Médecin Généraliste',
      role: 'Chef Service Médecine',
      isAdmin: true,
      status: 'active',
      schedule: 'Lun-Ven 8h-16h',
      startDate: '2023-01-15',
      otherEstablishments: [
        { name: 'Clinique Sainte-Marie', role: 'Consultant' },
        { name: 'Cabinet Glass', role: 'Propriétaire' }
      ],
      permissions: ['all_medical', 'staff_manage', 'planning', 'consultations', 'prescriptions']
    },
    {
      id: '2',
      name: 'Inf. NDONG Marie',
      email: 'ndong@sante.ga',
      profession: 'Infirmière',
      role: 'Infirmière Chef',
      isAdmin: true,
      status: 'active',
      schedule: 'Lun-Ven 8h-18h',
      startDate: '2022-06-01',
      otherEstablishments: [],
      permissions: ['nursing', 'medication', 'patient_care', 'staff_planning']
    },
    {
      id: '3',
      name: 'Dr. ELLA Sophie',
      email: 'ella@sante.ga',
      profession: 'Chirurgienne',
      role: 'Chirurgien',
      isAdmin: false,
      status: 'active',
      schedule: 'Mar-Jeu 9h-17h',
      startDate: '2024-01-10',
      otherEstablishments: [
        { name: 'Polyclinique El-Rapha', role: 'Chirurgien Senior' }
      ],
      permissions: ['surgery', 'consultations', 'bloc_access']
    },
    {
      id: '4',
      name: 'MOUKAGNI Paul',
      email: 'moukagni@sante.ga',
      profession: 'Administrateur',
      role: 'Responsable Admission',
      isAdmin: false,
      status: 'active',
      schedule: 'Lun-Sam 7h-15h',
      startDate: '2021-03-20',
      otherEstablishments: [],
      permissions: ['admission', 'billing', 'patient_registration']
    }
  ];

  const pendingRequests = [
    {
      id: '1',
      name: 'Dr. Pierre KOMBILA',
      email: 'p.kombila@sante.ga',
      profession: 'Médecin Généraliste',
      requestedRole: 'Médecin Consultant',
      requestDate: '2025-10-09',
      status: 'pending'
    }
  ];

  const permissionsList = {
    medical: [
      { id: 'consultations', label: 'Consultations', description: 'Effectuer des consultations' },
      { id: 'prescriptions', label: 'Prescriptions', description: 'Prescrire médicaments et examens' },
      { id: 'dmp_read', label: 'Lecture DMP', description: 'Consulter dossiers médicaux' },
      { id: 'dmp_write', label: 'Écriture DMP', description: 'Modifier dossiers médicaux' },
      { id: 'surgery', label: 'Chirurgie', description: 'Accès bloc opératoire' },
      { id: 'all_medical', label: 'Tout Médical', description: 'Accès complet médical' }
    ],
    administrative: [
      { id: 'admission', label: 'Admission', description: 'Enregistrer patients' },
      { id: 'billing', label: 'Facturation', description: 'Gérer factures' },
      { id: 'staff_manage', label: 'Gestion Staff', description: 'Ajouter/modifier personnel' },
      { id: 'planning', label: 'Planning', description: 'Gérer plannings' },
      { id: 'equipment', label: 'Équipements', description: 'Gérer matériel médical' }
    ],
    nursing: [
      { id: 'nursing', label: 'Soins Infirmiers', description: 'Prodiguer soins' },
      { id: 'medication', label: 'Médication', description: 'Administrer médicaments' },
      { id: 'patient_care', label: 'Suivi Patient', description: 'Surveillance patients' }
    ]
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* En-tête établissement */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{establishment.name}</h1>
                  <p className="text-sm text-muted-foreground">{establishment.city}, {establishment.province}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="staff" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="staff" className="gap-2">
              <Users className="h-4 w-4" />
              Personnel ({staffMembers.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Demandes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              Planning
            </TabsTrigger>
          </TabsList>

          {/* Onglet Personnel */}
          <TabsContent value="staff" className="space-y-4">
            {/* Barre de recherche et actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un membre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setShowAddModal(true)} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Ajouter Personnel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste du personnel */}
            <div className="space-y-4">
              {staffMembers.map(member => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold">{member.name}</h3>
                          {member.isAdmin && (
                            <Badge variant="destructive" className="text-xs">
                              ADMIN
                            </Badge>
                          )}
                          <Badge variant="outline" className={
                            member.status === 'active' 
                              ? 'bg-green-500/20 text-green-700 border-green-500/30'
                              : 'bg-gray-500/20 text-gray-700 border-gray-500/30'
                          }>
                            {member.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-y-2 text-sm mb-3">
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Profession:</span> {member.profession}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Rôle:</span> {member.role}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Email:</span> {member.email}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Planning:</span> {member.schedule}
                          </p>
                        </div>

                        {/* Autres établissements */}
                        {member.otherEstablishments.length > 0 && (
                          <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-xs font-semibold mb-2">
                              🏥 Intervient aussi dans {member.otherEstablishments.length} autre(s) établissement(s):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {member.otherEstablishments.map((est, idx) => (
                                <Badge key={idx} variant="outline" className="bg-background">
                                  <strong>{est.name}</strong> ({est.role})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Permissions */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.permissions.map((perm, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Demandes */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm">
                  <strong>ℹ️ Demandes d&apos;accès:</strong> Les professionnels peuvent demander à rejoindre 
                  votre établissement. Validez leur profil et assignez-leur un rôle.
                </p>
              </CardContent>
            </Card>

            {pendingRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold shrink-0">
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{request.name}</h3>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Profession:</span> {request.profession}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Rôle souhaité:</span> {request.requestedRole}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Demande reçue le {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" className="gap-2 bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20">
                        <CheckCircle className="h-4 w-4" />
                        Approuver
                      </Button>
                      <Button variant="outline" className="gap-2 bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20">
                        <XCircle className="h-4 w-4" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Onglet Permissions */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(permissionsList).map(([category, perms]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 capitalize">{category}</h4>
                    <div className="space-y-2">
                      {perms.map(perm => (
                        <div key={perm.id} className="flex items-start gap-3 p-2 hover:bg-muted rounded">
                          <div className="pt-1">
                            <Badge variant="secondary" className="text-xs">{perm.id}</Badge>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{perm.label}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Planning */}
          <TabsContent value="schedule" className="space-y-4">
            {/* Navigation semaine */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Semaine précédente
                  </Button>
                  
                  <div className="text-center">
                    <h3 className="font-bold text-lg">
                      {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - {weekDates[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Planning hebdomadaire du personnel
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currentWeekOffset !== 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentWeekOffset(0)}
                      >
                        Aujourd&apos;hui
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                      className="gap-2"
                    >
                      Semaine suivante
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Planning pour chaque membre */}
            {staffMembers.map(member => (
              <Card key={member.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-3 w-3" />
                      Modifier planning
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 gap-2">
                    {/* En-tête des jours */}
                    <div className="text-xs font-medium text-muted-foreground flex items-end pb-2">
                      <Clock className="h-3 w-3" />
                    </div>
                    {weekDays.map((day, idx) => {
                      const date = weekDates[idx];
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <div key={day} className={`text-center pb-2 ${isToday ? 'text-primary font-bold' : ''}`}>
                          <div className="text-xs font-medium">{day}</div>
                          <div className="text-xs text-muted-foreground">
                            {date.getDate()}
                          </div>
                        </div>
                      );
                    })}

                    {/* Grille horaire simplifiée */}
                    <div className="col-span-8 grid grid-cols-8 gap-2 min-h-[100px]">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>7h</div>
                        <div>12h</div>
                        <div>17h</div>
                      </div>
                      
                      {weekDays.map((day) => {
                        const daySchedule = scheduleData[member.id as keyof typeof scheduleData]?.[day];
                        return (
                          <div key={day} className="relative border rounded-md bg-muted/20 min-h-[100px] p-1">
                            {daySchedule?.map((slot, idx) => (
                              <div
                                key={idx}
                                className={`rounded px-2 py-1 text-xs font-medium border ${getScheduleColor(slot.type)}`}
                              >
                                <div className="font-semibold">{slot.label}</div>
                                <div className="text-[10px] opacity-80">
                                  {slot.start} - {slot.end}
                                </div>
                              </div>
                            ))}
                            {!daySchedule && (
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">
                                Repos
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Légende */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Légende</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/40"></div>
                    <span className="text-xs">Consultations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/40"></div>
                    <span className="text-xs">Soins infirmiers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/40"></div>
                    <span className="text-xs">Chirurgie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/40"></div>
                    <span className="text-xs">Administration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Ajout Personnel */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un Membre du Personnel</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Recherche professionnels existants */}
              <div>
                <Label className="mb-2 block">
                  1. Rechercher un Professionnel Existant
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Email ou nom du professionnel..."
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Si le professionnel existe déjà sur SANTE.GA, cherchez-le ici. 
                  Son profil sera partagé avec les bonnes permissions.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">OU</span>
                </div>
              </div>

              {/* Création nouveau professionnel */}
              <div>
                <Label className="mb-2 block">
                  2. Créer un Nouveau Compte Professionnel
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Nom complet" />
                  <Input type="email" placeholder="Email" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Médecin</SelectItem>
                      <SelectItem value="nurse">Infirmier(ère)</SelectItem>
                      <SelectItem value="midwife">Sage-femme</SelectItem>
                      <SelectItem value="technician">Technicien(ne)</SelectItem>
                      <SelectItem value="admin">Administratif</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Spécialité" />
                </div>
              </div>

              {/* Rôle dans établissement */}
              <div>
                <Label className="mb-2 block">
                  3. Rôle dans {establishment.name}
                </Label>
                <Input
                  placeholder="Ex: Médecin Généraliste, Chef Service, Administrateur..."
                />
                <div className="mt-3 flex items-center gap-2">
                  <Checkbox id="admin" />
                  <Label htmlFor="admin" className="font-medium cursor-pointer">
                    Administrateur de l&apos;établissement
                  </Label>
                </div>
              </div>

              {/* Planning */}
              <div>
                <Label className="mb-2 block">
                  4. Planning (Optionnel)
                </Label>
                <Textarea
                  placeholder="Ex: Lundi-Vendredi 8h-16h, Garde le weekend..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </HospitalDashboardLayout>
  );
}
