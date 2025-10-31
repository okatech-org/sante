# 🎯 PROMPT CURSOR COMPLET - MENUS HIÉRARCHIQUES MULTI-RÔLES

**Projet** : SANTE.GA - Espace Professionnel Multi-Établissements  
**Objectif** : Implémenter une architecture de menus hiérarchiques avec rôles multiples  
**Utilisateur Test** : Dr. Jules DJEKI (Directeur + Médecin au CMST SOGARA)  

---

## 📋 VUE D'ENSEMBLE TECHNIQUE

### Architecture Actuelle Analysée
- **Frontend** : React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui  
- **Backend** : Supabase (PostgreSQL + Auth + RLS)  
- **Contextes** : AuthContext, MultiEstablishmentContext, SogaraAuthContext  
- **Base de données** : Tables `establishment_staff`, `professionals`, `establishments`  
- **Types** : Permission, ProfessionalRole, ProfessionalContext définis  

---

## 🎯 OBJECTIF FINAL

Créer une interface sidebar + zone principale où :
1. **Sidebar gauche** : Liste hiérarchique établissements → rôles
2. **Sélection de rôle** : Clic direct sur rôle dans sidebar
3. **Menu contextuel** : Accordéon différent selon rôle (5 sections DIRECTEUR, 4 sections MÉDECIN)
4. **Changement instantané** : Switch entre rôles sans rechargement

---

## 📁 ÉTAPE 1 : BASE DE DONNÉES MULTI-RÔLES

### Migration SQL Dr. Jules DJEKI
```sql
-- supabase/migrations/dr_djeki_multi_roles.sql

-- 1. Vérifier/Créer professionnel Dr. DJEKI
INSERT INTO public.professionals (
  user_id, 
  full_name, 
  email, 
  phone, 
  professional_type, 
  numero_ordre, 
  profession_type, 
  specialization, 
  verified, 
  status
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'directeur.sogara@sante.ga'),
  'Dr. Jules DJEKI',
  'directeur.sogara@sante.ga',
  '+241 07 XX XX XX',
  'medecin_generaliste',
  'DIR-001',
  'doctor',
  'Médecine Générale',
  true,
  'actif'
) ON CONFLICT (user_id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  numero_ordre = EXCLUDED.numero_ordre;

-- 2. Ajouter RÔLE 1 : Directeur 
INSERT INTO public.establishment_staff (
  establishment_id,
  professional_id,
  role_in_establishment,
  department,
  job_position,
  matricule,
  is_admin,
  is_department_head,
  permissions,
  status,
  start_date
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- CMST SOGARA ID
  (SELECT id FROM public.professionals WHERE email = 'directeur.sogara@sante.ga'),
  'director',
  'Direction Médicale',
  'Directeur Médical',
  'DIR-001',
  true,
  true,
  ARRAY['all']::text[],
  'active',
  '2024-01-01'
) ON CONFLICT DO NOTHING;

-- 3. Ajouter RÔLE 2 : Médecin
INSERT INTO public.establishment_staff (
  establishment_id,
  professional_id,
  role_in_establishment,
  department,
  job_position,
  matricule,
  is_admin,
  is_department_head,
  permissions,
  status,
  start_date
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- CMST SOGARA ID
  (SELECT id FROM public.professionals WHERE email = 'directeur.sogara@sante.ga'),
  'doctor',
  'Médecine Générale',
  'Médecin Généraliste',
  'MED-001',
  false,
  false,
  ARRAY['consultation', 'prescription', 'view_dmp', 'edit_dmp']::text[],
  'active',
  '2024-01-01'
) ON CONFLICT DO NOTHING;

-- 4. Fonction RPC pour récupérer les rôles multiples
CREATE OR REPLACE FUNCTION public.get_user_roles_for_establishment(_user_id uuid, _establishment_id uuid)
RETURNS TABLE (
  staff_id uuid,
  role_in_establishment text,
  department text,
  job_position text,
  permissions text[],
  is_admin boolean
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    es.id,
    es.role_in_establishment,
    es.department,
    es.job_position,
    es.permissions,
    es.is_admin
  FROM public.professionals p
  INNER JOIN public.establishment_staff es ON es.professional_id = p.id
  WHERE p.user_id = _user_id
    AND es.establishment_id = _establishment_id
    AND es.status = 'active'
  ORDER BY es.is_admin DESC;
$$;
```

---

## 📁 ÉTAPE 2 : CONFIGURATION DES MENUS

### Fichier `src/config/menuDefinitions.ts` (COMPLET)
```typescript
import { 
  BarChart3, Calendar, Users, FileText, Stethoscope, 
  Shield, Building2, DollarSign, Package, MessageSquare,
  Settings, Activity, UserCog, ClipboardList, Briefcase
} from 'lucide-react';

export interface MenuItem {
  label: string;
  href: string;
  icon: any;
  badge?: number | string;
  permission?: string;
  description?: string;
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

// ============= MENU DIRECTEUR (5 sections) =============
export const DIRECTOR_MENU: MenuSection[] = [
  {
    id: 'general',
    label: 'GÉNÉRAL',
    items: [
      { label: "Vue d'ensemble", href: '/professional/dashboard', icon: BarChart3 },
      { label: 'Statistiques', href: '/professional/statistics', icon: BarChart3 }
    ]
  },
  {
    id: 'medical-activity', 
    label: 'ACTIVITÉ MÉDICALE',
    items: [
      { label: 'Rendez-vous', href: '/professional/appointments', icon: Calendar, badge: 8 },
      { label: 'Consultations', href: '/professional/consultations', icon: Stethoscope },
      { label: 'Prescriptions', href: '/professional/prescriptions', icon: FileText },
      { label: 'Mes Patients', href: '/professional/patients', icon: Users }
    ]
  },
  {
    id: 'medical-direction',
    label: 'DIRECTION MÉDICALE', 
    items: [
      { label: 'Hospitalisation', href: '/professional/hospitalization', icon: Building2 },
      { label: 'Plateaux Techniques', href: '/professional/technical', icon: Activity }
    ]
  },
  {
    id: 'administration',
    label: 'ADMINISTRATION',
    items: [
      { label: 'Personnel', href: '/professional/staff', icon: UserCog, permission: 'manage_staff' },
      { label: 'Facturation', href: '/professional/billing', icon: DollarSign, permission: 'manage_billing' },
      { label: 'Inventaire', href: '/professional/inventory', icon: Package },
      { label: 'Rapports', href: '/professional/reports', icon: FileText }
    ]
  },
  {
    id: 'communication',
    label: 'COMMUNICATION',
    items: [
      { label: 'Messages', href: '/professional/messages', icon: MessageSquare, badge: 3 }
    ]
  }
];

// ============= MENU MÉDECIN (4 sections) =============
export const DOCTOR_MENU: MenuSection[] = [
  {
    id: 'general',
    label: 'GÉNÉRAL',
    items: [
      { label: "Vue d'ensemble", href: '/professional/dashboard', icon: BarChart3 }
    ]
  },
  {
    id: 'medical-activity',
    label: 'ACTIVITÉ MÉDICALE', 
    items: [
      { label: 'Rendez-vous', href: '/professional/appointments', icon: Calendar, badge: 'Nouveau' },
      { label: 'Consultations', href: '/professional/consultations', icon: Stethoscope },
      { label: 'Prescriptions', href: '/professional/prescriptions', icon: FileText },
      { label: 'Mes Patients', href: '/professional/patients', icon: Users }
    ]
  },
  {
    id: 'medical-direction',
    label: 'DIRECTION MÉDICALE',
    items: [
      { label: 'Hospitalisation', href: '/professional/hospitalization', icon: Building2 },
      { label: 'Plateaux Techniques', href: '/professional/technical', icon: Activity }
    ]
  },
  {
    id: 'communication',
    label: 'COMMUNICATION',
    items: [
      { label: 'Messages', href: '/professional/messages', icon: MessageSquare, badge: 3 }
    ]
  }
];

export const ROLE_LABELS: Record<string, string> = {
  'director': 'DIRECTEUR',
  'admin': 'ADMIN', 
  'doctor': 'MÉDECIN',
  'nurse': 'INFIRMIER(E)',
  'pharmacist': 'PHARMACIEN(NE)'
};

export const getMenuForRole = (role: string): MenuSection[] => {
  switch (role) {
    case 'director':
      return DIRECTOR_MENU;
    case 'doctor':
      return DOCTOR_MENU;
    case 'admin':
      return DIRECTOR_MENU; // Admin = même accès que directeur
    default:
      return DOCTOR_MENU;
  }
};
```

---

## 📁 ÉTAPE 3 : CONTEXTE MULTI-RÔLES

### Extension `src/contexts/MultiEstablishmentContext.tsx`
```typescript
// Ajouter ces types au début du fichier
interface MultiEstablishmentContextType {
  // ... états existants
  availableRoles: string[];     // NOUVEAU
  currentRole: string | null;   // NOUVEAU
  
  // ... actions existantes  
  switchRole: (role: string) => Promise<void>;  // NOUVEAU
  loadRolesForEstablishment: (establishmentId: string) => Promise<void>; // NOUVEAU
}

// Dans le provider, ajouter ces états
const [currentRole, setCurrentRole] = useState<string | null>(null);
const [availableRoles, setAvailableRoles] = useState<string[]>([]);

// Nouvelle fonction pour charger les rôles d'un établissement
const loadRolesForEstablishment = useCallback(async (establishmentId: string) => {
  if (!user?.id) return;

  try {
    const { data, error } = await supabase.rpc('get_user_roles_for_establishment', {
      _user_id: user.id,
      _establishment_id: establishmentId
    });

    if (error) throw error;

    const roles = data?.map((r: any) => r.role_in_establishment) || [];
    setAvailableRoles(roles);

    // Charger le rôle sauvé ou prendre le premier (priorité admin)
    const savedRole = localStorage.getItem(`current_role_${establishmentId}`);
    const adminRole = roles.find(r => r === 'director' || r === 'admin');
    const initialRole = savedRole && roles.includes(savedRole) 
      ? savedRole 
      : adminRole || roles[0];
    
    setCurrentRole(initialRole);
    localStorage.setItem(`current_role_${establishmentId}`, initialRole);

    console.log(`✅ Rôles chargés pour ${establishmentId}:`, roles);
    console.log(`✅ Rôle initial: ${initialRole}`);

  } catch (error) {
    console.error('Erreur chargement rôles:', error);
    toast.error('Impossible de charger les rôles');
  }
}, [user?.id]);

// Nouvelle fonction pour changer de rôle
const switchRole = useCallback(async (newRole: string) => {
  if (!currentEstablishment?.establishment_id) return;

  setCurrentRole(newRole);
  localStorage.setItem(`current_role_${currentEstablishment.establishment_id}`, newRole);
  
  toast.success(`Basculé vers ${ROLE_LABELS[newRole] || newRole}`, {
    description: 'Votre menu a été mis à jour'
  });

  console.log(`✅ Rôle changé vers: ${newRole}`);
}, [currentEstablishment?.establishment_id]);

// Mettre à jour la fonction selectEstablishment pour charger les rôles
const selectEstablishment = useCallback(async (staffRoleId: string, role?: string) => {
  const selectedEstablishment = establishments.find(e => e.staff_id === staffRoleId);
  
  if (!selectedEstablishment) {
    toast.error('Établissement non trouvé');
    return;
  }

  await loadEstablishmentContext(selectedEstablishment.establishment_id);
  await loadRolesForEstablishment(selectedEstablishment.establishment_id); // NOUVEAU
  
}, [establishments, loadEstablishmentContext, loadRolesForEstablishment]);
```

---

## 📁 ÉTAPE 4 : LAYOUT SIDEBAR HIÉRARCHIQUE

### Remplacer `src/components/layout/ProfessionalEstablishmentLayout.tsx`
```typescript
import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { getMenuForRole, ROLE_LABELS, type MenuSection } from '@/config/menuDefinitions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Shield, Stethoscope, ChevronRight, LogOut
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProfessionalEstablishmentLayoutProps {
  children: ReactNode;
}

export function ProfessionalEstablishmentLayout({ children }: ProfessionalEstablishmentLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    establishments,
    currentEstablishment,
    currentRole,
    availableRoles,
    switchRole,
    hasPermission
  } = useMultiEstablishment();

  // Récupérer le menu selon le rôle actuel
  const menuSections: MenuSection[] = getMenuForRole(currentRole || 'doctor');

  const fullName = user?.user_metadata?.full_name || 'Professionnel';

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'director':
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      default:
        return Building2;
    }
  };

  const handleRoleChange = async (newRole: string) => {
    await switchRole(newRole);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/login/professional');
  };

  // Grouper établissements par ID pour afficher rôles multiples
  const establishmentGroups = establishments.reduce((acc, est) => {
    const key = est.establishment_id;
    if (!acc[key]) {
      acc[key] = {
        id: est.establishment_id,
        name: est.establishment_name,
        type: est.establishment_type,
        roles: []
      };
    }
    acc[key].roles.push({
      role: est.role_in_establishment,
      staffId: est.staff_id,
      isAdmin: est.is_admin
    });
    return acc;
  }, {} as Record<string, any>);

  const establishmentsList = Object.values(establishmentGroups);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar gauche - Architecture hiérarchique */}
      <aside className="w-72 bg-card border-r border-border flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">SANTE.GA</h2>
              <p className="text-xs text-muted-foreground">Espace Professionnel</p>
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-sm">
                {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground">Professionnel de santé</p>
            </div>
          </div>
        </div>

        {/* Navigation hiérarchique */}
        <div className="flex-1 overflow-y-auto">
          {/* Tableau de bord */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Tableau de bord
            </h3>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/professional/dashboard')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Vue d'ensemble
            </Button>
          </div>

          {/* Établissements avec rôles hiérarchiques */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Établissements
            </h3>
            
            {establishmentsList.map((establishment) => (
              <div key={establishment.id} className="mb-4">
                {/* Nom établissement */}
                <div className="px-3 py-2 text-sm font-medium text-foreground">
                  {establishment.name}
                </div>

                {/* Rôles dans cet établissement */}
                <div className="ml-2 space-y-1">
                  {establishment.roles.map((roleData: any) => {
                    const RoleIcon = getRoleIcon(roleData.role);
                    const isSelected = 
                      currentEstablishment?.establishment_id === establishment.id && 
                      currentRole === roleData.role;

                    return (
                      <button
                        key={`${establishment.id}-${roleData.role}`}
                        onClick={() => handleRoleChange(roleData.role)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <RoleIcon className="h-4 w-4" />
                        <span className="flex-1 text-left uppercase">
                          {ROLE_LABELS[roleData.role] || roleData.role}
                        </span>
                        {isSelected && <ChevronRight className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Placeholders */}
            <Button variant="ghost" className="w-full justify-start opacity-50" disabled>
              <Building2 className="h-4 w-4 mr-2" />
              Etablissement 2
            </Button>
            <Button variant="ghost" className="w-full justify-start opacity-50" disabled>
              <Building2 className="h-4 w-4 mr-2" />
              Etablissement X
            </Button>
          </div>

          {/* Paramètres */}
          <div className="p-4 border-t border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Paramètres
            </h3>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/professional/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Footer avec déconnexion */}
        <div className="p-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Zone principale avec menu accordéon */}
      <div className="flex-1 flex">
        {/* Menu accordéon contextuel */}
        {currentRole && (
          <aside className="w-64 bg-card border-r border-border">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Badge variant="default">{ROLE_LABELS[currentRole]}</Badge>
                <span className="text-sm text-muted-foreground">Menu</span>
              </div>
            </div>

            <nav className="p-4">
              <Accordion 
                type="multiple" 
                defaultValue={menuSections.map(s => s.id)} 
                className="space-y-2"
              >
                {menuSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id} className="border-none">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50 rounded-lg">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        {section.label}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 mt-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.href;
                          
                          // Vérifier permission
                          if (item.permission && !hasPermission(item.permission)) {
                            return null;
                          }
                          
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </nav>
          </aside>
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 📁 ÉTAPE 5 : PAGE HUB UNIFIÉE

### Créer `src/pages/professional/ProfessionalHub.tsx`
```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';

export default function ProfessionalHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    establishments,
    currentEstablishment,
    currentRole,
    isLoading,
    selectEstablishment
  } = useMultiEstablishment();

  useEffect(() => {
    if (!user) {
      navigate('/login/professional');
      return;
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si rôle sélectionné → Dashboard avec menu
  if (currentRole && currentEstablishment) {
    return (
      <ProfessionalEstablishmentLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              {currentEstablishment.establishment?.name} - {ROLE_LABELS[currentRole]}
            </p>
          </div>
          {/* Statistiques et contenu dashboard */}
        </div>
      </ProfessionalEstablishmentLayout>
    );
  }

  // Sinon → Interface de sélection
  const fullName = user?.user_metadata?.full_name || 'Professionnel';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar sélection */}
      <aside className="w-72 bg-white border-r flex flex-col shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Sélection Contexte</h2>
          <p className="text-sm text-muted-foreground">Choisissez votre rôle</p>
        </div>

        <div className="flex-1 p-4">
          <h3 className="text-xs uppercase font-semibold text-muted-foreground mb-2">
            Établissements
          </h3>
          
          {/* CMST SOGARA avec rôles multiples */}
          <div className="space-y-2">
            <div className="text-sm font-medium">CMST SOGARA</div>
            <div className="ml-4 space-y-1">
              <button
                onClick={() => selectEstablishment('staff-id', 'director')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Shield className="h-4 w-4" />
                <span className="uppercase">ADMIN</span>
              </button>
              <button
                onClick={() => selectEstablishment('staff-id', 'doctor')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Stethoscope className="h-4 w-4" />
                <span className="uppercase">MÉDECIN</span>
              </button>
            </div>
            
            {/* Placeholders */}
            <div className="text-sm font-medium opacity-50">Etablissement 2</div>
            <div className="text-sm font-medium opacity-50">Etablissement X</div>
          </div>
        </div>
      </aside>

      {/* Zone principale sélection */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Espace Professionnel</h1>
            <p className="text-muted-foreground">
              Sélectionnez votre contexte de travail
            </p>
          </div>

          {/* Information de Profil */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Information de Profil</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                  {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{fullName}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary">Professionnel de santé</Badge>
              </div>
            </div>
          </Card>

          {/* Autres sections... */}
        </div>
      </main>
    </div>
  );
}
```

---

## 📁 ÉTAPE 6 : ROUTES ET CONFIGURATION

### Mettre à jour `src/AppMain.tsx`
```typescript
// Ajouter l'import
import ProfessionalHub from "./pages/professional/ProfessionalHub";

// Ajouter la route principale
<Route path="/professional" element={<ProfessionalHub />} />

// Mettre à jour les redirections de connexion
// Dans LoginProfessional.tsx :
navigate("/professional");  // Au lieu de "/professional/select-establishment"
```

---

## 🧪 ÉTAPE 7 : TESTS ET VALIDATION

### Script de test `scripts/test-multi-roles.js`
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testMultiRoles() {
  console.log('🧪 Test rôles multiples Dr. DJEKI');

  // 1. Vérifier utilisateur
  const { data: user } = await supabase.auth.admin.getUserByEmail('directeur.sogara@sante.ga');
  console.log('✅ User ID:', user?.user?.id);

  // 2. Vérifier rôles multiples
  const { data: roles } = await supabase.rpc('get_user_roles_for_establishment', {
    _user_id: user?.user?.id,
    _establishment_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  });

  console.log('✅ Rôles disponibles:');
  roles?.forEach(role => {
    console.log(`  - ${role.role_in_establishment} (${role.department})`);
  });

  return roles?.length >= 2; // Doit avoir au moins 2 rôles
}

testMultiRoles();
```

---

## ✅ CHECKLIST DE VALIDATION COMPLÈTE

### Base de Données
- [ ] Migration SQL exécutée
- [ ] Dr. DJEKI a 2 entrées dans `establishment_staff`
- [ ] Fonction RPC `get_user_roles_for_establishment` créée
- [ ] Test script confirme 2 rôles

### Frontend
- [ ] `menuDefinitions.ts` créé avec DIRECTOR_MENU et DOCTOR_MENU
- [ ] `ProfessionalEstablishmentLayout` avec sidebar hiérarchique
- [ ] `ProfessionalHub` page unifiée
- [ ] `MultiEstablishmentContext` étendu avec `currentRole`
- [ ] Route `/professional` configurée

### Interface
- [ ] Sidebar gauche avec CMST SOGARA → ADMIN/MÉDECIN
- [ ] Clic sur ADMIN → Menu 5 sections
- [ ] Clic sur MÉDECIN → Menu 4 sections
- [ ] Changement instantané (< 100ms)
- [ ] Rôle actif surligné en bleu avec icône →

### Tests
- [ ] Connexion : `directeur.sogara@sante.ga`
- [ ] URL : `http://localhost:8080/professional/`
- [ ] Sidebar hiérarchique visible
- [ ] Switch ADMIN ↔ MÉDECIN fonctionnel
- [ ] Console sans erreurs

---

## 🚀 COMMANDES D'EXÉCUTION

```bash
# 1. Appliquer la migration
npm run db:migrate

# 2. Exécuter le test
node scripts/test-multi-roles.js

# 3. Lancer le serveur
npm run dev

# 4. Tester dans le navigateur
open http://localhost:8080/professional/
```

---

## 🎯 RÉSULTAT FINAL ATTENDU

```
┌─────────────────┬─────────────────┬──────────────────┐
│    SIDEBAR      │ MENU ACCORDÉON  │   CONTENU        │
│   SÉLECTION     │   CONTEXTUEL    │                  │
├─────────────────┼─────────────────┼──────────────────┤
│ 📊 Tableau bord │                 │                  │
│                 │ Si ADMIN:       │  Dashboard       │
│ Établissem.     │ ┌─ GÉNÉRAL ▼    │  Statistiques    │
│ CMST SOGARA     │ ├─ ACTIVITÉ ▼   │  Graphiques      │
│  🛡️ ADMIN ✓   │ ├─ DIRECTION ▼  │                  │
│  🩺 MÉDECIN     │ ├─ ADMIN ▼      │                  │
│                 │ └─ COMM ▼       │                  │
│ Etab 2          │                 │                  │
│ Etab X          │ Si MÉDECIN:     │                  │
│                 │ ┌─ GÉNÉRAL ▼    │                  │
│ ⚙️ Paramètres  │ ├─ ACTIVITÉ ▼   │                  │
│                 │ ├─ DIRECTION ▼  │                  │
│                 │ └─ COMM ▼       │                  │
└─────────────────┴─────────────────┴──────────────────┘
```

**Dr. DJEKI peut basculer entre ADMIN (5 sections) et MÉDECIN (4 sections) instantanément !**

---

**🎉 Architecture complète pour les menus hiérarchiques multi-rôles implémentée !** 🚀
