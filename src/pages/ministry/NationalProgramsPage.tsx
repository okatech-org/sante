import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NationalProgram } from "@/types/ministry";
import { 
  Baby, 
  Activity, 
  Building2, 
  GraduationCap, 
  Database,
  Target,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";

export const NationalProgramsPage = () => {
  const mockPrograms: NationalProgram[] = [
    {
      id: "prog-001",
      nom: "Programme de Santé Maternelle et Infantile",
      categorie: "maternelle_infantile",
      description: "Amélioration de la santé des femmes enceintes et des enfants de 0 à 5 ans",
      objectifs: [
        "Réduire la mortalité maternelle de 316 à <150 pour 100 000 naissances",
        "Réduire la mortalité infantile de 45 à <25 pour 1000",
        "Atteindre 100% de couverture vaccinale infantile",
        "Améliorer l'accès aux soins prénataux et postnataux"
      ],
      indicateurs: [
        { nom: "Mortalité maternelle", valeur_actuelle: "316/100k", cible: "<150/100k", unite: "pour 100 000" },
        { nom: "Mortalité infantile", valeur_actuelle: "45/1000", cible: "<25/1000", unite: "pour 1000" },
        { nom: "Couverture vaccinale", valeur_actuelle: "87%", cible: "100%", unite: "%" }
      ],
      budget_alloue: "25 milliards FCFA",
      taux_execution: 72,
      responsable: "Direction Générale de la Santé",
      provinces_ciblees: ["Toutes"],
      date_debut: "2024-01-01",
      date_fin: "2028-12-31",
      status: "en_cours"
    },
    {
      id: "prog-002",
      nom: "Programme National de Lutte contre le Paludisme",
      categorie: "lutte_maladies",
      description: "Prévention, diagnostic et traitement du paludisme sur l'ensemble du territoire",
      objectifs: [
        "Réduire l'incidence du paludisme de 30%",
        "Distribuer 2 millions de moustiquaires imprégnées",
        "Former 500 agents de santé au diagnostic rapide",
        "Assurer la disponibilité des antipaludéens dans 100% des structures"
      ],
      indicateurs: [
        { nom: "Incidence paludisme", valeur_actuelle: "150/1000", cible: "105/1000", unite: "pour 1000" },
        { nom: "Moustiquaires distribuées", valeur_actuelle: 1200000, cible: 2000000, unite: "unités" },
        { nom: "Disponibilité antipaludéens", valeur_actuelle: "85%", cible: "100%", unite: "%" }
      ],
      budget_alloue: "15 milliards FCFA",
      taux_execution: 68,
      responsable: "Programme National de Lutte contre le Paludisme",
      provinces_ciblees: ["Toutes"],
      date_debut: "2024-01-01",
      date_fin: "2028-12-31",
      status: "en_cours"
    },
    {
      id: "prog-003",
      nom: "Programme de Renforcement des CHR",
      categorie: "renforcement_systeme",
      description: "Réhabilitation et équipement des 9 Centres Hospitaliers Régionaux",
      objectifs: [
        "Réhabiliter 100% des CHR",
        "Équiper chaque CHR d'un scanner et d'une échographie moderne",
        "Former le personnel aux nouvelles technologies",
        "Réduire les EVASAN de 50%"
      ],
      indicateurs: [
        { nom: "CHR réhabilités", valeur_actuelle: 4, cible: 9, unite: "structures" },
        { nom: "CHR équipés scanner", valeur_actuelle: 6, cible: 9, unite: "structures" },
        { nom: "EVASAN annuelles", valeur_actuelle: "250", cible: "125", unite: "cas" }
      ],
      budget_alloue: "45 milliards FCFA",
      taux_execution: 55,
      responsable: "Direction Générale de la Santé",
      provinces_ciblees: ["Toutes"],
      date_debut: "2024-01-01",
      date_fin: "2027-12-31",
      status: "en_cours"
    },
    {
      id: "prog-004",
      nom: "Programme de Formation des Infirmiers en Pratique Avancée (IPA)",
      categorie: "formation",
      description: "Formation de 500 infirmiers au niveau IPA pour pallier le déficit en médecins",
      objectifs: [
        "Former 500 IPA d'ici 2028",
        "Déployer les IPA dans les zones rurales",
        "Améliorer l'accès aux soins primaires",
        "Réduire la charge de travail des médecins"
      ],
      indicateurs: [
        { nom: "IPA formés", valeur_actuelle: 120, cible: 500, unite: "personnes" },
        { nom: "IPA déployés zones rurales", valeur_actuelle: 45, cible: 300, unite: "personnes" },
        { nom: "Consultations IPA/mois", valeur_actuelle: 8500, cible: 35000, unite: "consultations" }
      ],
      budget_alloue: "8 milliards FCFA",
      taux_execution: 45,
      responsable: "Direction Générale de la Santé",
      provinces_ciblees: ["Toutes"],
      date_debut: "2024-01-01",
      date_fin: "2028-12-31",
      status: "en_cours"
    }
  ];

  const [programs] = useState<NationalProgram[]>(mockPrograms);

  const getCategoryIcon = (categorie: NationalProgram['categorie']) => {
    switch(categorie) {
      case 'maternelle_infantile': return Baby;
      case 'lutte_maladies': return Activity;
      case 'renforcement_systeme': return Building2;
      case 'formation': return GraduationCap;
      case 'information_sanitaire': return Database;
      default: return Target;
    }
  };

  const getCategoryColor = (categorie: NationalProgram['categorie']) => {
    switch(categorie) {
      case 'maternelle_infantile': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'lutte_maladies': return 'bg-red-50 text-red-700 border-red-200';
      case 'renforcement_systeme': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'formation': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'information_sanitaire': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: NationalProgram['status']) => {
    switch(status) {
      case 'planifie': return 'secondary';
      case 'en_cours': return 'default';
      case 'termine': return 'outline';
      case 'suspendu': return 'destructive';
    }
  };

  const getStatusLabel = (status: NationalProgram['status']) => {
    switch(status) {
      case 'planifie': return 'Planifié';
      case 'en_cours': return 'En Cours';
      case 'termine': return 'Terminé';
      case 'suspendu': return 'Suspendu';
    }
  };

  const getCategoryLabel = (categorie: NationalProgram['categorie']) => {
    switch(categorie) {
      case 'maternelle_infantile': return 'Santé Maternelle & Infantile';
      case 'lutte_maladies': return 'Lutte contre les Maladies';
      case 'renforcement_systeme': return 'Renforcement du Système';
      case 'formation': return 'Formation';
      case 'information_sanitaire': return 'Information Sanitaire';
      default: return categorie;
    }
  };

  const totalBudget = programs.reduce((sum, prog) => {
    const budget = parseFloat(prog.budget_alloue.replace(/[^\d.]/g, ''));
    return sum + budget;
  }, 0);

  const avgExecution = programs.reduce((sum, prog) => sum + prog.taux_execution, 0) / programs.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Programmes Nationaux de Santé
            </CardTitle>
            <Button>
              + Nouveau Programme
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Programmes</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{programs.length}</div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">En Cours</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {programs.filter(p => p.status === 'en_cours').length}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Budget Total</span>
              </div>
              <div className="text-xl font-bold text-purple-700">{totalBudget} Mds</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Exécution Moy.</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">{avgExecution.toFixed(0)}%</div>
            </div>
          </div>

          <div className="space-y-4">
            {programs.map((program) => {
              const Icon = getCategoryIcon(program.categorie);
              const categoryColor = getCategoryColor(program.categorie);
              
              return (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 h-16 w-16 rounded-lg flex items-center justify-center ${categoryColor} border-2`}>
                        <Icon className="h-8 w-8" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold">{program.nom}</h3>
                            <Badge variant={getStatusColor(program.status)}>
                              {getStatusLabel(program.status)}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(program.categorie)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {program.responsable}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {new Date(program.date_debut).getFullYear()} - {new Date(program.date_fin).getFullYear()}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {program.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Budget Alloué</div>
                            <div className="text-sm font-semibold text-blue-600">{program.budget_alloue}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Provinces Ciblées</div>
                            <div className="text-sm font-semibold">
                              {program.provinces_ciblees.length === 1 && program.provinces_ciblees[0] === "Toutes" 
                                ? "9 Provinces" 
                                : `${program.provinces_ciblees.length} Province(s)`}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Taux d'Exécution</span>
                              <span className="font-semibold">{program.taux_execution}%</span>
                            </div>
                            <Progress value={program.taux_execution} className="h-2" />
                          </div>
                        </div>

                        <div className="border-t pt-3">
                          <div className="text-xs font-semibold mb-2 text-muted-foreground">
                            Indicateurs Clés ({program.indicateurs.length})
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {program.indicateurs.map((ind, idx) => (
                              <div key={idx} className="p-2 bg-gray-50 rounded border">
                                <div className="text-xs text-muted-foreground mb-1">{ind.nom}</div>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-bold">{ind.valeur_actuelle}</span>
                                  <span className="text-xs text-muted-foreground">→</span>
                                  <span className="text-sm font-bold text-green-600">{ind.cible}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <Users className="h-4 w-4 mr-2" />
                            Voir Détails
                          </Button>
                          <Button size="sm" variant="outline">
                            Rapport d'Avancement
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

