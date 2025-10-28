import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Pill, 
  Activity, 
  Calendar, 
  AlertTriangle, 
  Heart,
  Download,
  Eye,
  Shield,
  Building2,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEstablishment } from '@/contexts/EstablishmentContext';

interface MedicalRecord {
  id: string;
  patient_id: string;
  allergies: any[];
  antecedents: any[];
  current_medications: any[];
  documents: any[];
  created_at: string;
  updated_at: string;
}

interface Consultation {
  id: string;
  consultation_date: string;
  doctor_name: string;
  reason: string;
  diagnosis: string;
  establishment_name: string;
  establishment_id: string;
}

interface Prescription {
  id: string;
  issued_date: string;
  medications: any[];
  status: string;
  establishment_name: string;
  establishment_id: string;
}

interface MedicalRecordViewerProps {
  patientId: string;
  patientName: string;
  className?: string;
}

export function MedicalRecordViewer({ 
  patientId, 
  patientName, 
  className = "" 
}: MedicalRecordViewerProps) {
  const { currentEstablishment } = useEstablishment();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (patientId && currentEstablishment) {
      checkAccessAndLoadData();
    }
  }, [patientId, currentEstablishment]);

  const checkAccessAndLoadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier l'accès au DMP
      const { data: accessData, error: accessError } = await supabase
        .from('dmp_access_permissions')
        .select('*')
        .eq('patient_id', patientId)
        .eq('establishment_id', currentEstablishment.id)
        .eq('is_active', true)
        .single();

      if (accessError && accessError.code !== 'PGRST116') {
        throw accessError;
      }

      setHasAccess(!!accessData);

      if (accessData) {
        await loadMedicalData();
      }
    } catch (err) {
      console.error('Erreur lors de la vérification d\'accès:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalData = async () => {
    try {
      // Charger le DMP
      const { data: dmpData, error: dmpError } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      if (dmpError && dmpError.code !== 'PGRST116') {
        throw dmpError;
      }

      setMedicalRecord(dmpData);

      // Charger les consultations (toutes les établissements autorisés)
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select(`
          id,
          consultation_date,
          doctor_name,
          reason,
          diagnosis,
          establishments!inner(raison_sociale)
        `)
        .eq('user_id', patientId)
        .order('consultation_date', { ascending: false });

      if (consultationsError) {
        throw consultationsError;
      }

      setConsultations(consultationsData?.map(c => ({
        ...c,
        establishment_name: c.establishments?.raison_sociale || 'Établissement inconnu',
        establishment_id: c.establishments?.id || ''
      })) || []);

      // Charger les prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('electronic_prescriptions')
        .select(`
          id,
          issued_date,
          medications,
          status,
          establishments!inner(raison_sociale)
        `)
        .eq('patient_id', patientId)
        .order('issued_date', { ascending: false });

      if (prescriptionsError) {
        throw prescriptionsError;
      }

      setPrescriptions(prescriptionsData?.map(p => ({
        ...p,
        establishment_name: p.establishments?.raison_sociale || 'Établissement inconnu',
        establishment_id: p.establishments?.id || ''
      })) || []);

    } catch (err) {
      console.error('Erreur lors du chargement des données médicales:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    }
  };

  const requestAccess = async () => {
    try {
      const { error } = await supabase
        .from('dmp_access_permissions')
        .insert({
          patient_id: patientId,
          professional_id: currentEstablishment?.id, // À ajuster selon votre logique
          establishment_id: currentEstablishment?.id,
          access_level: 'read_only',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
        });

      if (error) {
        throw error;
      }

      // Recharger les données
      await checkAccessAndLoadData();
    } catch (err) {
      console.error('Erreur lors de la demande d\'accès:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la demande d\'accès');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={checkAccessAndLoadData} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasAccess) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accès au DMP requis
          </h3>
          <p className="text-gray-500 mb-4">
            Vous devez demander l'autorisation pour accéder au dossier médical de {patientName}.
          </p>
          <Button onClick={requestAccess}>
            Demander l'accès
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dossier Médical de {patientName}
          </h2>
          <p className="text-gray-500">
            Dossier agrégé de tous les établissements autorisés
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {currentEstablishment?.raison_sociale}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Allergies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Allergies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {medicalRecord?.allergies && medicalRecord.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {medicalRecord.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy.name || allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune allergie déclarée</p>
                )}
              </CardContent>
            </Card>

            {/* Antécédents */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Heart className="h-5 w-5 text-blue-600" />
                  <span>Antécédents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {medicalRecord?.antecedents && medicalRecord.antecedents.length > 0 ? (
                  <div className="space-y-2">
                    {medicalRecord.antecedents.map((antecedent, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{antecedent.condition || antecedent}</span>
                        {antecedent.date && (
                          <span className="text-gray-500 ml-2">
                            ({formatDate(antecedent.date)})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun antécédent déclaré</p>
                )}
              </CardContent>
            </Card>

            {/* Médicaments actuels */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Pill className="h-5 w-5 text-green-600" />
                  <span>Traitements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {medicalRecord?.current_medications && medicalRecord.current_medications.length > 0 ? (
                  <div className="space-y-2">
                    {medicalRecord.current_medications.map((medication, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{medication.name || medication}</span>
                        {medication.dosage && (
                          <span className="text-gray-500 ml-2">
                            - {medication.dosage}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun traitement en cours</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consultations */}
        <TabsContent value="consultations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Historique des consultations</span>
              </CardTitle>
              <CardDescription>
                Consultations de tous les établissements autorisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <div key={consultation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{consultation.doctor_name}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(consultation.consultation_date)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {consultation.establishment_name}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Motif :</span>
                          <span className="text-sm ml-2">{consultation.reason}</span>
                        </div>
                        {consultation.diagnosis && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Diagnostic :</span>
                            <span className="text-sm ml-2">{consultation.diagnosis}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Aucune consultation trouvée
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions */}
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Prescriptions électroniques</span>
              </CardTitle>
              <CardDescription>
                Ordonnances de tous les établissements autorisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">
                            Prescription #{prescription.id.slice(-8)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(prescription.issued_date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(prescription.status)}`}
                          >
                            {prescription.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {prescription.establishment_name}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {prescription.medications.map((medication, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{medication.name}</span>
                            <span className="text-gray-500 ml-2">
                              - {medication.dosage} - {medication.instructions}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Aucune prescription trouvée
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Documents médicaux</span>
              </CardTitle>
              <CardDescription>
                Résultats d'analyses, imagerie, comptes-rendus
              </CardDescription>
            </CardHeader>
            <CardContent>
              {medicalRecord?.documents && medicalRecord.documents.length > 0 ? (
                <div className="space-y-3">
                  {medicalRecord.documents.map((document, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{document.name || `Document ${index + 1}`}</p>
                          <p className="text-sm text-gray-500">
                            {document.type || 'Document médical'} - {formatDate(document.date || new Date().toISOString())}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Aucun document médical trouvé
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MedicalRecordViewer;
