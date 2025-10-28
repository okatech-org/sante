import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  FileText, 
  Calculator, 
  Activity,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { EstablishmentSwitcher } from '@/components/establishment/EstablishmentSwitcher';
import { ContextualDashboard } from '@/components/dashboard/ContextualDashboard';
import { MedicalRecordViewer } from '@/components/dmp/MedicalRecordViewer';
import { BillingCalculator } from '@/components/billing/BillingCalculator';
import { useEstablishment } from '@/contexts/EstablishmentContext';

export default function MultiEstablishmentDemo() {
  const { currentEstablishment, establishments } = useEstablishment();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPatientName, setSelectedPatientName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Patients de démonstration
  const demoPatients = [
    { id: 'patient-1', name: 'Mme ONDO Marie', cnamgs: 'CNAMGS-123456' },
    { id: 'patient-2', name: 'M. EYANG Paul', cnamgs: 'CNAMGS-789012' },
    { id: 'patient-3', name: 'Mme BOUNDA Alice', cnamgs: 'CNAMGS-345678' },
  ];

  const handlePatientSelect = (patientId: string, patientName: string) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setActiveTab('dmp');
  };

  const handleInvoiceCreated = (invoiceId: string) => {
    console.log('Facture créée:', invoiceId);
    // Ici vous pourriez rediriger vers la page de facture ou afficher une notification
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  SANTE.GA - Architecture Multi-Établissements
                </h1>
                <p className="text-sm text-gray-500">
                  Démonstration des fonctionnalités clés
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                Version Démo
              </Badge>
              <EstablishmentSwitcher 
                currentEstablishmentId={currentEstablishment?.id || ''}
                onEstablishmentChange={() => {}}
                className="w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span>Architecture Multi-Établissements Implémentée</span>
            </CardTitle>
            <CardDescription>
              Cette démonstration présente les fonctionnalités clés de l'architecture SANTE.GA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Multi-Établissements</h3>
                <p className="text-sm text-gray-500">
                  Un professionnel peut travailler dans plusieurs établissements avec des rôles différents
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">DMP Centralisé</h3>
                <p className="text-sm text-gray-500">
                  Dossier médical patient agrégé avec consentement granulaire
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Facturation CNAMGS</h3>
                <p className="text-sm text-gray-500">
                  Calcul automatique des charges et tiers-payant
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="dmp">DMP Patient</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          {/* Dashboard Contextuel */}
          <TabsContent value="dashboard">
            <ContextualDashboard />
          </TabsContent>

          {/* DMP Patient */}
          <TabsContent value="dmp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Sélection d'un patient</span>
                </CardTitle>
                <CardDescription>
                  Choisissez un patient pour accéder à son dossier médical
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {demoPatients.map((patient) => (
                    <Card 
                      key={patient.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handlePatientSelect(patient.id, patient.name)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{patient.name}</h4>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">{patient.cnamgs}</p>
                        <Badge variant="outline" className="text-xs mt-2">
                          Patient
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedPatientId && (
              <MedicalRecordViewer 
                patientId={selectedPatientId}
                patientName={selectedPatientName}
              />
            )}
          </TabsContent>

          {/* Facturation */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Calcul de facturation CNAMGS</span>
                </CardTitle>
                <CardDescription>
                  Démonstration du calcul automatique des charges CNAMGS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {demoPatients.map((patient) => (
                    <Button
                      key={patient.id}
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => setSelectedPatientId(patient.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.cnamgs}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedPatientId && (
              <BillingCalculator 
                patientId={selectedPatientId}
                onInvoiceCreated={handleInvoiceCreated}
              />
            )}
          </TabsContent>

          {/* Architecture */}
          <TabsContent value="architecture" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Établissements de l'utilisateur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Mes Établissements</span>
                  </CardTitle>
                  <CardDescription>
                    Établissements où vous travaillez actuellement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {establishments.length > 0 ? (
                    <div className="space-y-3">
                      {establishments.map((establishment) => (
                        <div 
                          key={establishment.id}
                          className={`p-3 border rounded-lg ${
                            currentEstablishment?.id === establishment.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{establishment.raison_sociale}</h4>
                            {currentEstablishment?.id === establishment.id && (
                              <Badge variant="default" className="text-xs">
                                Actuel
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {establishment.ville}, {establishment.province}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {establishment.role_in_establishment}
                            </Badge>
                            {establishment.is_admin && (
                              <Badge variant="destructive" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Aucun établissement assigné
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Fonctionnalités implémentées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Fonctionnalités Implémentées</span>
                  </CardTitle>
                  <CardDescription>
                    Composants et fonctionnalités développés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Sélecteur d'établissement</p>
                        <p className="text-sm text-gray-500">Switch contextuel entre établissements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Dashboard contextuel</p>
                        <p className="text-sm text-gray-500">Interface adaptée selon l'établissement</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">DMP centralisé</p>
                        <p className="text-sm text-gray-500">Dossier médical agrégé avec consentement</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Calcul facturation CNAMGS</p>
                        <p className="text-sm text-gray-500">Calcul automatique charges et reste à charge</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Gestion des permissions</p>
                        <p className="text-sm text-gray-500">Rôles et permissions par établissement</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schéma d'architecture */}
            <Card>
              <CardHeader>
                <CardTitle>Architecture Multi-Établissements</CardTitle>
                <CardDescription>
                  Schéma conceptuel de l'architecture implémentée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center text-sm text-gray-600">
                    <div className="mb-4">
                      <strong>1 PROFIL UNIQUE</strong> (email: user@sante.ga)
                    </div>
                    <div className="mb-4">
                      <strong>↓</strong>
                    </div>
                    <div className="mb-4">
                      <strong>N ÉTABLISSEMENTS</strong> (CHU, Clinique, Cabinet)
                    </div>
                    <div className="mb-4">
                      <strong>↓</strong>
                    </div>
                    <div className="mb-4">
                      <strong>N RÔLES</strong> (1 rôle par établissement)
                    </div>
                    <div className="mb-4">
                      <strong>↓</strong>
                    </div>
                    <div className="mb-4">
                      <strong>DONNÉES CLOISONNÉES</strong> (isolation par établissement)
                    </div>
                    <div className="mb-4">
                      <strong>↓</strong>
                    </div>
                    <div>
                      <strong>DMP AGRÉGÉ</strong> (vue patient avec consentement)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
