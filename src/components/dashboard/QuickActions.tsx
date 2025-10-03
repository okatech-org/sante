import { Card, CardContent } from "@/components/ui/card";
import { Search, Pill, Video, Hospital } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function QuickActions() {
  const { t } = useLanguage();
  
  const quickActions = [
    {
      icon: Search,
      label: t('quickActions.findDoctor'),
      href: '/providers?type=medecin',
      color: 'primary'
    },
    {
      icon: Pill,
      label: t('quickActions.pharmacies'),
      href: '/providers?type=pharmacie&garde=24/7',
      color: 'secondary'
    },
    {
      icon: Video,
      label: t('quickActions.teleconsultation'),
      href: '/teleconsultation',
      color: 'accent'
    },
    {
      icon: Hospital,
      label: t('quickActions.hospitals'),
      href: '/providers?type=hopital',
      color: 'success'
    }
  ];
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
