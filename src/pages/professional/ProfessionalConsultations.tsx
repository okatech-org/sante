import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Stethoscope, Search, Calendar, Clock, User, FileText,
  Plus, Filter, ChevronRight, Loader2, AlertCircle, Download
} from 'lucide-react';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { useConsultations, Consultation } from '@/hooks/useConsultations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConsultationDetailsModal } from '@/components/professional/ConsultationDetailsModal';
import { ConsultationFilters, FilterValues } from '@/components/professional/ConsultationFilters';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function ProfessionalConsultations() {
  const { currentRole } = useMultiEstablishment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({ type: '' });
  const [professionalId, setProfessionalId] = useState<string>('');
  const { consultations, stats, loading, error } = useConsultations();

  // Récupérer l'ID du professionnel
  useEffect(() => {
    const fetchProfessionalId = async () => {
      const { data } = await supabase
        .from('professionals')
        .select('id')
        .single();
      if (data) setProfessionalId(data.id);
    };
    fetchProfessionalId();
  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { label: 'Terminée', variant: 'secondary' as const },
      in_progress: { label: 'En cours', variant: 'default' as const },
      scheduled: { label: 'Planifiée', variant: 'outline' as const }
    };
    return badges[status as keyof typeof badges] || badges.scheduled;
  };

  const filteredConsultations = consultations.filter(c => {
    // Search filter
    const matchesSearch = !searchTerm || 
      c.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = !filters.type || c.type === filters.type;
    
    // Date filters
    const consultationDate = new Date(c.date);
    const matchesDateFrom = !filters.dateFrom || consultationDate >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || consultationDate <= filters.dateTo;
    
    // Prescription filter
    const matchesPrescription = filters.hasPrescription === undefined || 
      c.prescription === filters.hasPrescription;

    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo && matchesPrescription;
  });

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Heure', 'Patient', 'Type', 'Diagnostic', 'Ordonnance', 'Notes'],
      ...filteredConsultations.map(c => [
        c.date,
        c.time,
        c.patient,
        c.type,
        c.diagnosis || '',
        c.prescription ? 'Oui' : 'Non',
        c.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Export CSV réussi');
  };

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle consultation
          </Button>
        </div>
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
          <Button 
            variant={showFilters ? "default" : "outline"} 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
      </Card>

      {/* Filtres avancés */}
      {showFilters && (
        <ConsultationFilters
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setShowFilters(false);
          }}
          onReset={() => {
            setFilters({ type: '' });
            setShowFilters(false);
          }}
        />
      )}

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
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedConsultation(consultation)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredConsultations.length === 0 && !loading && (
        <Card className="p-12">
          <div className="text-center">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune consultation trouvée</h3>
            <p className="text-muted-foreground">
              {searchTerm || Object.values(filters).some(v => v) 
                ? "Aucune consultation ne correspond à votre recherche" 
                : "Aucune consultation enregistrée"}
            </p>
          </div>
        </Card>
      )}

      {/* Modal de détails */}
      <ConsultationDetailsModal
        consultation={selectedConsultation}
        open={!!selectedConsultation}
        onOpenChange={(open) => !open && setSelectedConsultation(null)}
        professionalId={professionalId}
      />
    </div>
  );
}
