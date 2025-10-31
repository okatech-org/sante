import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, TestTube, Scan, Heart, Microscope,
  Calendar, FileText, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

export default function ProfessionalTechnicalPlatforms() {
  const [activeTab, setActiveTab] = useState('laboratory');

  // Données fictives
  const examRequests = {
    laboratory: [
      {
        id: 1,
        patient: 'Marie MOUSSAVOU',
        exam: 'Bilan sanguin complet',
        requestDate: '2025-01-31',
        status: 'pending',
        priority: 'normal'
      },
      {
        id: 2,
        patient: 'Jean NZENGUE',
        exam: 'Test de glycémie',
        requestDate: '2025-01-31',
        status: 'completed',
        priority: 'urgent',
        results: 'Disponibles'
      },
      {
        id: 3,
        patient: 'Pierre OBAME',
        exam: 'Bilan lipidique',
        requestDate: '2025-01-30',
        status: 'in_progress',
        priority: 'normal'
      }
    ],
    imaging: [
      {
        id: 4,
        patient: 'Sophie KOMBILA',
        exam: 'Radiographie thoracique',
        requestDate: '2025-01-31',
        status: 'scheduled',
        priority: 'normal',
        scheduledFor: '14:00'
      },
      {
        id: 5,
        patient: 'André NGUEMA',
        exam: 'Scanner cérébral',
        requestDate: '2025-01-31',
        status: 'pending',
        priority: 'urgent'
      }
    ],
    cardiology: [
      {
        id: 6,
        patient: 'Marie MOUSSAVOU',
        exam: 'Électrocardiogramme (ECG)',
        requestDate: '2025-01-31',
        status: 'completed',
        priority: 'normal',
        results: 'Normal'
      },
      {
        id: 7,
        patient: 'Jean NZENGUE',
        exam: 'Échocardiographie',
        requestDate: '2025-01-30',
        status: 'scheduled',
        priority: 'urgent',
        scheduledFor: '10:30'
      }
    ]
  };

  const platformStats = {
    laboratory: { total: 15, pending: 8, completed: 5, in_progress: 2 },
    imaging: { total: 12, pending: 6, completed: 4, scheduled: 2 },
    cardiology: { total: 8, pending: 3, completed: 3, scheduled: 2 }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'En attente', variant: 'outline' as const, icon: Clock },
      in_progress: { label: 'En cours', variant: 'default' as const, icon: Activity },
      scheduled: { label: 'Programmé', variant: 'secondary' as const, icon: Calendar },
      completed: { label: 'Terminé', variant: 'secondary' as const, icon: CheckCircle }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'text-red-600' : 'text-gray-600';
  };

  const renderExamList = (exams: any[]) => (
    <div className="space-y-4">
      {exams.map((exam) => {
        const statusBadge = getStatusBadge(exam.status);
        const StatusIcon = statusBadge.icon;
        
        return (
          <Card key={exam.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{exam.patient}</h3>
                    {exam.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm font-medium mb-2">{exam.exam}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(exam.requestDate).toLocaleDateString('fr-FR')}
                  </div>
                  
                  {exam.scheduledFor && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {exam.scheduledFor}
                    </div>
                  )}
                  
                  {exam.results && (
                    <div className="flex items-center gap-1 text-green-600">
                      <FileText className="h-4 w-4" />
                      {exam.results}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant={statusBadge.variant} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {statusBadge.label}
                </Badge>
                <Button size="sm">Voir</Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Plateaux Techniques
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des examens et analyses
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Nouvelle demande
        </Button>
      </div>

      {/* Tabs pour les différents plateaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="laboratory" className="gap-2">
            <TestTube className="h-4 w-4" />
            Laboratoire
          </TabsTrigger>
          <TabsTrigger value="imaging" className="gap-2">
            <Scan className="h-4 w-4" />
            Imagerie
          </TabsTrigger>
          <TabsTrigger value="cardiology" className="gap-2">
            <Heart className="h-4 w-4" />
            Cardiologie
          </TabsTrigger>
        </TabsList>

        <TabsContent value="laboratory" className="space-y-6">
          {/* Stats Laboratoire */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{platformStats.laboratory.total}</p>
                </div>
                <TestTube className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{platformStats.laboratory.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold">{platformStats.laboratory.in_progress}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminés</p>
                  <p className="text-2xl font-bold">{platformStats.laboratory.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>
          </div>

          {renderExamList(examRequests.laboratory)}
        </TabsContent>

        <TabsContent value="imaging" className="space-y-6">
          {/* Stats Imagerie */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{platformStats.imaging.total}</p>
                </div>
                <Scan className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{platformStats.imaging.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Programmés</p>
                  <p className="text-2xl font-bold">{platformStats.imaging.scheduled}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminés</p>
                  <p className="text-2xl font-bold">{platformStats.imaging.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>
          </div>

          {renderExamList(examRequests.imaging)}
        </TabsContent>

        <TabsContent value="cardiology" className="space-y-6">
          {/* Stats Cardiologie */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{platformStats.cardiology.total}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{platformStats.cardiology.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Programmés</p>
                  <p className="text-2xl font-bold">{platformStats.cardiology.scheduled}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminés</p>
                  <p className="text-2xl font-bold">{platformStats.cardiology.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>
          </div>

          {renderExamList(examRequests.cardiology)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
