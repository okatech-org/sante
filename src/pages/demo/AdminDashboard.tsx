import React from 'react';
import EstablishmentDashboardLayout from '@/components/layout/EstablishmentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
  ChevronRight,
  AlertCircle,
  Activity,
  DollarSign,
  Calendar
} from "lucide-react";

const DEMO_DATA = {
  stats: [
    { icon: Users, label: 'Utilisateurs Actifs', value: '156', trend: '+12 ce mois' },
    { icon: Activity, label: 'Consultations', value: '892', trend: '+34%' },
    { icon: DollarSign, label: 'Revenus', value: '45.2K', trend: '+8.5K ce mois' },
    { icon: TrendingUp, label: 'Croissance', value: '+18%', trend: 'vs dernier mois' }
  ],
  staff: [
    { id: 1, name: 'Dr. Jean-Paul NZENZE', role: 'Médecin du Travail', status: 'active', patients: 45 },
    { id: 2, name: 'Marie BOUNDA', role: 'Infirmière', status: 'active', patients: 32 },
  ],
  recentActions: [
    { id: 1, user: 'Dr. Jean-Paul', action: 'Créé nouvelle prescription', time: '10:30' },
    { id: 2, user: 'Marie BOUNDA', action: 'Entrée nouveau patient', time: '10:15' },
    { id: 3, user: 'Système', action: 'Backup automatique effectué', time: '09:00' },
  ]
};

export default function AdminDashboard() {
  return (
    <EstablishmentDashboardLayout
      userRole="admin"
      userName="Paul OKANDZE"
      userEmail="admin.cmst@sogara.ga"
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
                  <Icon className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Management Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Staff Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestion du Personnel
              </CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_DATA.staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{member.patients} patients</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {member.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_DATA.recentActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{action.user}</p>
                      <p className="text-sm text-gray-600">{action.action}</p>
                    </div>
                    <p className="text-xs text-gray-500">{action.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outils d'Administration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                <Users className="w-4 h-4 mr-2" />
                Gérer Utilisateurs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Voir Rapports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Planification
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">État du Système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Base de données</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    OK
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Serveur</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    OK
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Backup</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    Dernier: 09:00
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900">Info</p>
                  <p className="text-xs text-blue-800">Mise à jour disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EstablishmentDashboardLayout>
  );
}
