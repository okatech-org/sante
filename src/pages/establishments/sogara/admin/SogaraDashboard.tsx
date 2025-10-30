import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  Building2,
  Users,
  Bed,
  Stethoscope,
  AlertTriangle,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  ChevronRight,
  MapPin,
  Phone,
  Briefcase,
  Heart,
  Brain,
  Baby,
  Bone,
  Eye,
  Syringe,
  Settings,
  Bell
} from 'lucide-react';

export default function SogaraDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    employees: 1250,
    activeEmployees: 1180,
    availableBeds: 27,
    totalBeds: 40,
    consultations: 42,
    plannedConsultations: 156,
    emergencies: 8,
    averageWait: 18
  });

  const [loading, setLoading] = useState(false);

  // Services disponibles
  const services = [
    { name: 'Urgences', active: true },
    { name: 'Consultations', active: true },
    { name: 'Maternité', active: true },
    { name: 'Chirurgie', active: true },
    { name: 'Radiologie', active: true },
    { name: 'Laboratoire', active: true },
    { name: 'Hospitalisation', active: true },
    { name: 'Médecine du travail', active: true },
  ];

  // Spécialités médicales
  const specialties = [
    { name: 'Médecine générale', icon: Stethoscope, color: 'blue' },
    { name: 'Gynécologie-Obstétrique', icon: Baby, color: 'pink' },
    { name: 'Chirurgie générale', icon: Heart, color: 'red' },
    { name: 'Radiologie', icon: Eye, color: 'purple' },
    { name: 'Médecine du travail', icon: Briefcase, color: 'orange' },
  ];

  // Alertes et rappels
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Examens médecine du travail',
      message: '45 employés doivent passer leur visite médicale ce mois',
      action: 'Voir la liste',
      time: 'Cette semaine'
    },
    {
      id: 2,
      type: 'info',
      title: 'Stock médicaments',
      message: 'Renouvellement nécessaire pour 12 médicaments',
      action: 'Gérer stock',
      time: 'Dans 5 jours'
    },
    {
      id: 3,
      type: 'success',
      title: 'Vaccination campagne',
      message: '320 employés vaccinés (85% de couverture)',
      action: 'Voir rapport',
      time: 'Mise à jour'
    }
  ];

  // Obtenir le badge du rôle basé sur l'email
  const getRoleBadge = () => {
    const roles = [];
    
    // Dr. DJEKI a plusieurs rôles
    if (user?.email === 'directeur.sogara@sante.ga') {
      roles.push({ label: 'Directeur Médical', variant: 'default' as const });
      roles.push({ label: 'Médecin Consultant', variant: 'secondary' as const });
    } else if (user?.email?.includes('dr.')) {
      roles.push({ label: 'Médecin', variant: 'default' as const });
    } else if (user?.email?.includes('nurse.')) {
      roles.push({ label: 'Infirmier(e)', variant: 'default' as const });
    } else if (user?.email?.includes('admin.')) {
      roles.push({ label: 'Administrateur', variant: 'default' as const });
    } else {
      roles.push({ label: 'Personnel SOGARA', variant: 'secondary' as const });
    }
    
    return roles;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header avec informations établissement */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center">
                <img 
                  src="/cmst_sogara_logo.png" 
                  alt="CMST SOGARA" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Centre Médical de Santé au Travail SOGARA
                </h1>
                <p className="text-muted-foreground mt-1">Hôpital d'entreprise</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Zone SOGARA, Port-Gentil</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>011 55 26 21</span>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    24h/24, 7j/7
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {getRoleBadge().map((role, idx) => (
                <Badge key={idx} variant={role.variant} className="gap-1">
                  {role.label}
                </Badge>
              ))}
              <Button variant="outline" size="sm" onClick={() => navigate('/establishments/sogara/admin/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications (3)
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employés SOGARA</p>
                <p className="text-3xl font-bold mt-1">{stats.employees}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                  {stats.activeEmployees} actifs
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lits disponibles</p>
                <p className="text-3xl font-bold mt-1">{stats.availableBeds}</p>
                <div className="mt-2">
                  <Progress 
                    value={(stats.availableBeds / stats.totalBeds) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Taux d'occupation: {Math.round((1 - stats.availableBeds / stats.totalBeds) * 100)}%
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Bed className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultations</p>
                <p className="text-3xl font-bold mt-1">{stats.consultations}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.plannedConsultations} RDV planifiés
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgences</p>
                <p className="text-3xl font-bold mt-1">{stats.emergencies}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Délai moyen: {stats.averageWait} min
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Services et Spécialités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services Disponibles */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Services Disponibles</h2>
              <Badge variant="outline" className="text-green-600">
                Tous opérationnels
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Services offerts par l'établissement
            </p>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <Badge
                  key={service.name}
                  variant={service.active ? 'default' : 'secondary'}
                  className="py-1.5 px-3"
                >
                  {service.name}
                </Badge>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleNavigate('/establishments/sogara/admin/services')}
              >
                Gérer les services
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Spécialités Médicales */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Spécialités Médicales</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Spécialités pratiquées
            </p>
            <div className="space-y-3">
              {specialties.map((specialty) => {
                const Icon = specialty.icon;
                return (
                  <div 
                    key={specialty.name}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-${specialty.color}-100 dark:bg-${specialty.color}-900/20 flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 text-${specialty.color}-600`} />
                    </div>
                    <span className="text-sm font-medium flex-1">{specialty.name}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Alertes et Actions Rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertes et Rappels */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Alertes et Rappels
              </h2>
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-xs"
                        >
                          {alert.action}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {alert.time}
                        </span>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      alert.type === 'warning' ? 'bg-orange-500' :
                      alert.type === 'info' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions Rapides */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions Rapides</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Accès rapide aux fonctionnalités principales
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="h-auto flex flex-col items-center py-4"
                onClick={() => handleNavigate('/establishments/sogara/admin/consultations')}
              >
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-xs">Planning</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto flex flex-col items-center py-4"
                onClick={() => handleNavigate('/establishments/sogara/admin/emergency')}
              >
                <AlertTriangle className="h-5 w-5 mb-2" />
                <span className="text-xs">Urgences</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto flex flex-col items-center py-4"
                onClick={() => handleNavigate('/establishments/sogara/admin/work-medicine')}
              >
                <Briefcase className="h-5 w-5 mb-2" />
                <span className="text-xs">Médecine travail</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto flex flex-col items-center py-4"
                onClick={() => handleNavigate('/establishments/sogara/admin/staff')}
              >
                <Users className="h-5 w-5 mb-2" />
                <span className="text-xs">Personnel</span>
              </Button>
            </div>
            
            {/* Actions médicales (car Dr. DJEKI est aussi médecin) */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-3">Actions médicales</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-auto flex flex-col items-center py-4"
                  onClick={() => handleNavigate('/professional/consultations/new')}
                >
                  <Stethoscope className="h-5 w-5 mb-2" />
                  <span className="text-xs">Consultation</span>
                </Button>
                <Button 
                  variant="secondary"
                  className="h-auto flex flex-col items-center py-4"
                  onClick={() => handleNavigate('/professional/prescriptions')}
                >
                  <Syringe className="h-5 w-5 mb-2" />
                  <span className="text-xs">Prescription</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Activité en temps réel</h2>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Tableau de bord complet
            </Button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Consultations du jour</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">18</span>
                <span className="text-sm text-green-600 mb-1">+12%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Patients hospitalisés</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">13</span>
                <span className="text-sm text-muted-foreground mb-1">stable</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Examens labo</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">34</span>
                <span className="text-sm text-orange-600 mb-1">-5%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Vaccinations</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">7</span>
                <span className="text-sm text-green-600 mb-1">+3</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
