import { MainLayout } from "@/components/layout/MainLayout";

export default function Prescriptions() {
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mes Ordonnances</h1>
          <p className="text-muted-foreground mt-1">Consultez vos prescriptions médicales</p>
        </div>
        
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Contenu à venir...</p>
        </div>
      </div>
    </MainLayout>
  );
}
