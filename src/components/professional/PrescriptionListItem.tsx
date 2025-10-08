import { QrCode, Download, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PrescriptionItem {
  id: string;
  date: string;
  patient: string;
  medications: Array<{
    name: string;
    dosage: string;
    duration: string;
  }>;
  status: string;
  cnamgs: string | null;
  pharmacy: string | null;
}

interface PrescriptionListItemProps {
  prescription: PrescriptionItem;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case "active": return "bg-green-500/10 text-green-500";
    case "delivered": return "bg-blue-500/10 text-blue-500";
    case "expired": return "bg-gray-500/10 text-gray-500";
    default: return "bg-muted";
  }
};

const getStatusLabel = (status: string) => {
  switch(status) {
    case "active": return "Active";
    case "delivered": return "Délivrée";
    case "expired": return "Expirée";
    default: return status;
  }
};

export const PrescriptionListItem = ({ prescription }: PrescriptionListItemProps) => {
  return (
    <div className="p-4 rounded-xl bg-card/80 border border-border shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <QrCode className="h-8 w-8 text-primary mb-2" />
            <span className="text-xs font-mono">{prescription.id}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(prescription.date).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h4 className="font-semibold">{prescription.patient}</h4>
              <Badge className={getStatusColor(prescription.status)}>
                {getStatusLabel(prescription.status)}
              </Badge>
              {prescription.cnamgs && (
                <Badge variant="outline">CNAMGS</Badge>
              )}
            </div>
            
            <div className="space-y-1 mb-2">
              {prescription.medications.map((med, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium">{med.name}</span>
                  <span className="text-muted-foreground ml-2">
                    {med.dosage} • {med.duration}
                  </span>
                </div>
              ))}
            </div>

            {prescription.pharmacy && (
              <p className="text-xs text-muted-foreground">
                Pharmacie: {prescription.pharmacy}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          {!prescription.pharmacy && (
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};