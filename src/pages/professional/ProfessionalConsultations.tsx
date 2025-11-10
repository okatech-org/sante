import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Stethoscope, Search, Calendar, Clock, User, FileText,
  Plus, Filter, ChevronRight, Loader2, AlertCircle
} from 'lucide-react';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { useConsultations } from '@/hooks/useConsultations';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfessionalConsultations() {
  const { currentRole } = useMultiEstablishment();
  const [searchTerm, setSearchTerm] = useState('');
  const { consultations, stats, loading, error } = useConsultations();

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { label: 'Terminée', variant: 'secondary' as const },
      in_progress: { label: 'En cours', variant: 'default' as const },
      scheduled: { label: 'Planifiée', variant: 'outline' as const }
    };
    return badges[status as keyof typeof badges] || badges.scheduled;
  };

  const filteredConsultations = consultations.filter(c =>
    c.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            Consultations
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos consultations et suivis patients
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle consultation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aujourd'hui</p>
              <p className="text-2xl font-bold">{stats.today}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ce mois</p>
              <p className="text-2xl font-bold">{stats.month}</p>
            </div>
            <Stethoscope className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Prescriptions</p>
              <p className="text-2xl font-bold">{stats.prescriptions}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patients uniques</p>
              <p className="text-2xl font-bold">{stats.uniquePatients}</p>
            </div>
            <User className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par patient ou motif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
      </Card>

      {/* Liste des consultations */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => {
          const date = new Date(consultation.date);
          
          return (
            <Card key={consultation.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{consultation.patient}</h3>
                      {consultation.prescription && (
                        <Badge variant="secondary">
                          <FileText className="h-3 w-3 mr-1" />
                          Ordonnance
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {date.toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Stethoscope className="h-4 w-4" />
                        {consultation.type}
                      </div>
                      {consultation.diagnosis && (
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">Diagnostic:</span> {consultation.diagnosis}
                        </div>
                      )}
                      {consultation.notes && (
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <FileText className="h-4 w-4" />
                          {consultation.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredConsultations.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune consultation trouvée</h3>
            <p className="text-muted-foreground">
              Aucune consultation ne correspond à votre recherche
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
