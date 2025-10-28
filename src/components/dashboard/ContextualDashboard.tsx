import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  Activity, 
  Settings, 
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useEstablishment } from '@/contexts/EstablishmentContext';
import { EstablishmentSwitcher } from '@/components/establishment/EstablishmentSwitcher';

interface ContextualDashboardProps {
  className?: string;
}

export function ContextualDashboard({ className = "" }: ContextualDashboardProps) {
  const { 
    currentEstablishment, 
    establishments, 
    loading, 
    switchEstablishment, 
    hasPermission, 
    isAdmin 
  } = useEstablishment();

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentEstablishment) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun établissement sélectionné
        </h3>
        <p className="text-gray-500 mb-4">
          Veuillez sélectionner un établissement pour accéder à votre dashboard.
        </p>
        <EstablishmentSwitcher 
          currentEstablishmentId=""
          onEstablishmentChange={switchEstablishment}
        />
      </div>
    );
  }

  const getEstablishmentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'chu': 'CHU',
      'chr': 'CHR',
      'polyclinique': 'Polyclinique',
      'clinique': 'Clinique',
      'centre_medical': 'Centre Médical',
      'hopital_departemental': 'Hôpital Départemental',
      'hopital_confessionnel': 'Hôpital Confessionnel'
    };
    return types[type] || type;
  };

  const getSecteurLabel = (secteur: string) => {
    const secteurs: Record<string, string> = {
      'public': 'Public',
      'prive': 'Privé',
      'confessionnel': 'Confessionnel',
      'militaire': 'Militaire',
      'parapublic': 'Parapublic'
    };
    return secteurs[secteur] || secteur;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec sélecteur d'établissement */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentEstablishment.raison_sociale}
            </h1>
            <Badge variant="outline" className="text-xs">
              {getEstablishmentTypeLabel(currentEstablishment.type_etablissement)}
            </Badge>
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                currentEstablishment.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {currentEstablishment.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{currentEstablishment.ville}, {currentEstablishment.province}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>{getSecteurLabel(currentEstablishment.secteur)}</span>
            </div>
            {currentEstablishment.cnamgs_conventionne && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                CNAMGS
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <EstablishmentSwitcher 
            currentEstablishmentId={currentEstablishment.id}
            onEstablishmentChange={switchEstablishment}
            className="w-64"
          />
        </div>
      </div>

      {/* Informations de contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Informations de l'établissement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentEstablishment.telephone_standard && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{currentEstablishment.telephone_standard}</span>
              </div>
            )}
            {currentEstablishment.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{currentEstablishment.email}</span>
              </div>
            )}
            {currentEstablishment.adresse_rue && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{currentEstablishment.adresse_rue}</span>
              </div>
            )}
            {currentEstablishment.nombre_lits_total && (
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{currentEstablishment.nombre_lits_total} lits</span>
              </div>
            )}
            {currentEstablishment.service_urgences_actif && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Urgences 24/7</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides selon les permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Consultations */}
        {hasPermission('consultations') && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Consultations</span>
              </CardTitle>
              <CardDescription>
                Gérer les consultations de l'établissement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Aujourd'hui</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cette semaine</span>
                  <span className="font-medium">48</span>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Voir les consultations
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rendez-vous */}
        {hasPermission('appointments') && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Rendez-vous</span>
              </CardTitle>
              <CardDescription>
                Planning et gestion des RDV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Prochains RDV</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">En attente</span>
                  <span className="font-medium">3</span>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Gérer les RDV
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prescriptions */}
        {hasPermission('prescriptions') && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Pill className="h-5 w-5 text-purple-600" />
                <span>Prescriptions</span>
              </CardTitle>
              <CardDescription>
                Ordonnances électroniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">En cours</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envoyées</span>
                  <span className="font-medium">23</span>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Voir les prescriptions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patients */}
        {hasPermission('patients') && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5 text-orange-600" />
                <span>Patients</span>
              </CardTitle>
              <CardDescription>
                Dossier patients de l'établissement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actifs</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nouveaux</span>
                  <span className="font-medium">12</span>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Voir les patients
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics */}
        {hasPermission('analytics') && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span>Analytics</span>
              </CardTitle>
              <CardDescription>
                Statistiques et métriques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taux occupation</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Satisfaction</span>
                  <span className="font-medium">4.2/5</span>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Voir les analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Administration */}
        {isAdmin && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Settings className="h-5 w-5 text-red-600" />
                <span>Administration</span>
              </CardTitle>
              <CardDescription>
                Gestion de l'établissement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Staff</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Services</span>
                  <span className="font-medium">8</span>
                </div>
                <Button className="w-full mt-3" size="sm" variant="destructive">
                  Gérer l'établissement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rôle et permissions actuels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Votre rôle dans cet établissement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentEstablishment.role_in_establishment}</p>
              <p className="text-sm text-gray-500">
                {isAdmin ? 'Administrateur' : 'Membre de l\'équipe'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Permissions :</p>
              <div className="flex flex-wrap gap-1">
                {currentEstablishment.permissions?.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContextualDashboard;
