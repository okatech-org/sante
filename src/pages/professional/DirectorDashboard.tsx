import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Building2, Users, Activity, 
  DollarSign, FileText, TrendingUp, Award 
} from 'lucide-react';

export default function DirectorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Tableau de Bord Direction
          </h1>
        <p className="text-muted-foreground mt-1">
            Vue d'ensemble de l'établissement
        </p>
      </div>
        <Badge className="px-4 py-2 text-lg">
          Directeur Général
              </Badge>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Personnel</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patients/Mois</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
              <p className="text-2xl font-bold">250M</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux occupation</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>
    </div>
  );
}