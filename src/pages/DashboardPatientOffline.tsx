import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Calendar, Video, Stethoscope, Shield, Activity, Pill, CheckCircle2, FileHeart, AlertCircle, MapPin, ChevronRight, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPatientOffline() {
  const { user } = useOfflineAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    full_name: 'Marie KOMBILA',
    birth_date: '1985-03-15',
    gender: 'F',
    weight_kg: 65,
    height_m: 1.65,
    blood_group: 'O+',
    cnamgs_number: 'CNAMGS-2024-001234'
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 'apt-1',
      doctor_name: 'Dr. Pierre KOMBILA',
      specialty: 'Cardiologie',
      date: '2024-01-15',
      time: '10:30',
      type: 'consultation',
      status: 'confirmed'
    },
    {
      id: 'apt-2',
      doctor_name: 'Dr. Claire OBAME',
      specialty: 'Gynécologie',
      date: '2024-01-20',
      time: '14:00',
      type: 'consultation',
      status: 'pending'
    }
  ]);

  const [recentPrescriptions, setRecentPrescriptions] = useState([
    {
      id: 'pres-1',
      doctor_name: 'Dr. Pierre KOMBILA',
      date: '2024-01-10',
      medications: ['Paracétamol 500mg', 'Vitamine D3'],
      status: 'active'
    }
  ]);

  const [healthStats, setHealthStats] = useState({
    lastCheckup: '2024-01-10',
    nextCheckup: '2024-04-10',
    vaccinations: 3,
    prescriptions: 1,
    appointments: 2
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'teleconsultation': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header avec mode hors-ligne */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bonjour, {profileData.full_name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Voici un aperçu de votre santé
              </p>
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              <WifiOff className="h-3 w-3 mr-1" />
              Mode Hors-ligne
            </Badge>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Prochains RDV</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentPrescriptions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Vaccinations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{healthStats.vaccinations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Dernier contrôle</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {new Date(healthStats.lastCheckup).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prochains rendez-vous */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Prochains Rendez-vous</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{appointment.doctor_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.specialty}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(appointment.type)}>
                    {appointment.type}
                  </Badge>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions récentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Prescriptions Récentes</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/prescriptions')}>
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentPrescriptions.map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{prescription.doctor_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {prescription.medications.join(', ')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prescription.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {prescription.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => navigate('/appointments')}
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Calendar className="h-6 w-6" />
            <span>Prendre RDV</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/medical-record')}
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <FileHeart className="h-6 w-6" />
            <span>Dossier Médical</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/professional/teleconsultations')}
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Video className="h-6 w-6" />
            <span>Téléconsultation</span>
          </Button>
        </div>

        {/* Notice mode hors-ligne */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-orange-600 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Mode Hors-ligne
              </h4>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                L'application fonctionne en mode démonstration avec des données simulées. 
                La connexion à Supabase sera rétablie automatiquement dès que possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}
