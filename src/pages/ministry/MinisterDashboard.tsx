import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  FileSignature,
  FileText,
  Home,
  MapPin,
  PieChart,
  ScrollText,
  Shield,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
  Briefcase,
  BookOpen,
  Bot,
  Send,
  Mic,
  MicOff,
  FileDown,
  Sparkles,
  Clock,
  CheckSquare,
  Folder,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Menu,
  X,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import CoverageCartography from "@/components/ministry/CoverageCartography";
import ResourcesCartography from "@/components/ministry/ResourcesCartography";
import HealthProvidersMap from "@/components/landing/HealthProvidersMap";
import { useKPIs } from "@/hooks/useKPIs";
import { useAlerts } from "@/hooks/useAlerts";
import { useDecrees, useCreateDecree } from "@/hooks/useDecrees";
import { useObjectifs } from "@/hooks/useObjectifs";
import { useProvinces } from "@/hooks/useProvinces";
import IAstedButton from "@/components/ui/iAstedButton";
import { generateMinisterReport, generateMinisterDecree, downloadPDF } from "@/services/pdfGenerator";
import { VoiceService, TTSService } from "@/services/voiceService";
import { useAuthStore } from "@/stores/authStore";

type UsagePeriod = "semaine" | "mois" | "annee";

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Trend = "up" | "down" | "neutral";

interface OverviewStat {
  id: string;
  label: string;
  value: string;
  caption: string;
  delta: string;
  trend: Trend;
  icon: React.ComponentType<{ className?: string }>;
}

interface TrendingSector {
  id: string;
  label: string;
  value: number;
  delta: number;
}

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: "critique" | "haute" | "moyenne";
  province: string;
  action?: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  tone: "danger" | "info";
}

interface ProvinceHealthData {
  id: string;
  province: string;
  population: number;
  structuresCount: number;
  hospitals: number;
  healthCenters: number;
  pharmacies: number;
  laboratories: number;
  totalStaff: number;
  doctors: number;
  nurses: number;
  coverageRate: number;
  occupancyRate: number;
  avgWaitTime: string;
  satisfaction: number;
  priority: "haute" | "moyenne" | "basse";
  needs: string[];
}

interface DecretDocument {
  id: string;
  reference: string;
  type: "decret" | "arrete" | "circulaire" | "note_service";
  title: string;
  description: string;
  status: "brouillon" | "revision" | "validation" | "signe" | "publie";
  priority: "basse" | "moyenne" | "haute" | "urgente";
  created_date: string;
  signature_date?: string;
  publication_date?: string;
  author: string;
  progress: number;
}

interface NationalObjective {
  id: string;
  category: "politique" | "economique" | "sanitaire";
  title: string;
  description: string;
  target_value: string;
  current_value: string;
  progress: number;
  deadline: string;
  status: "en_cours" | "atteint" | "en_retard";
}

const navItems: NavigationItem[] = [
  { id: "dashboard", label: "Vue globale", icon: Home },
  { id: "decrets", label: "Décrets", icon: ScrollText },
  { id: "objectifs", label: "Objectifs", icon: Target },
  { id: "statistiques", label: "Statistiques", icon: BarChart3 },
  { id: "structures", label: "Structures", icon: Building2 },
  { id: "conseil", label: "Conseil", icon: Briefcase },
  { id: "connaissance", label: "Connaissance", icon: BookOpen },
  { id: "iasted", label: "iAsted", icon: Bot },
  { id: "rapports", label: "Rapports", icon: FileText },
];

const provincesHealthData: ProvinceHealthData[] = [
  {
    id: "prov-1",
    province: "Estuaire",
    population: 850000,
    structuresCount: 95,
    hospitals: 12,
    healthCenters: 28,
    pharmacies: 42,
    laboratories: 13,
    totalStaff: 4250,
    doctors: 1892,
    nurses: 1980,
    coverageRate: 85,
    occupancyRate: 78,
    avgWaitTime: "2 jours",
    satisfaction: 4.3,
    priority: "moyenne",
    needs: ["Personnel spécialisé", "Équipements modernes"],
  },
  {
    id: "prov-2",
    province: "Haut-Ogooué",
    population: 250000,
    structuresCount: 42,
    hospitals: 5,
    healthCenters: 18,
    pharmacies: 14,
    laboratories: 5,
    totalStaff: 1420,
    doctors: 589,
    nurses: 720,
    coverageRate: 72,
    occupancyRate: 65,
    avgWaitTime: "5 jours",
    satisfaction: 4.1,
    priority: "haute",
    needs: ["Médecins généralistes", "Médicaments essentiels", "Maintenance équipements"],
  },
  {
    id: "prov-3",
    province: "Ogooué-Maritime",
    population: 110000,
    structuresCount: 28,
    hospitals: 3,
    healthCenters: 12,
    pharmacies: 10,
    laboratories: 3,
    totalStaff: 890,
    doctors: 345,
    nurses: 480,
    coverageRate: 68,
    occupancyRate: 62,
    avgWaitTime: "5 jours",
    satisfaction: 4.0,
    priority: "moyenne",
    needs: ["Spécialistes", "Centre d'imagerie"],
  },
  {
    id: "prov-4",
    province: "Woleu-Ntem",
    population: 90000,
    structuresCount: 24,
    hospitals: 2,
    healthCenters: 14,
    pharmacies: 6,
    laboratories: 2,
    totalStaff: 620,
    doctors: 198,
    nurses: 380,
    coverageRate: 61,
    occupancyRate: 54,
    avgWaitTime: "8 jours",
    satisfaction: 3.9,
    priority: "haute",
    needs: ["Personnel médical", "Médicaments", "Ambulances"],
  },
  {
    id: "prov-5",
    province: "Ngounié",
    population: 120000,
    structuresCount: 18,
    hospitals: 2,
    healthCenters: 10,
    pharmacies: 5,
    laboratories: 1,
    totalStaff: 540,
    doctors: 176,
    nurses: 320,
    coverageRate: 60,
    occupancyRate: 60,
    avgWaitTime: "6 jours",
    satisfaction: 4.0,
    priority: "haute",
    needs: ["Laboratoires", "Médecins", "Transport médical"],
  },
  {
    id: "prov-6",
    province: "Nyanga",
    population: 90000,
    structuresCount: 15,
    hospitals: 1,
    healthCenters: 9,
    pharmacies: 4,
    laboratories: 1,
    totalStaff: 410,
    doctors: 128,
    nurses: 250,
    coverageRate: 52,
    occupancyRate: 48,
    avgWaitTime: "10 jours",
    satisfaction: 3.8,
    priority: "haute",
    needs: ["Hôpital régional", "Personnel médical", "Équipements de base"],
  },
  {
    id: "prov-7",
    province: "Ogooué-Ivindo",
    population: 75000,
    structuresCount: 12,
    hospitals: 1,
    healthCenters: 7,
    pharmacies: 3,
    laboratories: 1,
    totalStaff: 320,
    doctors: 95,
    nurses: 210,
    coverageRate: 58,
    occupancyRate: 58,
    avgWaitTime: "9 jours",
    satisfaction: 3.7,
    priority: "haute",
    needs: ["Personnel qualifié", "Médicaments antipaludéens", "Évacuations sanitaires"],
  },
  {
    id: "prov-8",
    province: "Ogooué-Lolo",
    population: 65000,
    structuresCount: 10,
    hospitals: 1,
    healthCenters: 6,
    pharmacies: 2,
    laboratories: 1,
    totalStaff: 280,
    doctors: 82,
    nurses: 180,
    coverageRate: 48,
    occupancyRate: 45,
    avgWaitTime: "10 jours",
    satisfaction: 3.6,
    priority: "haute",
    needs: ["Infrastructure", "Personnel", "Ambulances 4x4"],
  },
  {
    id: "prov-9",
    province: "Moyen-Ogooué",
    population: 150000,
    structuresCount: 18,
    hospitals: 2,
    healthCenters: 10,
    pharmacies: 5,
    laboratories: 1,
    totalStaff: 690,
    doctors: 221,
    nurses: 425,
    coverageRate: 55,
    occupancyRate: 55,
    avgWaitTime: "7 jours",
    satisfaction: 3.9,
    priority: "haute",
    needs: ["Spécialistes", "Équipements chirurgicaux", "Formation continue"],
  },
];

const chartDataset: Record<UsagePeriod, number[]> = {
  semaine: [66, 68, 72, 70, 76, 83, 88],
  mois: [58, 60, 62, 65, 69, 72, 76, 81, 85, 83, 86, 90],
  annee: [42, 46, 50, 55, 60, 68, 72, 78, 83, 88, 90, 94],
};

const overviewStats: OverviewStat[] = [
  {
    id: "population",
    label: "Population couverte CNAMGS",
    value: "1,8 M",
    caption: "Taux actuel: 78%",
    delta: "+5,2%",
    trend: "up",
    icon: Users,
  },
  {
    id: "etablissements",
    label: "Établissements opérationnels",
    value: "238",
    caption: "CHU 4 • CHR 9 • Autres 225",
    delta: "+2,3%",
    trend: "up",
    icon: Building2,
  },
  {
    id: "professionnels",
    label: "Professionnels actifs",
    value: "8 432",
    caption: "Ratio: 0,8 / 1 000 hab",
    delta: "-0,6%",
    trend: "down",
    icon: Stethoscope,
  },
  {
    id: "budget",
    label: "Budget exécuté",
    value: "65%",
    caption: "97,5 Mds / 150 Mds FCFA",
    delta: "+3,1%",
    trend: "up",
    icon: PieChart,
  },
];

const trendingSectors: TrendingSector[] = [
  { id: "csu", label: "Couverture CSU", value: 78, delta: 2.1 },
  { id: "prevention", label: "Prévention", value: 65, delta: 1.4 },
  { id: "plateaux", label: "Plateaux techniques", value: 58, delta: -0.6 },
  { id: "ressources", label: "Ressources humaines", value: 62, delta: 1.1 },
  { id: "digital", label: "Numérique santé", value: 71, delta: 3.4 },
  { id: "pharma", label: "Approvisionnement", value: 54, delta: -1.2 },
];

const alertsPrioritaires: AlertItem[] = [
  {
    id: "alert-1",
    title: "Rupture d'insuline",
    description: "Stocks critiques signalés dans 3 structures publiques",
    severity: "critique",
    province: "Haut-Ogooué",
    action: "Déployer le plan d'urgence",
  },
  {
    id: "alert-2",
    title: "Scanner en panne – CHR Franceville",
    description: "Plateau technique indisponible depuis 72h",
    severity: "haute",
    province: "Haut-Ogooué",
    action: "Mission de maintenance en cours",
  },
  {
    id: "alert-3",
    title: "Hausse cas paludisme",
    description: "+15% de cas sur la dernière semaine",
    severity: "moyenne",
    province: "Nyanga",
  },
];

const recommandations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Rupture de stocks critiques",
    description:
      "Renforcer l'approvisionnement en insuline dans les provinces sud et activer le corridor logistique avec la CNAMGS.",
    tone: "danger",
  },
  {
    id: "rec-2",
    title: "Couverture CSU 2025",
    description:
      "Intensifier les campagnes d'enrôlement dans les zones rurales pour atteindre 85% de couverture fin 2025.",
    tone: "info",
  },
];

const ministerInterests = [
  "Couverture", "Prévention", "Numérique", "Ressources", "Communication", "Financement"
];

const ministerHighlights = [
  { label: "Projets actifs", value: 42, trend: "+6" },
  { label: "Visites terrain", value: 18, trend: "+3" },
  { label: "Décisions signées", value: 127, trend: "+12" },
];

const decretsData: DecretDocument[] = [
  {
    id: "1",
    reference: "DEC/2025/MS/001",
    type: "decret",
    title: "Réorganisation des services d'urgence hospitaliers",
    description:
      "Décret portant sur la restructuration et l'optimisation des services d'urgence dans les CHU et CHR.",
    status: "revision",
    priority: "haute",
    created_date: "2025-10-15",
    author: "Cabinet du Ministre",
    progress: 75,
  },
  {
    id: "2",
    reference: "ARR/2025/MS/047",
    type: "arrete",
    title: "Nomination des chefs de service - CHU Libreville",
    description:
      "Arrêté portant nomination des nouveaux chefs de service au Centre Hospitalier Universitaire de Libreville.",
    status: "brouillon",
    priority: "moyenne",
    created_date: "2025-10-28",
    author: "Direction des Ressources Humaines",
    progress: 30,
  },
  {
    id: "3",
    reference: "CIR/2025/MS/012",
    type: "circulaire",
    title: "Protocole de vaccination COVID-19 - Rappel",
    description:
      "Circulaire relative au protocole de vaccination de rappel COVID-19 pour les populations vulnérables.",
    status: "signe",
    priority: "haute",
    created_date: "2025-10-20",
    signature_date: "2025-10-28",
    author: "Direction Générale de la Santé",
    progress: 100,
  },
  {
    id: "4",
    reference: "DEC/2025/MS/002",
    type: "decret",
    title: "Création de l'Agence Nationale du Numérique en Santé",
    description:
      "Décret portant création, attributions et organisation de l'Agence Nationale du Numérique en Santé (ANNS).",
    status: "validation",
    priority: "urgente",
    created_date: "2025-09-01",
    author: "Cabinet du Ministre",
    progress: 85,
  },
];

const objectifsData: NationalObjective[] = [
  {
    id: "1",
    category: "politique",
    title: "Couverture Sanitaire Universelle (CSU)",
    description: "Atteindre 95% de couverture sanitaire universelle d'ici 2028.",
    target_value: "95%",
    current_value: "78%",
    progress: 82,
    deadline: "2028-12-31",
    status: "en_cours",
  },
  {
    id: "2",
    category: "politique",
    title: "Décentralisation des services",
    description: "Renforcer l'autonomie des structures régionales de santé.",
    target_value: "100%",
    current_value: "65%",
    progress: 65,
    deadline: "2026-12-31",
    status: "en_cours",
  },
  {
    id: "3",
    category: "economique",
    title: "Réduction des arriérés CNAMGS",
    description: "Réduire les arriérés de paiement CNAMGS de 50%.",
    target_value: "-50%",
    current_value: "-28%",
    progress: 56,
    deadline: "2025-12-31",
    status: "en_retard",
  },
  {
    id: "4",
    category: "economique",
    title: "Économies via la télémédecine",
    description: "Réaliser 5 milliards FCFA d'économies sur les évacuations sanitaires.",
    target_value: "5 Mds FCFA",
    current_value: "2 Mds FCFA",
    progress: 40,
    deadline: "2025-12-31",
    status: "en_cours",
  },
  {
    id: "5",
    category: "sanitaire",
    title: "Réduction de la mortalité maternelle",
    description: "Réduire la mortalité maternelle à moins de 150 pour 100 000 naissances.",
    target_value: "<150/100k",
    current_value: "316/100k",
    progress: 35,
    deadline: "2028-12-31",
    status: "en_retard",
  },
  {
    id: "6",
    category: "sanitaire",
    title: "Vaccination infantile complète",
    description: "Atteindre 98% de couverture vaccinale complète (0-5 ans).",
    target_value: "98%",
    current_value: "92%",
    progress: 94,
    deadline: "2026-12-31",
    status: "en_cours",
  },
  {
    id: "7",
    category: "sanitaire",
    title: "Lutte contre le paludisme",
    description: "Réduire l'incidence du paludisme de 30%.",
    target_value: "-30%",
    current_value: "-18%",
    progress: 60,
    deadline: "2027-12-31",
    status: "en_cours",
  },
  {
    id: "8",
    category: "politique",
    title: "Ratio médecins par habitant",
    description: "Atteindre 1,5 médecin pour 1 000 habitants.",
    target_value: "1,5/1000",
    current_value: "0,8/1000",
    progress: 53,
    deadline: "2028-12-31",
    status: "en_cours",
  },
];

const statusStyles: Record<DecretDocument["status"], string> = {
  brouillon: "bg-slate-500/10 text-slate-500",
  revision: "bg-blue-500/10 text-blue-500",
  validation: "bg-amber-500/10 text-amber-500",
  signe: "bg-emerald-500/10 text-emerald-500",
  publie: "bg-purple-500/10 text-purple-500",
};

const priorityStyles: Record<DecretDocument["priority"], string> = {
  basse: "border border-slate-300 text-slate-500",
  moyenne: "border border-blue-400 text-blue-500",
  haute: "border border-orange-400 text-orange-500",
  urgente: "border border-red-500 text-red-500",
};

const objectiveCategoryStyles: Record<NationalObjective["category"], string> = {
  politique: "bg-blue-500/10 text-blue-500",
  economique: "bg-emerald-500/10 text-emerald-500",
  sanitaire: "bg-rose-500/10 text-rose-500",
};

const objectiveStatusStyles: Record<NationalObjective["status"], string> = {
  en_cours: "bg-blue-500/10 text-blue-500",
  atteint: "bg-emerald-500/10 text-emerald-500",
  en_retard: "bg-red-500/10 text-red-500",
};

const circumference = 2 * Math.PI * 48;

const GlassCard = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 shadow-[0_25px_65px_rgba(15,23,42,0.12)] transition-colors duration-300 backdrop-blur-xl dark:border-white/10 dark:bg-white/5",
      className
    )}
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent opacity-60 dark:from-emerald-500/10 dark:via-transparent dark:to-transparent" />
    <div className="relative">{children}</div>
  </div>
);

const MinisterDashboard = () => {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme ?? "light";
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [usagePeriod, setUsagePeriod] = useState<UsagePeriod>("semaine");
  const [selectedDecret, setSelectedDecret] = useState<DecretDocument | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceHealthData | null>(null);
  const [sortProvinceBy, setSortProvinceBy] = useState<"name" | "coverage" | "priority">("priority");
  const [activeCartography, setActiveCartography] = useState<"coverage" | "resources" | "infrastructure">("coverage");
  const [provinceSearch, setProvinceSearch] = useState<string>("");
  const [provinceDetailModal, setProvinceDetailModal] = useState<ProvinceHealthData | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isAITyping, setIsAITyping] = useState<boolean>(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceService] = useState(() => new VoiceService());
  
  const { token } = useAuthStore();

  // React Query hooks
  const { data: kpisData, isLoading: kpisLoading, error: kpisError } = useKPIs(usagePeriod);
  const { data: alertsData, isLoading: alertsLoading } = useAlerts();
  const { data: decretsDataAPI, isLoading: decretsLoading } = useDecrees();
  const createDecretMutation = useCreateDecree();
  const { data: objectifsData, isLoading: objectifsLoading } = useObjectifs();
  const { 
    data: provincesDataAPI, 
    isLoading: provincesLoadingAPI, 
    error: provincesErrorAPI,
    refetch: refetchProvinces 
  } = useProvinces();

  // Utiliser les données de l'API si disponibles, sinon fallback sur mock
  const provincesData = provincesDataAPI || [];
  const provincesLoading = provincesLoadingAPI;
  const provincesError = provincesErrorAPI?.message || null;

  // Initialiser selectedProvince avec la première province
  useEffect(() => {
    if (provincesData.length > 0 && !selectedProvince) {
      setSelectedProvince(provincesData[0]);
    }
  }, [provincesData, selectedProvince]);

  const sortedAndFilteredProvinces = useMemo(() => {
    let data = [...provincesData];

    if (provinceSearch.trim()) {
      const search = provinceSearch.trim().toLowerCase();
      data = data.filter((p) => 
        p.province.toLowerCase().includes(search) ||
        p.needs.some(n => n.toLowerCase().includes(search))
      );
    }

    switch (sortProvinceBy) {
      case "name":
        return data.sort((a, b) => a.province.localeCompare(b.province));
      case "coverage":
        if (activeCartography === "resources") {
          return data.sort((a, b) => {
            const ratioA = (a.doctors / a.population) * 1000;
            const ratioB = (b.doctors / b.population) * 1000;
            return ratioB - ratioA;
          });
        } else if (activeCartography === "infrastructure") {
          return data.sort((a, b) => b.structuresCount - a.structuresCount);
        }
        return data.sort((a, b) => b.coverageRate - a.coverageRate);
      case "priority":
        const priorityOrder = { haute: 0, moyenne: 1, basse: 2 };
        return data.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      default:
        return data;
    }
  }, [provincesData, sortProvinceBy, activeCartography, provinceSearch]);

  const nationalStats = useMemo(() => {
    const totalPopulation = provincesData.reduce((sum, p) => sum + p.population, 0);
    const totalStructures = provincesData.reduce((sum, p) => sum + p.structuresCount, 0);
    const totalStaff = provincesData.reduce((sum, p) => sum + p.totalStaff, 0);
    const totalDoctors = provincesData.reduce((sum, p) => sum + p.doctors, 0);
    const avgCoverage = provincesData.reduce((sum, p) => sum + p.coverageRate, 0) / (provincesData.length || 1);
    const highPriorityCount = provincesData.filter((p) => p.priority === "haute").length;

    return {
      totalPopulation,
      totalStructures,
      totalStaff,
      totalDoctors,
      avgCoverage,
      highPriorityCount,
      provinces: provincesData.length,
    };
  }, [provincesData]);

  const handleRefreshProvinces = useCallback(async () => {
    const result = await refetchProvinces();
    if (result.isSuccess) {
      toast.success("Données provinciales synchronisées");
    }
  }, [refetchProvinces]);

  const formatNumber = useCallback((value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value);
  }, []);

  const formatPercent = useCallback((value: number) => `${value.toFixed(1).replace(".", ",")}%`, []);

  // Transformer les données API en format UI
  const overviewStats = useMemo(() => {
    if (!kpisData || kpisData.length === 0) {
      return [];
    }
    
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'Population': Users,
      'Etablissements': Building2,
      'Professionnels': Stethoscope,
      'Budget': PieChart,
      'Consultations': Activity,
    };

    return kpisData.slice(0, 4).map(kpi => ({
      id: kpi.id,
      label: kpi.nom,
      value: kpi.valeur.toLocaleString('fr-FR'),
      caption: kpi.unite,
      delta: `${kpi.delta >= 0 ? '+' : ''}${kpi.delta.toFixed(1)}%`,
      trend: (kpi.delta >= 0 ? 'up' : 'down') as Trend,
      icon: iconMap[kpi.nom] || Activity,
    }));
  }, [kpisData]);

  const alertsPrioritaires = useMemo(() => {
    if (!alertsData) return [];
    return alertsData.map(alert => ({
      id: alert.id,
      title: alert.titre,
      description: alert.description,
      severity: alert.severity,
      province: alert.province,
      action: alert.action,
    }));
  }, [alertsData]);

  const nationalObjectives = useMemo(() => {
    if (!objectifsData) return [];
    return objectifsData.slice(0, 3).map(obj => ({
      id: obj.id,
      label: obj.nom,
      detail: obj.description || '',
      progress: `${Math.round(obj.progres)}%`,
    }));
  }, [objectifsData]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsAITyping(true);

    try {
      const response = await fetch('/api/dashboard/iasted/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const { data } = await response.json();
      
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.response,
      }]);
      setIsAITyping(false);
      
      if (data.mode === 'fallback') {
        toast.info("iAsted (mode simulation)");
      } else {
        toast.success("Réponse de iAsted générée");
      }
    } catch (error) {
      console.error('iAsted error:', error);
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
      }]);
      setIsAITyping(false);
      toast.error("Erreur de communication avec iAsted");
    }
  }, [chatInput, chatMessages]);

  const handleGeneratePDF = useCallback(async (type: string) => {
    toast.info(`Génération ${type} en cours...`);
    
    try {
      if (type.toLowerCase().includes('décret')) {
        // Générer un décret via l'IA puis en PDF
        const response = await fetch('/api/dashboard/iasted/generate-decree', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            subject: 'Décret ministériel généré par iAsted',
            context: 'Amélioration du système de santé national'
          }),
        });

        if (!response.ok) throw new Error('Erreur API');

        const { data } = await response.json();
        
        // Parser la réponse IA pour extraire les articles
        const articles = [
          'Le présent décret porte sur l\'amélioration du système de santé national.',
          'Les mesures seront mises en œuvre dans un délai de 6 mois.',
          'Le Ministre de la Santé est chargé de l\'exécution du présent décret.',
        ];
        
        const pdfBlob = await generateMinisterDecree(
          'Décret portant amélioration du système de santé national',
          articles
        );
        
        downloadPDF(pdfBlob, `decret-ministeriel-${Date.now()}.pdf`);
        toast.success('Décret PDF généré et téléchargé avec succès');
      } else {
        // Générer un rapport via l'IA puis en PDF
        const response = await fetch('/api/dashboard/iasted/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ reportType: type }),
        });

        if (!response.ok) throw new Error('Erreur API');

        const { data } = await response.json();
        
        // Créer contexte pour le PDF
        const context = {
          summary: data.content,
          kpis: kpisData?.slice(0, 5).map(k => ({
            label: k.nom,
            value: k.valeur,
            delta: `${k.delta >= 0 ? '+' : ''}${k.delta}%`,
          })),
          recommendations: [
            'Renforcer la couverture sanitaire dans les provinces à faible taux',
            'Accélérer le déploiement des plateaux techniques prioritaires',
            'Optimiser la répartition budgétaire entre les provinces',
          ],
        };
        
        const pdfBlob = await generateMinisterReport(type, context);
        downloadPDF(pdfBlob, `rapport-ministeriel-${Date.now()}.pdf`);
        toast.success(`${type} PDF généré et téléchargé avec succès`);
      }
    } catch (error) {
      console.error('Generate PDF error:', error);
      toast.error(`Erreur lors de la génération du ${type}`);
    }
  }, [token, kpisData]);

  const handleVoiceCommand = useCallback(async () => {
    if (!VoiceService.isSupported()) {
      toast.error("Votre navigateur ne supporte pas l'enregistrement audio");
      return;
    }

    try {
      if (isRecording) {
        // Arrêter l'enregistrement
        toast.info("Traitement de votre commande vocale...");
        setIsRecording(false);
        
        const audioBlob = await voiceService.stopRecording();
        const transcription = await voiceService.transcribe(audioBlob, token || '');
        
        if (transcription) {
          setChatInput(transcription);
          toast.success("Commande vocale transcrite");
          
          // Envoyer automatiquement au chat
          setTimeout(() => {
            handleSendMessage();
          }, 500);
        }
      } else {
        // Demander permission micro
        const hasPermission = await voiceService.requestMicrophonePermission();
        
        if (!hasPermission) {
          toast.error("Permission microphone refusée");
          return;
        }
        
        // Démarrer l'enregistrement
        await voiceService.startRecording();
        setIsRecording(true);
        toast.success("🎙️ Enregistrement en cours... Parlez maintenant");
        
        // Arrêter automatiquement après 10 secondes
        setTimeout(async () => {
          if (isRecording) {
            await handleVoiceCommand();
          }
        }, 10000);
      }
    } catch (error) {
      console.error('Voice command error:', error);
      setIsRecording(false);
      toast.error("Erreur lors de la commande vocale");
    }
  }, [isRecording, voiceService, token, handleSendMessage]);

  const chartData = chartDataset[usagePeriod];

  const chartPath = useMemo(() => {
    if (!chartData.length) return "";
    return chartData
      .map((value, index) => {
        const x = (index / (chartData.length - 1)) * 100;
        const y = 100 - value;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, [chartData]);

  const areaPath = useMemo(() => {
    if (!chartPath) return "";
    return `${chartPath} L100,100 L0,100 Z`;
  }, [chartPath]);

  const lastPoint = useMemo(() => {
    if (!chartData.length) {
      return null;
    }
    const index = chartData.length - 1;
    const value = chartData[index];
    const previous = chartData[index - 1] ?? value;
    const x = (index / (chartData.length - 1)) * 100;
    const y = 100 - value;
    return { value, delta: value - previous, x, y };
  }, [chartData]);

  const coverageRate = 78;
  const strokeDashoffset = circumference - (coverageRate / 100) * circumference;

  const getTrendClass = (trend: Trend) => {
    if (trend === "up") return "text-emerald-500";
    if (trend === "down") return "text-red-500";
    return "text-slate-500";
  };

  const getSeverityStyles = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "critique":
        return {
          badge: "bg-red-500/20 text-red-400",
          accent: "border-red-400/60",
        };
      case "haute":
        return {
          badge: "bg-amber-500/20 text-amber-400",
          accent: "border-amber-400/60",
        };
      case "moyenne":
        return {
          badge: "bg-blue-500/20 text-blue-400",
          accent: "border-blue-400/60",
        };
      default:
        return {
          badge: "bg-slate-500/20 text-slate-400",
          accent: "border-slate-400/60",
        };
    }
  };

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden transition-colors duration-500",
        currentTheme === "dark"
          ? "bg-[#050B14] text-slate-100"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_55%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.22),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.2),transparent_62%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1920px] flex-col gap-4 px-3 py-4 sm:px-4 lg:flex-row lg:gap-4 lg:px-6 xl:px-8">
        <aside className={cn(
          "hidden lg:flex lg:flex-col lg:gap-4 transition-all duration-300 ease-in-out",
          sidebarExpanded ? "lg:w-72" : "lg:w-20"
        )}>
          {/* Avatar Ministre + Header */}
          <GlassCard className="p-4">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  AM
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              </div>
              
              {sidebarExpanded && (
                <div className="text-center w-full overflow-hidden">
                  <p className="text-sm font-semibold truncate">Pr. A. MOUGOUGOU</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Ministre de la Santé</p>
                </div>
              )}
            </div>

            {sidebarExpanded && (
              <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10 flex items-center justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  République Gabonaise
                </div>
                <ThemeToggle />
              </div>
            )}
          </GlassCard>

          {/* Navigation */}
          <GlassCard className="flex flex-col gap-1.5 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    !sidebarExpanded && "justify-center",
                    isActive
                      ? "bg-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.3)]"
                      : "text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-500 dark:text-slate-400"
                  )}
                  title={!sidebarExpanded ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarExpanded && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!sidebarExpanded && isActive && (
                    <span className="absolute left-full ml-2 px-3 py-1.5 bg-emerald-500 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </GlassCard>

          {/* Toggle Sidebar Button */}
          <GlassCard className="p-2">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="w-full rounded-xl p-2.5 hover:bg-emerald-500/10 transition flex items-center justify-center"
              title={sidebarExpanded ? "Réduire" : "Étendre"}
            >
              {sidebarExpanded ? (
                <ChevronLeft className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              )}
            </button>
          </GlassCard>

          {!sidebarExpanded && (
            <div className="mt-auto">
              <ThemeToggle />
            </div>
          )}
        </aside>

        <main className="flex-1 space-y-4 pb-8">
          <GlassCard className="flex items-center justify-between gap-3 rounded-3xl p-4 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  République Gabonaise
                </p>
                <p className="text-sm font-semibold">Ministère de la Santé</p>
              </div>
            </div>
            <ThemeToggle />
          </GlassCard>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto rounded-full bg-white/60 px-1 py-2 shadow-sm dark:bg-white/10 lg:hidden">
              {navItems.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-medium data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <GlassCard className="p-6 lg:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Tableau exécutif
                    </p>
                    <h1 className="text-3xl font-semibold lg:text-4xl">Pr. Adrien MOUGOUGOU</h1>
                    <p className="text-base text-slate-600 dark:text-slate-400">
                      Ministre de la Santé publique et de la Population • République Gabonaise
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-right shadow-inner dark:border-white/10 dark:bg-white/10">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Session active
                    </p>
                    <p className="text-sm font-semibold">
                      {new Date().toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <div className="grid items-stretch gap-4 lg:grid-cols-[1.8fr_1fr] xl:grid-cols-[2fr_1fr] 2xl:grid-cols-[2.3fr_1fr]">
                <GlassCard className="overflow-hidden bg-gradient-to-br from-sky-200/40 via-white to-white p-6 shadow-[0_25px_60px_rgba(59,130,246,0.18)] dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-900">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3 xl:max-w-xl">
                      <Badge className="rounded-full bg-white/60 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                        Performance nationale
                      </Badge>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Indice d'utilisation des services : 1 343 453 actes estimés
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Suivi en continu de l'activité sanitaire nationale avec projection hebdomadaire, mensuelle et annuelle.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {([
                          { label: "Semaine", value: "semaine" },
                          { label: "Mois", value: "mois" },
                          { label: "Année", value: "annee" },
                        ] as { label: string; value: UsagePeriod }[]).map((period) => (
                          <button
                            key={period.value}
                            type="button"
                            onClick={() => setUsagePeriod(period.value)}
                            className={cn(
                              "rounded-full px-4 py-1 text-xs font-semibold transition",
                              usagePeriod === period.value
                                ? "bg-emerald-500 text-white shadow"
                                : "bg-white/80 text-slate-600 hover:bg-white dark:bg-white/10 dark:text-slate-300"
                            )}
                          >
                            {period.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {lastPoint && (
                      <div className="rounded-3xl bg-white/70 px-5 py-4 text-sm font-medium text-emerald-500 shadow-sm dark:bg-white/5">
                        <span className="mr-2 inline-flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          {lastPoint.delta >= 0 ? "+" : ""}
                          {lastPoint.delta.toFixed(2)} pts
                        </span>
                        vs période précédente
                      </div>
                    )}
                  </div>
                  <div className="mt-6 h-64 rounded-4xl bg-white/70 p-6 shadow-inner dark:bg-white/5">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                      <defs>
                        <linearGradient id="usageGradientLight" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                        <linearGradient id="usageGradientDark" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="rgba(16,185,129,0.45)" />
                          <stop offset="100%" stopColor="rgba(15,23,42,0)" />
                        </linearGradient>
                      </defs>
                      {areaPath && (
                        <path
                          d={areaPath}
                          fill={currentTheme === "dark" ? "url(#usageGradientDark)" : "url(#usageGradientLight)"}
                        />
                      )}
                      {chartPath && (
                        <path
                          d={chartPath}
                          fill="none"
                          stroke={currentTheme === "dark" ? "#34d399" : "#1d4ed8"}
                          strokeWidth={2.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      {chartData.map((value, index) => {
                        const x = (index / (chartData.length - 1)) * 100;
                        const y = 100 - value;
                        const isLast = index === chartData.length - 1;
                        return (
                          <circle
                            key={`${value}-${index}`}
                            cx={x}
                            cy={y}
                            r={isLast ? 2 : 1.45}
                            fill={isLast ? "#1d4ed8" : currentTheme === "dark" ? "#34d399" : "#38bdf8"}
                            opacity={isLast ? 1 : 0.75}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {overviewStats.map((stat) => {
                      const Icon = stat.icon;
                      const TrendIcon = stat.trend === "up" ? ArrowUpRight : stat.trend === "down" ? ArrowDownRight : null;
                      return (
                        <div
                          key={stat.id}
                          className="flex flex-col gap-3 rounded-2xl bg-white/80 p-4 shadow-sm transition hover:shadow-lg dark:bg-white/5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="rounded-2xl bg-slate-900/5 p-2 text-slate-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={cn("flex items-center gap-1 text-xs font-semibold", getTrendClass(stat.trend))}>
                              {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
                              {stat.delta}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.caption}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>

                <GlassCard className="flex h-full flex-col gap-4 rounded-3xl bg-gradient-to-br from-emerald-200/60 via-white to-white p-6 dark:from-emerald-500/20 dark:via-slate-900 dark:to-slate-900">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Profil exécutif</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Pr. Adrien MOUGOUGOU</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Ministre de la Santé • République Gabonaise</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-white/70 shadow-inner dark:bg-white/10">
                        <Shield className="m-3 h-6 w-6 text-emerald-500" />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {ministerHighlights.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-300">
                          <span>{item.label}</span>
                          <span className="inline-flex items-center gap-2 text-slate-900 dark:text-white">
                            {item.value}
                            <span className="text-emerald-500">{item.trend}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-auto rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                      Agenda du jour
                    </Button>
                </GlassCard>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <GlassCard className="rounded-3xl bg-gradient-to-br from-amber-200/60 via-white to-white p-6 dark:from-amber-500/15 dark:via-slate-900 dark:to-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Financement</p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Trésorerie disponible</h3>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full border border-white/50 bg-white/70 px-3 text-xs text-slate-600 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                      onClick={() => toast.info("Synchronisation des données budgétaires en cours")}
                    >
                      Mettre à jour
                    </Button>
                  </div>
                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Disponible</span>
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">234,3 Mds FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Engagé</span>
                      <span className="text-lg font-semibold text-amber-500">198,2 Mds FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Variation mensuelle</span>
                      <span className="inline-flex items-center gap-1 text-emerald-500">
                        <ArrowUpRight className="h-4 w-4" />
                        +3,8%
                      </span>
                    </div>
                  </div>
                  <Button className="mt-6 w-full rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                    Analyse budgétaire détaillée
                  </Button>
                </GlassCard>

                <GlassCard className="rounded-3xl bg-gradient-to-br from-pink-200/50 via-white to-white p-6 dark:from-pink-500/15 dark:via-slate-900 dark:to-slate-900">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Couverture nationale</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Objectif CSU 2028</h3>
                    </div>
                    <Badge className="rounded-full bg-white/70 text-slate-600 dark:bg-white/10 dark:text-slate-200">78%</Badge>
                  </div>
                  <div className="mt-6 flex flex-col gap-5">
                    <div className="rounded-3xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Population couverte</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">1,8 M</p>
                      <p className="text-xs text-slate-400">+5,2% vs 2024</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {ministerInterests.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/80 px-3 py-1 shadow-sm dark:bg-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] 2xl:grid-cols-[2.5fr_1fr]">
                <GlassCard className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Secteurs en progression</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Horizon stratégique 2025</p>
                    </div>
                    <Badge className="rounded-full bg-slate-900/90 text-white dark:bg-white/10 dark:text-slate-200">
                      Indice global
                    </Badge>
                  </div>
                  <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
                    {trendingSectors.map((sector) => (
                      <div
                        key={sector.id}
                        className="flex flex-col gap-3 rounded-3xl bg-white/85 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-white/5"
                      >
                        <div className="h-24 rounded-2xl bg-gradient-to-tr from-slate-900/5 via-white to-white p-3 dark:from-emerald-500/20 dark:via-white/5 dark:to-white/0">
                          <div
                            className="h-full w-full rounded-xl bg-slate-900/5 dark:bg-emerald-500/20"
                            style={{ height: `${sector.value}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span className="text-slate-600 dark:text-slate-200">{sector.label}</span>
                          <span className="text-slate-900 dark:text-white">{sector.value}%</span>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            sector.delta >= 0 ? "text-emerald-500" : "text-red-500"
                          )}
                        >
                          {sector.delta >= 0 ? "+" : ""}
                          {sector.delta.toFixed(1)}% vs période précédente
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Alertes prioritaires</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Suivi temps réel</p>
                    </div>
                    <Badge className="rounded-full bg-red-500/20 text-red-500">
                      {alertsPrioritaires.length} actives
                    </Badge>
                  </div>
                  <div className="mt-5 space-y-4">
                    {alertsPrioritaires.map((alert) => {
                      const styles = getSeverityStyles(alert.severity);
                      return (
                        <div
                          key={alert.id}
                          className={cn(
                            "rounded-3xl border bg-white/75 p-4 shadow-sm dark:bg-white/5",
                            styles.accent
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", styles.badge)}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{alert.description}</p>
                          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {alert.province}
                            </span>
                            {alert.action ? (
                              <button
                                type="button"
                                onClick={() => toast.info(alert.action)}
                                className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400"
                              >
                                Détails
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            </TabsContent>

            <TabsContent value="decrets" className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Décrets et documents ministériels</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Pilotage réglementaire et suivi des actes officiels
                  </p>
                </div>
                <Button className="rounded-full bg-emerald-500 px-5 hover:bg-emerald-600">
                  <FileSignature className="mr-2 h-4 w-4" />
                  Nouveau décret
                </Button>
              </div>

              <div className="grid gap-4 xl:grid-cols-[2.2fr_1fr]">
                <GlassCard className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {decretsData.map((decret) => (
                      <button
                        key={decret.id}
                        type="button"
                        onClick={() => setSelectedDecret(decret)}
                        className={cn(
                          "rounded-2xl border bg-white/60 p-4 text-left transition hover:shadow-lg dark:bg-white/5",
                          selectedDecret?.id === decret.id
                            ? "border-emerald-400/60 shadow-[0_15px_30px_rgba(16,185,129,0.18)]"
                            : "border-white/30 dark:border-white/10"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">{decret.reference}</h3>
                          <Badge className={statusStyles[decret.status]}>{decret.status.toUpperCase()}</Badge>
                        </div>
                        <p className="mt-2 text-base font-semibold">{decret.title}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{decret.description}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{new Date(decret.created_date).toLocaleDateString("fr-FR")}</span>
                          <Badge variant="outline" className={priorityStyles[decret.priority]}>
                            {decret.priority}
                          </Badge>
                        </div>
                        <Progress value={decret.progress} className="mt-3 h-2 rounded-full" />
                      </button>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Détails</h3>
                    <Badge className="bg-white/40 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {selectedDecret?.status?.toUpperCase() ?? "—"}
                    </Badge>
                  </div>
                  <div className="mt-6 space-y-4 text-sm text-slate-500 dark:text-slate-400">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Référence</p>
                      <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {selectedDecret?.reference ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Objet</p>
                      <p className="text-base text-slate-600 dark:text-slate-200">{selectedDecret?.title ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Auteur</p>
                      <p>{selectedDecret?.author ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Progression</p>
                      <Progress value={selectedDecret?.progress ?? 0} className="mt-2 h-2 rounded-full" />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => toast.info("Téléchargement du dossier réglementaire")}
                    >
                      Télécharger le dossier complet
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </TabsContent>

            <TabsContent value="objectifs" className="space-y-4">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Objectifs nationaux de santé</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Suivi du Plan National de Développement Sanitaire 2024-2028
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-blue-500/10 text-blue-500">
                      Politiques {(objectifsData || []).filter((o) => o.category === "politique").length}
                    </Badge>
                    <Badge className="rounded-full bg-emerald-500/10 text-emerald-500">
                      Économiques {(objectifsData || []).filter((o) => o.category === "economique").length}
                    </Badge>
                    <Badge className="rounded-full bg-rose-500/10 text-rose-500">
                      Sanitaires {(objectifsData || []).filter((o) => o.category === "sanitaire").length}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
                  {(objectifsData || []).map((objectif) => (
                    <div
                      key={objectif.id}
                      className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-inner transition hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-start justify-between">
                        <Badge className={objectiveCategoryStyles[objectif.category]}>
                          {objectif.category.toUpperCase()}
                        </Badge>
                        <Badge className={objectiveStatusStyles[objectif.status]}>
                          {objectif.status === "en_cours" ? "En cours" : objectif.status === "atteint" ? "Atteint" : "En retard"}
                        </Badge>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">{objectif.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{objectif.description}</p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Actuel</p>
                          <p className="text-base font-semibold">{objectif.current_value}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Cible</p>
                          <p className="text-base font-semibold text-emerald-500">{objectif.target_value}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Progression</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-200">
                            {objectif.progress}%
                          </span>
                        </div>
                        <Progress
                          value={objectif.progress}
                          className={cn(
                            "mt-2 h-2 rounded-full",
                            objectif.status === "en_retard" ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500"
                          )}
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span>
                          Échéance {new Date(objectif.deadline).toLocaleDateString("fr-FR")}
                        </span>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400"
                        >
                          Plan d'action
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="statistiques" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Couverture CNAMGS</h3>
                    <Badge className="bg-emerald-500/15 text-emerald-400">Objectif 95%</Badge>
                  </div>
                  <p className="mt-6 text-4xl font-semibold">78%</p>
                  <Progress value={78} className="mt-4 h-2 rounded-full" />
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    1,8 million de bénéficiaires couverts • +5,2% vs 2024
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Mortalité maternelle</h3>
                    <Badge className="bg-red-500/15 text-red-400">Priorité nationale</Badge>
                  </div>
                  <p className="mt-6 text-4xl font-semibold">316/100k</p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                    <ArrowUpRight className="h-3 w-3" />
                    +5% vs 2024
                  </div>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Accélérer le plan "Maternité sûre" pour atteindre l'objectif &lt;150/100k.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Vaccination infantile</h3>
                    <Badge className="bg-sky-500/15 text-sky-400">Programme PEV</Badge>
                  </div>
                  <p className="mt-6 text-4xl font-semibold">92%</p>
                  <Progress value={92} className="mt-4 h-2 rounded-full [&>div]:bg-sky-400" />
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Objectif 2026: 98% de couverture complète pour les enfants de 0 à 5 ans.
                  </p>
                </GlassCard>
              </div>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold">Recommandations et actions prioritaires</h3>
                <div className="mt-6 space-y-4">
                  {recommandations.map((rec) => (
                    <div
                      key={rec.id}
                      className={cn(
                        "rounded-2xl border bg-white/70 p-4 shadow-sm dark:bg-white/5",
                        rec.tone === "danger"
                          ? "border-red-400/40"
                          : "border-emerald-400/30"
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {rec.tone === "danger" ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Zap className="h-4 w-4 text-emerald-500" />
                        )}
                        {rec.title}
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="structures" className="space-y-4">
              {provincesError && (
                <GlassCard className="border border-red-400/40 bg-red-500/10 p-4 dark:border-red-500/30 dark:bg-red-500/15">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-red-600 dark:text-red-300">{provincesError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshProvinces}
                      disabled={provincesLoading}
                      className="rounded-full"
                    >
                      Réessayer
                    </Button>
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-6">
                {provincesLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`provinces-skeleton-${index}`}
                        className="h-24 rounded-2xl bg-white/60 shadow-inner dark:bg-white/10"
                      >
                        <div className="h-full w-full animate-pulse rounded-2xl bg-white/40 dark:bg-white/5" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Population nationale</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {formatNumber(nationalStats.totalPopulation)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Habitants • {nationalStats.provinces} provinces</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Structures de santé</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{nationalStats.totalStructures}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Établissements actifs</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Couverture moyenne</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{formatPercent(nationalStats.avgCoverage)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Taux national</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Provinces prioritaires</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{nationalStats.highPriorityCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Renforcement requis</p>
                    </div>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cartographies nationales</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Analyses stratégiques du territoire
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={handleRefreshProvinces}
                    disabled={provincesLoading}
                  >
                    <RefreshCw className={cn("h-4 w-4", provincesLoading && "animate-spin")} />
                  </Button>
                </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={activeCartography === "coverage" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold",
                        activeCartography === "coverage" && "bg-blue-500 text-white hover:bg-blue-600"
                      )}
                      onClick={() => setActiveCartography("coverage")}
                    >
                      <Shield className="h-3.5 w-3.5 mr-2" />
                      Couverture Sanitaire
                    </Button>
                    <Button
                      variant={activeCartography === "resources" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold",
                        activeCartography === "resources" && "bg-purple-500 text-white hover:bg-purple-600"
                      )}
                      onClick={() => setActiveCartography("resources")}
                    >
                      <Users className="h-3.5 w-3.5 mr-2" />
                      Ressources Humaines
                    </Button>
                    <Button
                      variant={activeCartography === "infrastructure" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold",
                        activeCartography === "infrastructure" && "bg-emerald-500 text-white hover:bg-emerald-600"
                      )}
                      onClick={() => setActiveCartography("infrastructure")}
                    >
                      <Building2 className="h-3.5 w-3.5 mr-2" />
                      Infrastructures
                    </Button>
                  </div>

                  {activeCartography === "coverage" && (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-blue-500/10 border border-blue-400/30 p-4 dark:bg-blue-500/10 dark:border-blue-400/20">
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                          Objectif CSU : Couverture Sanitaire Universelle
                        </p>
                        <p className="text-xs text-blue-600/80 dark:text-blue-300/80">
                          Suivi du taux de couverture CNAMGS/CNSS par province. Objectif national : 95% d'ici 2028.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            &gt;80% Bonne couverture
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-amber-700 dark:text-amber-300">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            60-80% Moyenne
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-red-700 dark:text-red-300">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            &lt;60% Critique
                          </span>
                        </div>
                      </div>
                      <div className="h-[500px] overflow-hidden rounded-3xl border border-blue-400/30 bg-blue-500/5 dark:border-blue-400/20">
                        <CoverageCartography 
                          provincesData={provincesData}
                          selectedProvince={selectedProvince}
                          onSelectProvince={setSelectedProvince}
                        />
                      </div>
                    </div>
                  )}

                  {activeCartography === "resources" && (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-purple-500/10 border border-purple-400/30 p-4 dark:bg-purple-500/10 dark:border-purple-400/20">
                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                          Objectif Ressources Humaines : Ratio Médecins/Population
                        </p>
                        <p className="text-xs text-purple-600/80 dark:text-purple-300/80">
                          Répartition du personnel de santé par province. Objectif : 1,5 médecin pour 1000 habitants.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            &gt;1.2/1000 Bon ratio
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-amber-700 dark:text-amber-300">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            0.8-1.2 Moyen
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-red-700 dark:text-red-300">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            &lt;0.8 Déficit
                          </span>
                        </div>
                      </div>
                      <div className="h-[500px] overflow-hidden rounded-3xl border border-purple-400/30 bg-purple-500/5 dark:border-purple-400/20">
                        <ResourcesCartography 
                          provincesData={provincesData}
                          selectedProvince={selectedProvince}
                          onSelectProvince={setSelectedProvince}
                        />
                      </div>
                    </div>
                  )}

                  {activeCartography === "infrastructure" && (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/30 p-4 dark:bg-emerald-500/10 dark:border-emerald-400/20">
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                          Objectif Infrastructures : Plateaux Techniques Modernes
                        </p>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80">
                          Disponibilité des équipements et infrastructures par province. Focus : CHU, CHR, imagerie, laboratoires.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            CHU/CHR Complet
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-amber-700 dark:text-amber-300">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Équipement partiel
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-red-700 dark:text-red-300">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Infrastructure limitée
                          </span>
                        </div>
                      </div>
                      <div className="h-[500px] overflow-hidden rounded-3xl border border-emerald-400/30 bg-emerald-500/5 dark:border-emerald-400/20">
                        <HealthProvidersMap />
                      </div>
                    </div>
                  )}
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex flex-col gap-4 mb-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {activeCartography === "coverage" && "Analyse de couverture"}
                        {activeCartography === "resources" && "Analyse du personnel"}
                        {activeCartography === "infrastructure" && "Analyse des infrastructures"}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {sortedAndFilteredProvinces.length} province(s) • Tri intelligent selon contexte
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={sortProvinceBy === "priority" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs",
                          sortProvinceBy === "priority" && "bg-emerald-500 text-white hover:bg-emerald-600"
                        )}
                        onClick={() => setSortProvinceBy("priority")}
                      >
                        Priorité
                      </Button>
                      <Button
                        variant={sortProvinceBy === "coverage" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs",
                          sortProvinceBy === "coverage" && 
                            (activeCartography === "coverage" ? "bg-blue-500 hover:bg-blue-600" :
                             activeCartography === "resources" ? "bg-purple-500 hover:bg-purple-600" :
                             "bg-emerald-500 hover:bg-emerald-600") + " text-white"
                        )}
                        onClick={() => setSortProvinceBy("coverage")}
                      >
                        {activeCartography === "coverage" && "Couverture"}
                        {activeCartography === "resources" && "Ratio"}
                        {activeCartography === "infrastructure" && "Structures"}
                      </Button>
                      <Button
                        variant={sortProvinceBy === "name" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs",
                          sortProvinceBy === "name" && "bg-slate-600 text-white hover:bg-slate-700 dark:bg-slate-500"
                        )}
                        onClick={() => setSortProvinceBy("name")}
                      >
                        A-Z
                      </Button>
                    </div>
                  </div>
                  <Input
                    value={provinceSearch}
                    onChange={(e) => setProvinceSearch(e.target.value)}
                    placeholder={
                      activeCartography === "coverage" ? "Rechercher par province ou besoin..." :
                      activeCartography === "resources" ? "Rechercher province ou besoin en personnel..." :
                      "Rechercher province ou besoin en infrastructure..."
                    }
                    className="h-10 rounded-full bg-white/80 text-sm dark:bg-white/10"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {provincesLoading && (
                      <>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={`province-skeleton-${index}`}
                            className="h-20 animate-pulse rounded-3xl bg-white/60 dark:bg-white/10"
                          />
                        ))}
                      </>
                    )}

                    {!provincesLoading && !sortedAndFilteredProvinces.length && (
                      <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-white/5 dark:text-slate-400">
                        Aucune province ne correspond à votre recherche.
                      </div>
                    )}

                    {!provincesLoading && sortedAndFilteredProvinces.map((province) => {
                      const isActive = selectedProvince?.id === province.id;
                      const priorityColors = {
                        haute: "border-red-400/50 bg-red-500/5",
                        moyenne: "border-amber-400/50 bg-amber-500/5",
                        basse: "border-emerald-400/50 bg-emerald-500/5",
                      };

                      return (
                        <div
                          key={province.id}
                          className={cn(
                            "rounded-2xl border p-2.5 transition hover:shadow-md",
                            isActive
                              ? "border-emerald-400/60 bg-emerald-500/10 shadow-[0_8px_16px_rgba(16,185,129,0.12)] dark:border-emerald-400/40"
                              : "border-white/40 bg-white/70 dark:border-white/10 dark:bg-white/5",
                            priorityColors[province.priority]
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{province.province}</h4>
                              <Badge
                                className={cn(
                                  "rounded-full text-[9px] px-1.5 py-0.5",
                                  province.priority === "haute" && "bg-red-500/15 text-red-500",
                                  province.priority === "moyenne" && "bg-amber-500/15 text-amber-500",
                                  province.priority === "basse" && "bg-emerald-500/15 text-emerald-500"
                                )}
                              >
                                {province.priority.charAt(0).toUpperCase()}
                              </Badge>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 rounded-full px-2 text-[10px] hover:bg-emerald-500/10 hover:text-emerald-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProvinceDetailModal(province);
                                  }}
                                >
                                  Détails
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3">
                                    <span>Province {province.province}</span>
                                    <Badge
                                      className={cn(
                                        province.priority === "haute" && "bg-red-500/15 text-red-500",
                                        province.priority === "moyenne" && "bg-amber-500/15 text-amber-500",
                                        province.priority === "basse" && "bg-emerald-500/15 text-emerald-500"
                                      )}
                                    >
                                      Priorité {province.priority}
                                    </Badge>
                                  </DialogTitle>
                                  <DialogDescription>
                                    Analyse détaillée de la province - Population : {formatNumber(province.population)} habitants
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6 mt-4">
                                  {activeCartography === "coverage" && (
                                    <>
                                      <div className="rounded-xl bg-blue-500/10 p-4">
                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                                          Couverture Sanitaire
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Taux de couverture</p>
                                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatPercent(province.coverageRate)}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Personnes couvertes</p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                              {formatNumber(Math.round((province.population * province.coverageRate) / 100))}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Population totale</p>
                                            <p className="text-lg font-semibold">{formatNumber(province.population)}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Structures santé</p>
                                            <p className="text-lg font-semibold">{province.structuresCount}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Délai moyen RDV</p>
                                            <p className="text-lg font-semibold">{province.avgWaitTime}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Satisfaction patients</p>
                                            <p className="text-lg font-semibold">{province.satisfaction}/5</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Taux d'occupation</p>
                                            <p className="text-lg font-semibold">{formatPercent(province.occupancyRate)}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold mb-3">Besoins identifiés</p>
                                        <div className="flex flex-wrap gap-2">
                                          {province.needs.map((need) => (
                                            <span
                                              key={need}
                                              className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400"
                                            >
                                              {need}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {activeCartography === "resources" && (
                                    <>
                                      <div className="rounded-xl bg-purple-500/10 p-4">
                                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                                          Ressources Humaines en Santé
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Ratio médecins/population</p>
                                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                              {((province.doctors / province.population) * 1000).toFixed(2)}/1000
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Objectif national</p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">1.5/1000</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Médecins</p>
                                            <p className="text-lg font-semibold">{formatNumber(province.doctors)}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Infirmiers</p>
                                            <p className="text-lg font-semibold">{formatNumber(province.nurses)}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Personnel total</p>
                                            <p className="text-lg font-semibold">{formatNumber(province.totalStaff)}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Ratio infirmiers</p>
                                            <p className="text-lg font-semibold">
                                              {((province.nurses / province.population) * 1000).toFixed(2)}/1000
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold mb-3">Besoins en personnel identifiés</p>
                                        <div className="flex flex-wrap gap-2">
                                          {province.needs.filter(n => 
                                            n.toLowerCase().includes("personnel") || 
                                            n.toLowerCase().includes("médecin") || 
                                            n.toLowerCase().includes("infirmier") ||
                                            n.toLowerCase().includes("formation")
                                          ).map((need) => (
                                            <span
                                              key={need}
                                              className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400"
                                            >
                                              {need}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {activeCartography === "infrastructure" && (
                                    <>
                                      <div className="rounded-xl bg-emerald-500/10 p-4">
                                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                                          Infrastructures et Équipements
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Hôpitaux (CHU/CHR)</p>
                                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{province.hospitals}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Centres de santé</p>
                                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{province.healthCenters}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Pharmacies</p>
                                            <p className="text-lg font-semibold">{province.pharmacies}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Laboratoires</p>
                                            <p className="text-lg font-semibold">{province.laboratories}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Total structures</p>
                                            <p className="text-lg font-semibold">{province.structuresCount}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-500 dark:text-slate-400">Taux d'occupation</p>
                                            <p className="text-lg font-semibold">{formatPercent(province.occupancyRate)}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold mb-3">Besoins en infrastructure identifiés</p>
                                        <div className="flex flex-wrap gap-2">
                                          {province.needs.filter(n => 
                                            n.toLowerCase().includes("infrastructure") || 
                                            n.toLowerCase().includes("équipement") || 
                                            n.toLowerCase().includes("hôpital") ||
                                            n.toLowerCase().includes("ambulance") ||
                                            n.toLowerCase().includes("centre") ||
                                            n.toLowerCase().includes("laboratoire")
                                          ).map((need) => (
                                            <span
                                              key={need}
                                              className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                                            >
                                              {need}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div onClick={() => setSelectedProvince(province)} className="cursor-pointer">
                            <div className="flex items-center justify-between text-[11px]">
                              {activeCartography === "coverage" && (
                                <>
                                  <div className="text-slate-600 dark:text-slate-300">
                                    <span className="text-slate-400">Couverture:</span>
                                    <span className="ml-1 font-semibold">{formatPercent(province.coverageRate)}</span>
                                  </div>
                                  <div className="text-slate-600 dark:text-slate-300">
                                    <span className="text-slate-400">Pop:</span>
                                    <span className="ml-1 font-semibold">{formatNumber(province.population)}</span>
                                  </div>
                                </>
                              )}
                              {activeCartography === "resources" && (
                                <>
                                  <div className="text-slate-600 dark:text-slate-300">
                                    <span className="text-slate-400">Médecins:</span>
                                    <span className="ml-1 font-semibold">{formatNumber(province.doctors)}</span>
                                  </div>
                                  <div className="text-slate-600 dark:text-slate-300">
                                    <span className="text-slate-400">Ratio:</span>
                                    <span className="ml-1 font-semibold">{((province.doctors / province.population) * 1000).toFixed(1)}/1k</span>
                                  </div>
                                </>
                              )}
                              {activeCartography === "infrastructure" && (
                                <>
                                  <div className="text-slate-600 dark:text-slate-300">
                                    <span className="text-slate-400">CHU/CHR:</span>
                                    <span className="ml-1 font-semibold">{province.hospitals}</span>
                                  </div>
                                  <div className="text-slate-600 dark:text-slate-300">
                                    <span className="text-slate-400">Total:</span>
                                    <span className="ml-1 font-semibold">{province.structuresCount}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="conseil" className="space-y-4">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Conseil de Ministres</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ordre du jour, décisions et suivi des réunions gouvernementales
                    </p>
                  </div>
                  <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600">
                    <Clock className="mr-2 h-4 w-4" />
                    Nouvelle réunion
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Prochaines réunions</h3>
                    {[
                      { date: "8 novembre 2025", sujet: "Budget santé 2026", status: "planifiée" },
                      { date: "15 novembre 2025", sujet: "Plan national vaccination", status: "planifiée" },
                    ].map((reunion, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{reunion.sujet}</h4>
                          <Badge className="bg-blue-500/15 text-blue-500">{reunion.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="inline h-3.5 w-3.5 mr-1" />
                          {reunion.date}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Décisions récentes</h3>
                    {[
                      { titre: "Renforcement CHR Franceville", date: "28 oct 2025", statut: "approuvée" },
                      { titre: "Campagne vaccination infantile", date: "25 oct 2025", statut: "approuvée" },
                    ].map((decision, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{decision.titre}</h4>
                          <CheckSquare className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{decision.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="connaissance" className="space-y-4">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Base de Connaissance</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Documentation, lois, décrets et ressources pour iAsted
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher dans la base..."
                      className="h-10 w-64 rounded-full"
                    />
                    <Button variant="outline" className="rounded-full">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { 
                      titre: "Lois et Réglements", 
                      icon: ScrollText, 
                      count: 42, 
                      color: "blue",
                      items: ["Loi 12/95 Politique Santé", "Décret 0292/PR/MS Attributions", "Code Santé Publique"]
                    },
                    { 
                      titre: "PNDS 2024-2028", 
                      icon: Target, 
                      count: 8, 
                      color: "emerald",
                      items: ["Axes stratégiques", "Objectifs CSU", "Plan d'action"]
                    },
                    { 
                      titre: "Rapports & Études", 
                      icon: FileText, 
                      count: 156, 
                      color: "purple",
                      items: ["Bulletins épidémio", "Rapports annuels", "Études OMS"]
                    },
                  ].map((categorie, idx) => {
                    const Icon = categorie.icon;
                    return (
                      <GlassCard key={idx} className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn(
                            "rounded-2xl p-3",
                            categorie.color === "blue" && "bg-blue-500/15 text-blue-500",
                            categorie.color === "emerald" && "bg-emerald-500/15 text-emerald-500",
                            categorie.color === "purple" && "bg-purple-500/15 text-purple-500"
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <Badge className="bg-white/70 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                            {categorie.count} docs
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-3">{categorie.titre}</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          {categorie.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Folder className="h-3.5 w-3.5 text-slate-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="w-full mt-4 rounded-full">
                          Explorer
                        </Button>
                      </GlassCard>
                    );
                  })}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="iasted" className="space-y-4">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">iAsted - Assistant Ministériel IA</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Chat, voice, génération de documents et recommandations intelligentes
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA Multimodale
                  </Badge>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                  <div className="space-y-4">
                    {/* Bouton iAsted animé spectaculaire */}
                    <div className="flex items-center justify-center py-4">
                      <IAstedButton onClick={() => {
                        setChatInput("Bonjour iAsted, donne-moi un aperçu de la situation sanitaire nationale");
                        setTimeout(handleSendMessage, 100);
                      }} />
                    </div>

                    <h3 className="text-sm font-semibold text-center">Actions rapides</h3>
                    <div className="grid gap-3">
                      <Button
                        onClick={() => handleGeneratePDF("Rapport mensuel")}
                        className="justify-start rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Générer rapport PDF
                      </Button>
                      <Button
                        onClick={() => handleGeneratePDF("Décret ministériel")}
                        className="justify-start rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      >
                        <FileSignature className="mr-2 h-4 w-4" />
                        Rédiger décret PDF
                      </Button>
                      <Button
                        onClick={handleVoiceCommand}
                        className={`justify-start rounded-xl ${
                          isRecording 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
                            : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="mr-2 h-4 w-4" />
                            Arrêter (enregistrement...)
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Commande vocale
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setChatInput("Analyse les provinces prioritaires et donne-moi des recommandations");
                          setTimeout(handleSendMessage, 100);
                        }}
                        className="justify-start rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Recommandations IA
                      </Button>
                    </div>
                  </div>

                  <GlassCard className="p-4 h-[600px] flex flex-col bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 dark:from-emerald-900/20 dark:via-slate-900 dark:to-emerald-900/10">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">iAsted Assistant</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">En ligne • Prêt à vous assister</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                      {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Bot className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Bonjour Monsieur le Ministre,<br />
                            Je suis iAsted, votre assistant IA personnel.<br />
                            Comment puis-je vous aider aujourd'hui ?
                          </p>
                        </div>
                      )}

                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={cn(
                          "flex gap-3",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}>
                          {msg.role === "assistant" && (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                              <Bot className="h-4 w-4" />
                            </div>
                          )}
                          <div className={cn(
                            "rounded-2xl px-4 py-3 max-w-[80%] text-sm",
                            msg.role === "user"
                              ? "bg-emerald-500 text-white"
                              : "bg-white/70 text-slate-900 dark:bg-white/10 dark:text-slate-100"
                          )}>
                            <p className="whitespace-pre-line">{msg.content}</p>
                          </div>
                        </div>
                      ))}

                      {isAITyping && (
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="rounded-2xl bg-white/70 px-4 py-3 dark:bg-white/10">
                            <div className="flex gap-1">
                              <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: "0ms"}} />
                              <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: "150ms"}} />
                              <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: "300ms"}} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Posez une question à iAsted..."
                        className="rounded-full bg-white/80 dark:bg-white/10"
                        disabled={isRecording}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || isAITyping || isRecording}
                        className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      {chatMessages.length > 0 && (
                        <Button
                          onClick={() => {
                            const lastAssistant = [...chatMessages].reverse().find(m => m.role === 'assistant');
                            if (lastAssistant && TTSService.isSupported()) {
                              TTSService.speak(lastAssistant.content);
                              toast.success("🔊 Lecture de la réponse");
                            } else {
                              toast.error("Aucune réponse à lire");
                            }
                          }}
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          title="Lire la dernière réponse"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="connaissance" className="space-y-4">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Base de Connaissance</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Documentation, lois, décrets et ressources pour iAsted
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher dans la base..."
                      className="h-10 w-64 rounded-full"
                    />
                    <Button variant="outline" className="rounded-full">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { 
                      titre: "Lois et Réglements", 
                      icon: ScrollText, 
                      count: 42, 
                      color: "blue",
                      items: ["Loi 12/95 Politique Santé", "Décret 0292/PR/MS Attributions", "Code Santé Publique"]
                    },
                    { 
                      titre: "PNDS 2024-2028", 
                      icon: Target, 
                      count: 8, 
                      color: "emerald",
                      items: ["Axes stratégiques", "Objectifs CSU", "Plan d'action"]
                    },
                    { 
                      titre: "Rapports & Études", 
                      icon: FileText, 
                      count: 156, 
                      color: "purple",
                      items: ["Bulletins épidémio", "Rapports annuels", "Études OMS"]
                    },
                  ].map((categorie, idx) => {
                    const Icon = categorie.icon;
                    return (
                      <GlassCard key={idx} className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn(
                            "rounded-2xl p-3",
                            categorie.color === "blue" && "bg-blue-500/15 text-blue-500",
                            categorie.color === "emerald" && "bg-emerald-500/15 text-emerald-500",
                            categorie.color === "purple" && "bg-purple-500/15 text-purple-500"
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <Badge className="bg-white/70 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                            {categorie.count} docs
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-3">{categorie.titre}</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          {categorie.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Folder className="h-3.5 w-3.5 text-slate-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="w-full mt-4 rounded-full">
                          Explorer
                        </Button>
                      </GlassCard>
                    );
                  })}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="rapports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[0.55fr_1.45fr] xl:grid-cols-[0.45fr_1.55fr]">
                <GlassCard className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                    <Shield className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      République Gabonaise
                    </p>
                    <p className="text-sm font-semibold">Ministère de la Santé</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 dark:bg-white/10">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Bibliothèque officielle
                  </div>
                </GlassCard>

                <GlassCard className="flex h-full flex-col justify-between gap-6 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">Rapports et publications officielles</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Bibliothèque documentaire en cours d'intégration (Bulletins, rapports annuels, indicateurs OMS)
                      </p>
                    </div>
                    <Badge className="bg-blue-500/15 text-blue-500">Bêta Q1 2026</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="rounded-full">
                      Télécharger le rapport mensuel
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      Accéder aux bulletins épidémiologiques
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MinisterDashboard;
