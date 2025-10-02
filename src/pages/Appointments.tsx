import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Appointments() {
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes Rendez-vous</h1>
            <p className="text-muted-foreground mt-1">Gérez vos consultations médicales</p>
          </div>
          <Button size="lg" className="btn-mobile-xxl">
            <Plus className="mr-2 h-5 w-5" />
            Nouveau rendez-vous
          </Button>
        </div>
        
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Contenu à venir...</p>
        </div>
      </div>
    </MainLayout>
  );
}
