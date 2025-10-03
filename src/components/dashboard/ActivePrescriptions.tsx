import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  medicationsCount: number;
  status: 'new' | 'dispensed' | 'expired';
  isNew: boolean;
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    date: '16/01/2025',
    doctor: 'Dr KOMBILA Pierre',
    medicationsCount: 3,
    status: 'new',
    isNew: true
  },
  {
    id: '2',
    date: '10/01/2025',
    doctor: 'Dr NGOMA Marie',
    medicationsCount: 2,
    status: 'dispensed',
    isNew: false
  }
];

export function ActivePrescriptions() {
  const { t } = useLanguage();
  const prescriptions = mockPrescriptions;
  const newCount = prescriptions.filter(p => p.isNew).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-warning text-warning-foreground">{t('prescriptions.notDispensed')}</Badge>;
      case 'dispensed':
        return <Badge className="bg-success text-success-foreground">{t('prescriptions.dispensed')}</Badge>;
      case 'expired':
        return <Badge variant="secondary">{t('prescriptions.expired')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {t('prescriptions.title')}
            {newCount > 0 && (
              <Badge variant="destructive">{newCount} {newCount > 1 ? t('prescriptions.news') : t('prescriptions.new')}</Badge>
            )}
          </CardTitle>
          <Button variant="link" size="sm" asChild>
            <a href="/prescriptions">{t('prescriptions.viewAll')}</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {prescription.isNew && (
                    <Badge className="bg-primary text-primary-foreground">🆕 {t('prescriptions.new').toUpperCase()}</Badge>
                  )}
                  {getStatusBadge(prescription.status)}
                </div>
                <p className="font-medium mb-1">{t('prescriptions.date')} : {prescription.date}</p>
                <p className="text-sm text-muted-foreground mb-1">{t('prescriptions.prescriber')} : {prescription.doctor}</p>
                <p className="text-sm text-muted-foreground">{prescription.medicationsCount} {prescription.medicationsCount > 1 ? t('prescriptions.medications') : t('prescriptions.medication')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 flex-1">
                <FileText className="h-4 w-4" />
                {t('prescriptions.viewPrescription')}
              </Button>
              {prescription.status === 'new' && (
                <Button variant="default" size="sm" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('prescriptions.findPharmacy')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
