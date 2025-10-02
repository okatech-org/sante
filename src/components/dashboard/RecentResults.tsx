import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestTube, Download } from "lucide-react";

interface Result {
  id: string;
  type: 'biology' | 'imaging';
  date: string;
  lab: string;
  prescriber: string;
  status: 'available';
  isNew: boolean;
}

const mockResults: Result[] = [
  {
    id: '1',
    type: 'biology',
    date: '18/01/2025',
    lab: 'BIOLAB Libreville',
    prescriber: 'Dr KOMBILA Pierre',
    status: 'available',
    isNew: true
  },
  {
    id: '2',
    type: 'imaging',
    date: '15/01/2025',
    lab: 'Centre Radiologie Montagne Sainte',
    prescriber: 'Dr NGOMA Marie',
    status: 'available',
    isNew: false
  }
];

export function RecentResults() {
  const results = mockResults;
  const newCount = results.filter(r => r.isNew).length;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'biology':
        return 'Biologie';
      case 'imaging':
        return 'Imagerie';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Mes Résultats d'Examens
            {newCount > 0 && (
              <Badge variant="destructive">{newCount} Nouveau{newCount > 1 ? 'x' : ''}</Badge>
            )}
          </CardTitle>
          <Button variant="link" size="sm" asChild>
            <a href="/results">Tous mes résultats</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {result.isNew && (
                    <Badge className="bg-primary text-primary-foreground">🆕 NOUVEAU</Badge>
                  )}
                  <Badge variant="outline">{getTypeLabel(result.type)}</Badge>
                  <Badge className="bg-success text-success-foreground">Disponible</Badge>
                </div>
                <p className="font-medium mb-1">Date : {result.date}</p>
                <p className="text-sm text-muted-foreground mb-1">Labo/Centre : {result.lab}</p>
                <p className="text-sm text-muted-foreground">Prescripteur : {result.prescriber}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 w-full">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
