import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, Calendar, Stethoscope, Pill, Video, Clock,
  ArrowUpRight, FileText, Activity, CheckCircle, AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { currentEstablishment } = useMultiEstablishment();

  // Stats Médecin
  const doctorStats = {
    todayPatients: 12,
    todayAppointments: 8,
    confirmedAppointments: 5,
    weekConsultations: 45,
    monthPrescriptions: 132,
    satisfactionRate: 96,
    avgConsultationTime: 25,
    teleconsultations: 8
  };

  // RDV du jour
  const todayAppointments = [
    { id: 1, time: '09:00', patient: 'Marie MOUSSAVOU', type: 'Consultation générale', status: 'confirmed' },
    { id: 2, time: '10:30', patient: 'Jean NZENGUE', type: 'Suivi post-opératoire', status: 'confirmed' },
    { id: 3, time: '11:30', patient: 'Sophie KOMBILA', type: 'Consultation pédiatrie', status: 'pending' },
    { id: 4, time: '14:00', patient: 'Pierre OBAME', type: 'Téléconsultation', status: 'confirmed' },
    { id: 5, time: '15:30', patient: 'André NGUEMA', type: 'Urgence', status: 'pending' }
  ];

  // Patients à suivre
  const patientsToFollow = [
    { id: 1, name: 'Marie MOUSSAVOU', condition: 'Diabète Type 2', lastVisit: '2025-01-25', nextAction: 'Contrôle glycémie', priority: 'normal' },
    { id: 2, name: 'Jean NZENGUE', condition: 'Post-opératoire', lastVisit: '2025-01-28', nextAction: 'Retrait fils', priority: 'high' },
    { id: 3, name: 'André NGUEMA', condition: 'Hypertension', lastVisit: '2025-01-20', nextAction: 'Renouvellement traitement', priority: 'normal' }
  ];

  // Prescriptions récentes
  const recentPrescriptions = [
    { id: 1, patient: 'Marie MOUSSAVOU', medications: 3, date: '2025-01-30', status: 'delivered' },
    { id: 2, patient: 'Jean NZENGUE', medications: 2, date: '2025-01-30', status: 'pending' },
    { id: 3, patient: 'Sophie KOMBILA', medications: 1, date: '2025-01-29', status: 'delivered' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Médical</h1>
        <p className="text-muted-foreground mt-1">
          {currentEstablishment?.establishment_name || 'CMST SOGARA'} - Mon activité médicale
        </p>
      </div>

      {/* Stats Médicales principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">
                Aujourd'hui
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400 mb-1">
                Consultations
              </p>
              <h3 className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{doctorStats.todayPatients}</h3>
              <p className="text-xs text-cyan-600 dark:text-cyan-500 mt-2">
                Patients du jour
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-cyan-200/30 dark:bg-cyan-800/20"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                {doctorStats.confirmedAppointments} confirmés
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                Rendez-vous
              </p>
              <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{doctorStats.todayAppointments}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                Planifiés
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-emerald-200/30 dark:bg-emerald-800/20"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                <Pill className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 gap-1">
                <TrendingUp className="h-3 w-3" />
                +8%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-violet-700 dark:text-violet-400 mb-1">
                Prescriptions
              </p>
              <h3 className="text-3xl font-bold text-violet-900 dark:text-violet-100">{doctorStats.monthPrescriptions}</h3>
              <p className="text-xs text-violet-600 dark:text-violet-500 mt-2">
                Ce mois
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-violet-200/30 dark:bg-violet-800/20"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Digital
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                Téléconsultations
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">{doctorStats.teleconsultations}</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                Cette semaine
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-200/30 dark:bg-blue-800/20"></div>
        </Card>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes consultations du jour */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Planning du jour
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="default">{todayAppointments.length} RDV</Badge>
                <Button size="sm" variant="outline" onClick={() => navigate('/professional/appointments')}>
                  Voir tout →
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl flex items-center justify-between ${
                    apt.status === 'confirmed' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500' 
                      : 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-l-orange-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{apt.time.split(':')[0]}</div>
                      <div className="text-xs text-muted-foreground">{apt.time.split(':')[1]}</div>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div>
                      <p className="font-semibold">{apt.patient}</p>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                  <Badge variant={apt.status === 'confirmed' ? 'secondary' : 'default'}>
                    {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Patients à suivre */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Patients à suivre
              </h3>
              <Button size="sm" variant="outline" onClick={() => navigate('/professional/patients')}>
                Voir tout →
              </Button>
            </div>
            
            <div className="space-y-3">
              {patientsToFollow.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-xl ${
                    patient.priority === 'high'
                      ? 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-l-orange-500'
                      : 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    </div>
                    {patient.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Prioritaire
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Dernière visite: {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="mt-2 p-2 bg-white dark:bg-slate-800/50 rounded text-xs">
                    À faire: {patient.nextAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Grille 3 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescriptions récentes */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                <Pill className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
              <h3 className="text-lg font-semibold">Prescriptions récentes</h3>
            </div>
            <div className="space-y-3">
              {recentPrescriptions.map((presc) => (
                <div key={presc.id} className="p-3 rounded-xl bg-muted/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{presc.patient}</span>
                    <Badge variant={presc.status === 'delivered' ? 'secondary' : 'default'}>
                      {presc.status === 'delivered' ? 'Délivrée' : 'En attente'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{presc.medications} médicaments</span>
                    <span>•</span>
                    <span>{new Date(presc.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm" onClick={() => navigate('/professional/prescriptions')}>
              Voir toutes les prescriptions
            </Button>
          </div>
        </Card>

        {/* Statistiques médicales */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              </div>
              <h3 className="text-lg font-semibold">Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800/50">
                <span className="text-sm font-medium">Consultations semaine</span>
                <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{doctorStats.weekConsultations}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800/50">
                <span className="text-sm font-medium">Temps moyen</span>
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">{doctorStats.avgConsultationTime}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800/50">
                <span className="text-sm font-medium">Satisfaction</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">{doctorStats.satisfactionRate}%</span>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activité numérique */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Télémédecine</h3>
              <Badge className="bg-white/20 text-white border-0">
                <Video className="h-3 w-3 mr-1" />
                Digital
              </Badge>
            </div>
            <div className="mb-6">
              <h2 className="text-4xl font-bold">{doctorStats.teleconsultations}</h2>
              <p className="text-blue-100 text-sm mt-1">Téléconsultations cette semaine</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-white/10">
                <span className="text-sm">Planifiées aujourd'hui</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-white/10">
                <span className="text-sm">Taux de complétion</span>
                <span className="font-bold">94%</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-white/10"></div>
        </Card>
      </div>

      {/* Actions rapides Médecin */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6">Actions rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/professional/consultations')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">Consultation</p>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">Démarrer</p>
            </button>

            <button 
              onClick={() => navigate('/professional/appointments')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Agenda</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Planning</p>
            </button>

            <button 
              onClick={() => navigate('/professional/patients')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">Patients</p>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">Dossiers</p>
            </button>

            <button 
              onClick={() => navigate('/professional/teleconsultations')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Téléconsultation</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Vidéo</p>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
