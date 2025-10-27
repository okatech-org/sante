import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Stethoscope, User, Pill, TestTube, Shield, LogIn, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function EcosystemCMST() {
  const navigate = useNavigate();

  const actors = [
    { id: 'sogara_admin', title: 'Administration CMST', email: 'sogara.demo@sante.ga', icon: Building2, target: '/demo/hospital' },
    { id: 'doctor', title: 'Médecin du travail', email: 'dr.travail.sogara@sante.ga', icon: Stethoscope, target: '/demo/doctor' },
    { id: 'nurse_1', title: 'Infirmier(ère)', email: 'infirmier.sogara@sante.ga', icon: Users, target: '/demo/doctor' },
    { id: 'nurse_2', title: 'Infirmier(ère)', email: 'infirmiere2.sogara@sante.ga', icon: Users, target: '/demo/doctor' },
    { id: 'patient_demo', title: 'Patient', email: 'patient.demo@sante.ga', icon: User, target: '/dashboard/patient' },
    { id: 'pharmacy_demo', title: 'Pharmacie partenaire', email: 'pharmacie.demo@sante.ga', icon: Pill, target: '/demo/pharmacy' },
    { id: 'lab_demo', title: 'Laboratoire partenaire', email: 'labo.demo@sante.ga', icon: TestTube, target: '/demo/laboratory' },
    { id: 'cnamgs', title: 'CNAMGS (tiers-payant)', email: 'cnamgs.demo@sante.ga', icon: Shield, target: '/demo/cnamgs' },
  ];

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Ecosystème — Centre de Médecine de Santé au Travail (CMST) SOGARA</h1>
                <p className="text-sm text-muted-foreground">Visualisation des comptes intervenants et accès rapide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actors.map((actor) => {
              const Icon = actor.icon as any;
              return (
                <Card key={actor.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{actor.title}</CardTitle>
                        <CardDescription className="text-xs">{actor.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="default" onClick={() => navigate('/admin/demo')}>
                        <LogIn className="h-4 w-4 mr-2" /> Se connecter (via Démo)
                      </Button>
                      <Button className="flex-1" variant="outline" onClick={() => navigate(actor.target)}>
                        Accéder <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}


