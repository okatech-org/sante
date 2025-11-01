import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinistryFinances } from "@/types/ministry";
import { DollarSign, TrendingDown, AlertCircle, PiggyBank } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MinistryFinancesCardProps {
  finances: MinistryFinances;
}

export const MinistryFinancesCard = ({ finances }: MinistryFinancesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Finances & Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Budget Annuel</span>
            <span className="text-lg font-bold text-blue-600">{finances.budget_annuel}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Exécution Budgétaire</span>
              <span className="font-semibold">{finances.execution_budgetaire}%</span>
            </div>
            <Progress value={finances.execution_budgetaire} className="h-2" />
            <p className="text-xs text-muted-foreground">
              T3 2025 - Conforme aux objectifs
            </p>
          </div>
        </div>

        <div className="pt-3 border-t space-y-3">
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-900">Arriérés CNAMGS</p>
              <p className="text-xs text-orange-700 mt-1">{finances.arrieres_cnamgs}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <PiggyBank className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">Économies EVASAN</p>
              <p className="text-xs text-green-700 mt-1">{finances.economies_evasan}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  Grâce à la télémédecine
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Investissements</p>
              <p className="text-sm font-bold">45 Mds</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Fonctionnement</p>
              <p className="text-sm font-bold">105 Mds</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

