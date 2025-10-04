import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const provinceData = [
  {
    province: "Estuaire",
    users: "8,947",
    providers: "1,823",
    consultations: "4,521",
    growth: "+12%",
    growthUp: true
  },
  {
    province: "Ogooué-Maritime",
    users: "1,847",
    providers: "284",
    consultations: "892",
    growth: "+8%",
    growthUp: true
  },
  {
    province: "Haut-Ogooué",
    users: "892",
    providers: "67",
    consultations: "234",
    growth: "+15%",
    growthUp: true
  },
  {
    province: "Moyen-Ogooué",
    users: "456",
    providers: "23",
    consultations: "127",
    growth: "+22%",
    growthUp: true
  },
  {
    province: "Autres Provinces",
    users: "405",
    providers: "50",
    consultations: "118",
    growth: "+18%",
    growthUp: true
  }
];

export function ProvinceAnalytics() {
  return (
    <Card className="bg-card/40 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">Analytics par Province</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead className="text-muted-foreground">Province</TableHead>
              <TableHead className="text-muted-foreground">Utilisateurs</TableHead>
              <TableHead className="text-muted-foreground">Prestataires</TableHead>
              <TableHead className="text-muted-foreground">Consultations</TableHead>
              <TableHead className="text-muted-foreground">Croissance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {provinceData.map((row, index) => (
              <TableRow key={index} className="border-border/30 hover:bg-background/20">
                <TableCell className="font-medium text-foreground">{row.province}</TableCell>
                <TableCell className="text-foreground">{row.users}</TableCell>
                <TableCell className="text-foreground">{row.providers}</TableCell>
                <TableCell className="text-foreground">{row.consultations}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-background/50 text-foreground">
                    {row.growthUp ? (
                      <TrendingUp className="h-3 w-3 mr-1 inline text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 inline text-red-400" />
                    )}
                    {row.growth}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
