import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, AlertCircle } from "lucide-react";
import { GABON_PROVINCES } from "@/types/ministry";
import { Badge } from "@/components/ui/badge";

interface ProvinceData {
  name: string;
  performance: 'excellent' | 'bon' | 'moyen' | 'attention';
  alerts: number;
}

export const GabonMapWidget = () => {
  const provincesData: ProvinceData[] = GABON_PROVINCES.map(province => ({
    name: province,
    performance: province === 'Estuaire' ? 'excellent' : 
                 ['Haut-Ogooué', 'Moyen-Ogooué'].includes(province) ? 'bon' :
                 ['Ngounié', 'Ogooué-Maritime'].includes(province) ? 'moyen' : 'attention',
    alerts: province === 'Haut-Ogooué' ? 2 : province === 'Nyanga' ? 1 : 0
  }));

  const getPerformanceColor = (performance: ProvinceData['performance']) => {
    switch(performance) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'bon': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'moyen': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'attention': return 'bg-orange-100 text-orange-800 border-orange-300';
    }
  };

  const performanceStats = {
    excellent: provincesData.filter(p => p.performance === 'excellent').length,
    bon: provincesData.filter(p => p.performance === 'bon').length,
    moyen: provincesData.filter(p => p.performance === 'moyen').length,
    attention: provincesData.filter(p => p.performance === 'attention').length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Carte Sanitaire Nationale
          </CardTitle>
          <Badge>{GABON_PROVINCES.length} Provinces</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <div className="text-xl font-bold text-green-700">{performanceStats.excellent}</div>
            <div className="text-xs text-green-600">Excellent</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-xl font-bold text-blue-700">{performanceStats.bon}</div>
            <div className="text-xs text-blue-600">Bon</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="text-xl font-bold text-yellow-700">{performanceStats.moyen}</div>
            <div className="text-xs text-yellow-600">Moyen</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
            <div className="text-xl font-bold text-orange-700">{performanceStats.attention}</div>
            <div className="text-xs text-orange-600">Attention</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {provincesData.map((province) => (
            <div
              key={province.name}
              className={`p-3 rounded-lg border-2 ${getPerformanceColor(province.performance)} hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{province.name}</div>
                  {province.alerts > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">
                        {province.alerts} alerte{province.alerts > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                {province.performance === 'excellent' && (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Cliquez sur une province pour voir les détails
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

