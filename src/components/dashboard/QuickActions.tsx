import { Card, CardContent } from "@/components/ui/card";
import { Search, Pill, Video, Hospital } from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    icon: Search,
    label: 'Trouver un médecin',
    href: '/providers?type=medecin',
    color: 'primary'
  },
  {
    icon: Pill,
    label: 'Pharmacies de garde',
    href: '/providers?type=pharmacie&garde=24/7',
    color: 'secondary'
  },
  {
    icon: Video,
    label: 'Téléconsultation urgente',
    href: '/teleconsultation',
    color: 'accent'
  },
  {
    icon: Hospital,
    label: 'Hôpitaux proches',
    href: '/providers?type=hopital',
    color: 'success'
  }
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.href} to={action.href}>
            <Card className="card-interactive cursor-pointer hover:border-primary">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">{action.label}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
