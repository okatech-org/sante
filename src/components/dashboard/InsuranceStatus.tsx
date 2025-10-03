import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsuranceStatusProps {
  hasInsurance?: boolean;
  type?: 'CNAMGS' | 'CNSS';
  sector?: string;
  coverageRate?: number;
  remainingBalance?: number;
  lastContribution?: string;
  isUpToDate?: boolean;
}

export function InsuranceStatus({ 
  hasInsurance = false,
  type = 'CNAMGS',
  sector = 'Secteur Public',
  coverageRate = 80,
  remainingBalance = 2500000,
  lastContribution = '15/12/2024',
  isUpToDate = true
}: InsuranceStatusProps) {
  const { t } = useLanguage();
  
  if (!hasInsurance) {
    return (
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="font-semibold">{t('insurance.addInsurance')}</p>
                <p className="text-sm text-muted-foreground">{t('insurance.addDescription')}</p>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('insurance.addButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'CNAMGS') {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{t('insurance.cnamgsInsured')}</h3>
                    <Badge className="bg-success text-success-foreground">{t('insurance.active')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{sector}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {t('insurance.checkRights')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('insurance.coverageRate')}</p>
                <p className="text-2xl font-bold text-success">{coverageRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('insurance.remainingBalance')}</p>
                <p className="text-2xl font-bold">{remainingBalance.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isUpToDate ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${isUpToDate ? 'bg-success/10' : 'bg-warning/10'}`}>
              <Shield className={`h-6 w-6 ${isUpToDate ? 'text-success' : 'text-warning'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{t('insurance.cnssInsured')}</h3>
                <Badge variant={isUpToDate ? "default" : "secondary"}>
                  {isUpToDate ? t('insurance.contributionsUpToDate') : `⚠️ ${t('insurance.toVerify')}`}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t('insurance.lastContribution')} : {lastContribution}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="https://e.cnss.ga" target="_blank" rel="noopener noreferrer">
              {t('insurance.consultCnss')}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
