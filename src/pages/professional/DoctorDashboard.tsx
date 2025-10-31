import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, Calendar, Users, FileText,
  Clock, Activity, Heart, TrendingUp 
} from 'lucide-react';

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            Tableau de Bord Médecin
          </h1>
          <p className="text-muted-foreground mt-1">
            Activité médicale et consultations
          </p>
        </div>
        <Badge className="px-4 py-2 text-lg">
          Médecin Généraliste
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consultations aujourd'hui</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Calendar className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patients suivis</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Prescriptions</p>
              <p className="text-2xl font-bold">28</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Temps moyen</p>
              <p className="text-2xl font-bold">20min</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>
    </div>
  );
}