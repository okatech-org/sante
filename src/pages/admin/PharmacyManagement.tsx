import { useState } from 'react';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { PharmacyList } from '@/components/admin/pharmacy/PharmacyList';
import { PharmacyFilters } from '@/components/admin/pharmacy/PharmacyFilters';
import { PharmacyStatsCards } from '@/components/admin/pharmacy/PharmacyStatsCards';
import { PharmacyDetailModal } from '@/components/admin/pharmacy/PharmacyDetailModal';
import { usePharmacyManagement } from '@/hooks/usePharmacyManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import type { Pharmacie, StatutVerification } from '@/types/pharmacy';

export default function PharmacyManagement() {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacie | null>(null);
  const [activeTab, setActiveTab] = useState<'toutes' | StatutVerification>('toutes');
  const [filters, setFilters] = useState({
    search: '',
    ville: '',
    province: '',
    statut_verification: undefined as StatutVerification | undefined,
  });

  const { pharmacies, stats, loading, refetch } = usePharmacyManagement(filters);

  const handleCloseDetail = () => {
    setSelectedPharmacy(null);
    refetch();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'toutes' | StatutVerification);
    if (value === 'toutes') {
      setFilters({ ...filters, statut_verification: undefined });
    } else {
      setFilters({ ...filters, statut_verification: value as StatutVerification });
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Pharmacies</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les pharmacies, validez les inscriptions et surveillez l'activité
          </p>
        </div>

        <PharmacyStatsCards stats={stats} loading={loading} />

        <div className="bg-card rounded-lg border">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="border-b px-6 pt-6">
              <TabsList>
                <TabsTrigger value="toutes">Toutes</TabsTrigger>
                <TabsTrigger value="en_attente">En attente</TabsTrigger>
                <TabsTrigger value="verifie">Vérifiées</TabsTrigger>
                <TabsTrigger value="refuse">Refusées</TabsTrigger>
                <TabsTrigger value="suspendu">Suspendues</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 space-y-4">
              <PharmacyFilters filters={filters} onFiltersChange={setFilters} />

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <TabsContent value={activeTab} className="mt-0">
                  <PharmacyList
                    pharmacies={pharmacies}
                    onPharmacyClick={setSelectedPharmacy}
                  />
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        {selectedPharmacy && (
          <PharmacyDetailModal
            pharmacy={selectedPharmacy}
            open={!!selectedPharmacy}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </SuperAdminLayout>
  );
}
