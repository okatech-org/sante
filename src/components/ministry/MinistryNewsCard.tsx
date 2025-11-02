import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MinistryNews } from "@/types/ministry";
import { Bell, Calendar, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MinistryNewsCardProps {
  news: MinistryNews[];
}

export const MinistryNewsCard = ({ news }: MinistryNewsCardProps) => {
  const getCategoryColor = (categorie: MinistryNews['categorie']) => {
    switch(categorie) {
      case 'alerte_sanitaire': return 'destructive';
      case 'annonce': return 'default';
      case 'campagne': return 'secondary';
      case 'inauguration': return 'default';
      case 'nomination': return 'outline';
      case 'communique': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryLabel = (categorie: MinistryNews['categorie']) => {
    switch(categorie) {
      case 'alerte_sanitaire': return 'Alerte Sanitaire';
      case 'annonce': return 'Annonce';
      case 'campagne': return 'Campagne';
      case 'inauguration': return 'Inauguration';
      case 'nomination': return 'Nomination';
      case 'communique': return 'Communiqué';
      default: return categorie;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Actualités & Communications
          </CardTitle>
          <Badge variant="outline">{news.length} Nouvelles</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune actualité récente
          </p>
        ) : (
          <div className="space-y-3">
            {news.filter(item => item && item.id).slice(0, 5).map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer ${
                  item.urgence ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.urgence && (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={getCategoryColor(item.categorie)} className="text-xs">
                        {getCategoryLabel(item.categorie)}
                      </Badge>
                      {item.urgence && (
                        <Badge variant="destructive" className="text-xs">
                          URGENT
                        </Badge>
                      )}
                      {item.province_concernee && (
                        <span className="text-xs text-muted-foreground">
                          • {item.province_concernee}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                      {item.titre}
                    </h4>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {item.resume}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.date_publication).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.auteur}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button variant="outline" className="w-full">
          Voir Toutes les Actualités
        </Button>
      </CardContent>
    </Card>
  );
};

