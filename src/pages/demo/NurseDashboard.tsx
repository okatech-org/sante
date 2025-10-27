import React from 'react';
import EstablishmentDashboardLayout from '@/components/layout/EstablishmentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Thermometer,
  ChevronRight,
  Pill
} from "lucide-react";

const DEMO_DATA = {
  stats: [
    { icon: Users, label: 'Patients Soignés', value: '18', trend: 'Aujourd\'hui' },
    { icon: Heart, label: 'Soins Effectués', value: '34', trend: 'Cette semaine' },
    { icon: CheckCircle2, label: 'Tâches Complétées', value: '28/30', trend: '93% complété' },
    { icon: AlertCircle, label: 'À Faire', value: '2', trend: 'Priorité haute' }
  ],
  tasks: [
    { id: 1, patient: 'Alain MBIKA', task: 'Mesure tension artérielle', priority: 'high', done: false },
    { id: 2, patient: 'Lucie NZEME', task: 'Injection de vaccin', priority: 'high', done: false },
    { id: 3, patient: 'Jean ONDOUA', task: 'Prélèvement sanguin', priority: 'medium', done: true },
  ],
  observations: [
    { id: 1, patient: 'Pierre ONGOUA', type: 'Vital Signs', time: '10:30', status: 'completed' },
    { id: 2, patient: 'Marie EBONE', type: 'Medication', time: '11:15', status: 'completed' },
    { id: 3, patient: 'Olivier BEKILI', type: 'Wound Care', time: '13:45', status: 'in_progress' },
  ]
};

export default function NurseDashboard() {
  return (
    <EstablishmentDashboardLayout
      userRole="nurse"
      userName="Marie BOUNDA"
      userEmail="infirmiere.cmst@sogara.ga"
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
                  <Icon className="w-8 h-8 text-pink-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Today */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Tâches d'Aujourd'hui
              </CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Tâche
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_DATA.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      task.done
                        ? 'bg-green-50 border-green-200'
                        : task.priority === 'high'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => {}}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold ${task.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.patient}
                      </p>
                      <p className="text-sm text-gray-600">{task.task}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.priority === 'high' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Priorité haute
                        </span>
                      )}
                      {task.done && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
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
              <Button className="w-full justify-start bg-pink-600 hover:bg-pink-700">
                <Pill className="w-4 h-4 mr-2" />
                Nouveau Soin
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Thermometer className="w-4 h-4 mr-2" />
                Mesures Vitales
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="w-4 h-4 mr-2" />
                Observation
              </Button>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Urgences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-900">Patient signalé</p>
                  <p className="text-xs text-red-800">Tension élevée - Dr. Alerte</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Observations */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Observations Récentes
          </CardTitle>
          <Button variant="ghost" size="sm">
            Voir tous <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEMO_DATA.observations.map((obs) => (
              <div
                key={obs.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{obs.patient}</p>
                  <p className="text-sm text-gray-600">{obs.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{obs.time}</p>
                  {obs.status === 'completed' ? (
                    <span className="text-xs text-green-600 flex items-center justify-end gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Complété
                    </span>
                  ) : (
                    <span className="text-xs text-blue-600 flex items-center justify-end gap-1 mt-1">
                      <Clock className="w-3 h-3" /> En cours
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </EstablishmentDashboardLayout>
  );
}
