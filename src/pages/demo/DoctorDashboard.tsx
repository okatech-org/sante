import React from 'react';
import EstablishmentDashboardLayout from '@/components/layout/EstablishmentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const DEMO_DATA = {
  stats: [
    { icon: Users, label: 'Patients Aujourd\'hui', value: '12', trend: '+2 vs hier' },
    { icon: Calendar, label: 'RDV Programmés', value: '28', trend: 'Cette semaine' },
    { icon: FileText, label: 'Prescriptions', value: '45', trend: 'Ce mois' },
    { icon: TrendingUp, label: 'Satisfaction', value: '98%', trend: 'Très bon' }
  ],
  appointments: [
    { id: 1, patient: 'Alain MBIKA', time: '09:00', type: 'Consultation', status: 'confirmed' },
    { id: 2, patient: 'Lucie NZEME', time: '10:30', type: 'Examen Médical', status: 'confirmed' },
    { id: 3, patient: 'Jean ONDOUA', time: '14:00', type: 'Suivi', status: 'pending' },
  ],
  recentPatients: [
    { id: 1, name: 'Pierre ONGOUA', lastVisit: '2025-01-20', status: 'active' },
    { id: 2, name: 'Marie EBONE', lastVisit: '2025-01-18', status: 'active' },
    { id: 3, name: 'Olivier BEKILI', lastVisit: '2025-01-15', status: 'inactive' },
  ]
};

export default function DoctorDashboard() {
  return (
    <EstablishmentDashboardLayout
      userRole="doctor"
      userName="Dr. Jean-Paul NZENZE"
      userEmail="medecin.cmst@sogara.ga"
      establishmentName="CMST SOGARA"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {DEMO_DATA.stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
                  </div>
                  <Icon className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Today */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Rendez-vous Aujourd'hui
              </CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_DATA.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {apt.patient.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{apt.patient}</p>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{apt.time}</p>
                      {apt.status === 'confirmed' ? (
                        <span className="text-xs text-green-600 flex items-center justify-end gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Confirmé
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-600 flex items-center justify-end gap-1 mt-1">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Nouvelle Prescription
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Ajouter Patient
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Planifier RDV
              </Button>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Patient en retard
                  </p>
                  <p className="text-xs text-amber-800">
                    RDV prévu à 09:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Patients */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Patients Récents
          </CardTitle>
          <Button variant="ghost" size="sm">
            Voir tous <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_DATA.recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                  {patient.name.charAt(0)}
                </div>
                <p className="font-semibold text-gray-900 mb-1">{patient.name}</p>
                <p className="text-sm text-gray-600 mb-3">
                  Dernière visite: {patient.lastVisit}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Dossier
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    RDV
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </EstablishmentDashboardLayout>
  );
}
