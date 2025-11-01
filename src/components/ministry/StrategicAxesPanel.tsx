import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Users, DollarSign, Heart } from "lucide-react";
import { STRATEGIC_AXES_PNDS } from "@/types/ministry";

const axeIcons = {
  axe1: Target,
  axe2: Heart,
  axe3: Users,
  axe4: DollarSign,
  axe5: TrendingUp
};

const axeColors = {
  axe1: "text-blue-600 bg-blue-50 border-blue-200",
  axe2: "text-green-600 bg-green-50 border-green-200",
  axe3: "text-purple-600 bg-purple-50 border-purple-200",
  axe4: "text-orange-600 bg-orange-50 border-orange-200",
  axe5: "text-pink-600 bg-pink-50 border-pink-200"
};

export const StrategicAxesPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>5 Axes Stratégiques PNDS 2024-2028</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {STRATEGIC_AXES_PNDS.map((axe) => {
            const Icon = axeIcons[axe.id as keyof typeof axeIcons];
            const colorClass = axeColors[axe.id as keyof typeof axeColors];
            
            return (
              <div
                key={axe.id}
                className={`p-4 rounded-lg border-2 ${colorClass} hover:shadow-md transition-shadow cursor-pointer`}
              >
                <Icon className="h-8 w-8 mb-3" />
                <h4 className="font-bold text-sm mb-2">{axe.nom}</h4>
                <p className="text-xs opacity-80">{axe.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

