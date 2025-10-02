import { MainLayout } from "@/components/layout/MainLayout";

export default function Providers() {
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Trouver un Prestataire</h1>
          <p className="text-muted-foreground mt-1">Recherchez des médecins, cliniques et pharmacies</p>
        </div>
        
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Contenu à venir...</p>
        </div>
      </div>
    </MainLayout>
  );
}
