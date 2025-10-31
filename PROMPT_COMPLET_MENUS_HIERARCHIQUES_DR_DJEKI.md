# 🎯 PROMPT COMPLET - IMPLÉMENTATION MENUS HIÉRARCHIQUES MULTI-RÔLES

**Projet**: SANTE.GA - Plateforme e-santé nationale du Gabon  
**Objectif**: Implémenter un système de menus hiérarchiques avec support des rôles multiples pour le Dr. Jules DJEKI au CMST SOGARA  
**Date**: 31 octobre 2025

---

## 🏗️ VUE D'ENSEMBLE DE L'ARCHITECTURE

### Concept Fondamental

Le système doit permettre à un professionnel de santé (comme le Dr. Jules DJEKI) de :

1. **Se connecter avec UN SEUL compte**
2. **Accéder à PLUSIEURS établissements**
3. **Avoir PLUSIEURS rôles dans UN MÊME établissement**
4. **Basculer instantanément entre les rôles**
5. **Voir des menus contextuels adaptés à chaque rôle**
6. **Conserver les permissions spécifiques à chaque rôle**

### Architecture Hiérarchique

```
Connexion → Sélection Établissement → Sélection Rôle → Dashboard avec Menu Contextuel
```

### Cas d'Usage Principal : Dr. Jules DJEKI

- **Compte unique** : `directeur.sogara@sante.ga`
- **Établissement** : CMST SOGARA
- **Rôles multiples** :
  - DIRECTEUR MÉDICAL (Admin complet)
  - MÉDECIN CONSULTANT (Accès médical uniquement)
- **Besoin** : Basculer entre administration et pratique médicale

---

## 📦 ÉTAPE 1 : STRUCTURE DE BASE DE DONNÉES

### 1.1 Migration SQL Complète

Créer le fichier `supabase/migrations/20251031_multi_roles_architecture.sql` :

```sql
-- ============================================
-- MIGRATION COMPLÈTE MULTI-RÔLES
-- ============================================

-- 1. Table des professionnels (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.professionals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  speciality text,
  license_number text UNIQUE,
  years_of_experience integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- 2. Table des établissements (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.establishments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  raison_sociale text NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hopital', 'clinique', 'centre_medical', 'cabinet_medical', 'pharmacie', 'laboratoire', 'centre_sante')),
  city text,
  region text,
  address text,
  phone text,
  email text,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 3. Table des affiliations staff-établissement (CORE POUR MULTI-RÔLES)
CREATE TABLE IF NOT EXISTS public.establishment_staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id uuid REFERENCES public.professionals(id) ON DELETE CASCADE,
  establishment_id uuid REFERENCES public.establishments(id) ON DELETE CASCADE,
  
  -- RÔLE DANS L'ÉTABLISSEMENT
  role_in_establishment text NOT NULL CHECK (role_in_establishment IN ('director', 'admin', 'doctor', 'nurse', 'pharmacist', 'laborantin', 'receptionist')),
  
  -- INFORMATIONS CONTEXTUELLES
  department text,
  job_position text,
  matricule text,
  
  -- PERMISSIONS
  is_admin boolean DEFAULT false,
  is_department_head boolean DEFAULT false,
  permissions text[] DEFAULT ARRAY[]::text[],
  
  -- STATUT
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  employment_type text CHECK (employment_type IN ('full_time', 'part_time', 'consultant', 'volunteer')),
  
  -- DATES
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  
  -- CONTRAINTE UNIQUE : Un professionnel peut avoir plusieurs rôles dans le même établissement
  UNIQUE(professional_id, establishment_id, role_in_establishment)
);

-- 4. Index pour performances
CREATE INDEX IF NOT EXISTS idx_establishment_staff_professional ON public.establishment_staff(professional_id);
CREATE INDEX IF NOT EXISTS idx_establishment_staff_establishment ON public.establishment_staff(establishment_id);
CREATE INDEX IF NOT EXISTS idx_establishment_staff_status ON public.establishment_staff(status);

-- ============================================
-- FONCTIONS RPC POUR GESTION MULTI-RÔLES
-- ============================================

-- 1. Récupérer tous les établissements et rôles d'un professionnel
CREATE OR REPLACE FUNCTION public.get_professional_establishments(_user_id uuid)
RETURNS TABLE (
  staff_id uuid,
  establishment_id uuid,
  establishment_name text,
  establishment_type text,
  role_in_establishment text,
  department text,
  job_position text,
  matricule text,
  is_admin boolean,
  is_department_head boolean,
  permissions text[],
  status text
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    es.id as staff_id,
    e.id as establishment_id,
    e.raison_sociale as establishment_name,
    e.type as establishment_type,
    es.role_in_establishment,
    es.department,
    es.job_position,
    es.matricule,
    es.is_admin,
    es.is_department_head,
    es.permissions,
    es.status
  FROM public.professionals p
  INNER JOIN public.establishment_staff es ON es.professional_id = p.id
  INNER JOIN public.establishments e ON e.id = es.establishment_id
  WHERE p.user_id = _user_id
    AND es.status = 'active'
  ORDER BY es.is_admin DESC, e.raison_sociale;
$$;

-- 2. Récupérer le contexte d'un rôle spécifique
CREATE OR REPLACE FUNCTION public.get_professional_context(
  _user_id uuid,
  _establishment_id uuid,
  _role text DEFAULT NULL
)
RETURNS TABLE (
  establishment_id uuid,
  establishment_name text,
  establishment_type text,
  role_in_establishment text,
  department text,
  job_position text,
  matricule text,
  is_admin boolean,
  is_department_head boolean,
  permissions text[]
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    e.id as establishment_id,
    e.raison_sociale as establishment_name,
    e.type as establishment_type,
    es.role_in_establishment,
    es.department,
    es.job_position,
    es.matricule,
    es.is_admin,
    es.is_department_head,
    es.permissions
  FROM public.professionals p
  INNER JOIN public.establishment_staff es ON es.professional_id = p.id
  INNER JOIN public.establishments e ON e.id = es.establishment_id
  WHERE p.user_id = _user_id
    AND es.establishment_id = _establishment_id
    AND (_role IS NULL OR es.role_in_establishment = _role)
    AND es.status = 'active'
  LIMIT 1;
$$;

-- 3. Récupérer tous les rôles disponibles dans un établissement
CREATE OR REPLACE FUNCTION public.get_available_roles(
  _user_id uuid,
  _establishment_id uuid
)
RETURNS TABLE (
  role text,
  is_admin boolean,
  department text,
  job_position text
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    es.role_in_establishment as role,
    es.is_admin,
    es.department,
    es.job_position
  FROM public.professionals p
  INNER JOIN public.establishment_staff es ON es.professional_id = p.id
  WHERE p.user_id = _user_id
    AND es.establishment_id = _establishment_id
    AND es.status = 'active'
  ORDER BY es.is_admin DESC, es.role_in_establishment;
$$;

-- 4. Vérifier une permission
CREATE OR REPLACE FUNCTION public.has_permission(
  _user_id uuid,
  _establishment_id uuid,
  _permission text
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.professionals p
    INNER JOIN public.establishment_staff es ON es.professional_id = p.id
    WHERE p.user_id = _user_id
      AND es.establishment_id = _establishment_id
      AND es.status = 'active'
      AND (_permission = ANY(es.permissions) OR es.is_admin = true)
  );
$$;

-- ============================================
-- INSERTION DES DONNÉES DR. JULES DJEKI
-- ============================================

-- 1. Créer l'établissement CMST SOGARA
INSERT INTO public.establishments (
  id,
  raison_sociale,
  name,
  type,
  city,
  region,
  address,
  phone,
  email,
  is_active,
  is_verified
) VALUES (
  'cmst-sogara-001',
  'Centre Médico-Social Total SOGARA',
  'CMST SOGARA',
  'hopital',
  'Port-Gentil',
  'Ogooué-Maritime',
  'Zone industrielle SOGARA',
  '011 55 26 21',
  'contact@cmst-sogara.ga',
  true,
  true
) ON CONFLICT DO NOTHING;

-- 2. Créer le profil professionnel du Dr. DJEKI
-- Note: Récupérer d'abord l'UUID du compte depuis auth.users
DO $$
DECLARE
  v_user_id uuid;
  v_professional_id uuid;
BEGIN
  -- Récupérer l'ID utilisateur
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'directeur.sogara@sante.ga'
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Créer ou récupérer le professionnel
    INSERT INTO public.professionals (
      user_id,
      speciality,
      license_number,
      years_of_experience,
      is_verified
    ) VALUES (
      v_user_id,
      'Médecine Générale et Administration Hospitalière',
      'MED-GA-2024-001',
      15,
      true
    )
    ON CONFLICT (user_id) DO UPDATE
    SET speciality = EXCLUDED.speciality
    RETURNING id INTO v_professional_id;
    
    -- 3. Créer le rôle DIRECTEUR
    INSERT INTO public.establishment_staff (
      professional_id,
      establishment_id,
      role_in_establishment,
      department,
      job_position,
      matricule,
      is_admin,
      is_department_head,
      permissions,
      status,
      employment_type
    ) VALUES (
      v_professional_id,
      'cmst-sogara-001',
      'director',
      'Direction Médicale',
      'Directeur Médical',
      'DIR-001',
      true,
      true,
      ARRAY[
        'manage_all',
        'view_all_patients',
        'manage_staff',
        'manage_departments',
        'view_finances',
        'edit_settings',
        'generate_reports'
      ],
      'active',
      'full_time'
    ) ON CONFLICT DO NOTHING;
    
    -- 4. Créer le rôle MÉDECIN
    INSERT INTO public.establishment_staff (
      professional_id,
      establishment_id,
      role_in_establishment,
      department,
      job_position,
      matricule,
      is_admin,
      is_department_head,
      permissions,
      status,
      employment_type
    ) VALUES (
      v_professional_id,
      'cmst-sogara-001',
      'doctor',
      'Médecine Générale',
      'Médecin Consultant',
      'MED-001',
      false,
      false,
      ARRAY[
        'view_patients',
        'create_consultations',
        'create_prescriptions',
        'view_medical_records',
        'use_teleconsultation'
      ],
      'active',
      'full_time'
    ) ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Dr. DJEKI configuré avec succès avec 2 rôles';
  ELSE
    RAISE NOTICE 'Utilisateur directeur.sogara@sante.ga non trouvé';
  END IF;
END $$;

-- ============================================
-- POLITIQUES RLS (Row Level Security)
-- ============================================

-- Activer RLS
ALTER TABLE public.establishment_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Politique : Les professionnels voient leurs propres affiliations
CREATE POLICY "professionals_view_own_staff_roles" ON public.establishment_staff
  FOR SELECT
  USING (
    professional_id IN (
      SELECT id FROM public.professionals WHERE user_id = auth.uid()
    )
  );

-- Politique : Les admins d'établissement peuvent gérer le staff
CREATE POLICY "admins_manage_establishment_staff" ON public.establishment_staff
  FOR ALL
  USING (
    establishment_id IN (
      SELECT es.establishment_id
      FROM public.establishment_staff es
      INNER JOIN public.professionals p ON p.id = es.professional_id
      WHERE p.user_id = auth.uid() AND es.is_admin = true
    )
  );

-- Politique : Tout le monde peut voir les établissements actifs
CREATE POLICY "public_view_establishments" ON public.establishments
  FOR SELECT
  USING (is_active = true);

-- Politique : Les professionnels voient leur propre profil
CREATE POLICY "professionals_view_own_profile" ON public.professionals
  FOR SELECT
  USING (user_id = auth.uid());
```

---

## 📦 ÉTAPE 2 : CONFIGURATION DES MENUS HIÉRARCHIQUES

### 2.1 Créer `src/config/menuDefinitions.ts`

```typescript
// src/config/menuDefinitions.ts
import {
  LucideIcon,
  Home,
  Calendar,
  Users,
  Video,
  ClipboardList,
  Pill,
  DollarSign,
  TrendingUp,
  Mail,
  Stethoscope,
  Link2,
  Settings,
  BarChart3,
  Shield,
  Activity,
  FileText,
  Package,
  Building2,
  UserPlus,
  BookOpen,
  Briefcase,
  Clipboard,
  UserCog,
  Hospital,
  UsersRound,
  Warehouse,
  MessageSquare,
  Syringe,
  TestTube,
  CreditCard
} from 'lucide-react';

// ============================================
// TYPES ET INTERFACES
// ============================================

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number | string;
  permission?: string;
  description?: string;
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
  collapsible?: boolean;
}

// Types d'établissements
export type EstablishmentType = 
  | 'hopital' 
  | 'clinique' 
  | 'centre_medical' 
  | 'cabinet_medical' 
  | 'pharmacie' 
  | 'laboratoire'
  | 'centre_sante';

// Rôles professionnels
export type ProfessionalRole = 
  | 'admin' 
  | 'director' 
  | 'doctor' 
  | 'nurse' 
  | 'pharmacist' 
  | 'laborantin' 
  | 'receptionist';

// Labels pour affichage
export const ROLE_LABELS: Record<string, string> = {
  'director': 'Directeur',
  'admin': 'Administrateur',
  'doctor': 'Médecin',
  'nurse': 'Infirmier(e)',
  'pharmacist': 'Pharmacien(ne)',
  'laborantin': 'Laborantin(e)',
  'receptionist': 'Réceptionniste'
};

// Icônes des rôles
export const ROLE_ICONS: Record<string, LucideIcon> = {
  'director': Briefcase,
  'admin': UserCog,
  'doctor': Stethoscope,
  'nurse': Activity,
  'pharmacist': Syringe,
  'laborantin': TestTube,
  'receptionist': Users
};

// ============================================
// MENU DIRECTEUR (5 sections)
// ============================================

const DIRECTOR_MENU: MenuSection[] = [
  {
    id: 'general',
    label: 'Général',
    collapsible: true,
    items: [
      {
        icon: Home,
        label: 'Tableau de bord',
        href: '/professional/dashboard',
        description: 'Vue d\'ensemble de l\'établissement'
      },
      {
        icon: BarChart3,
        label: 'Statistiques',
        href: '/professional/statistics',
        description: 'Analyses et rapports',
        permission: 'view_statistics'
      },
      {
        icon: Calendar,
        label: 'Agenda & RDV',
        href: '/professional/appointments',
        badge: 8,
        description: 'Gestion des rendez-vous'
      }
    ]
  },
  {
    id: 'medical-direction',
    label: 'Direction Médicale',
    collapsible: true,
    items: [
      {
        icon: UserCog,
        label: 'Corps médical',
        href: '/professional/medical-staff',
        description: 'Gestion de l\'équipe médicale',
        permission: 'manage_staff'
      },
      {
        icon: Hospital,
        label: 'Services',
        href: '/professional/services',
        description: 'Configuration des services',
        permission: 'manage_departments'
      },
      {
        icon: ClipboardList,
        label: 'Protocoles',
        href: '/professional/protocols',
        description: 'Protocoles médicaux'
      }
    ]
  },
  {
    id: 'administration',
    label: 'Administration',
    collapsible: true,
    items: [
      {
        icon: UsersRound,
        label: 'Personnel',
        href: '/professional/staff',
        description: 'Gestion du personnel',
        permission: 'manage_staff'
      },
      {
        icon: CreditCard,
        label: 'Finances & CNAMGS',
        href: '/professional/finances',
        description: 'Gestion financière et remboursements',
        permission: 'view_finances'
      },
      {
        icon: Building2,
        label: 'Infrastructure',
        href: '/professional/infrastructure',
        description: 'Locaux et équipements'
      },
      {
        icon: Package,
        label: 'Stocks & Pharmacie',
        href: '/professional/inventory',
        description: 'Gestion des stocks'
      }
    ]
  },
  {
    id: 'activity',
    label: 'Activité Médicale',
    collapsible: true,
    items: [
      {
        icon: Users,
        label: 'Tous les patients',
        href: '/professional/all-patients',
        permission: 'view_all_patients'
      },
      {
        icon: ClipboardList,
        label: 'Toutes les consultations',
        href: '/professional/all-consultations',
        permission: 'view_all_consultations'
      },
      {
        icon: FileText,
        label: 'Rapports médicaux',
        href: '/professional/medical-reports',
        permission: 'generate_reports'
      }
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    collapsible: true,
    items: [
      {
        icon: MessageSquare,
        label: 'Messages',
        href: '/professional/messages',
        badge: 5,
        description: 'Messagerie interne'
      },
      {
        icon: Activity,
        label: 'Intégrations',
        href: '/professional/integrations',
        description: 'Connexions externes'
      },
      {
        icon: Settings,
        label: 'Paramètres',
        href: '/professional/settings',
        description: 'Configuration',
        permission: 'edit_settings'
      }
    ]
  }
];

// ============================================
// MENU MÉDECIN (4 sections)
// ============================================

const DOCTOR_MENU: MenuSection[] = [
  {
    id: 'general',
    label: 'Général',
    collapsible: true,
    items: [
      {
        icon: Home,
        label: 'Tableau de bord',
        href: '/professional/dashboard',
        description: 'Vue d\'ensemble de mon activité'
      },
      {
        icon: Calendar,
        label: 'Mon agenda',
        href: '/professional/appointments',
        badge: 8,
        description: 'Mes rendez-vous'
      }
    ]
  },
  {
    id: 'medical-activity',
    label: 'Activité Médicale',
    collapsible: true,
    items: [
      {
        icon: Users,
        label: 'Mes patients',
        href: '/professional/patients',
        description: 'Liste de mes patients',
        permission: 'view_patients'
      },
      {
        icon: Stethoscope,
        label: 'Consultations',
        href: '/professional/consultations',
        description: 'Consultations en cours et passées',
        permission: 'create_consultations'
      },
      {
        icon: Video,
        label: 'Téléconsultations',
        href: '/professional/teleconsultations',
        description: 'Consultations à distance',
        permission: 'use_teleconsultation'
      },
      {
        icon: FileText,
        label: 'Prescriptions',
        href: '/professional/prescriptions',
        description: 'Ordonnances émises',
        permission: 'create_prescriptions'
      },
      {
        icon: UsersRound,
        label: 'Télé-expertise',
        href: '/professional/teleexpertise',
        description: 'Demandes d\'avis médical'
      }
    ]
  },
  {
    id: 'personal',
    label: 'Personnel',
    collapsible: true,
    items: [
      {
        icon: BarChart3,
        label: 'Mes statistiques',
        href: '/professional/my-stats',
        description: 'Mon activité personnelle'
      },
      {
        icon: CreditCard,
        label: 'Mes finances',
        href: '/professional/my-finances',
        description: 'Rémunération et honoraires'
      },
      {
        icon: MessageSquare,
        label: 'Messages',
        href: '/professional/messages',
        badge: 5,
        description: 'Ma messagerie'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Paramètres',
    collapsible: true,
    items: [
      {
        icon: Settings,
        label: 'Paramètres',
        href: '/professional/settings',
        description: 'Configuration personnelle'
      }
    ]
  }
];

// ============================================
// MENU ADMIN (similaire à DIRECTEUR)
// ============================================

const ADMIN_MENU = DIRECTOR_MENU;

// ============================================
// MAPPINGS PAR TYPE D'ÉTABLISSEMENT
// ============================================

export const MENU_DEFINITIONS: Record<EstablishmentType, Record<ProfessionalRole, MenuSection[]>> = {
  hopital: {
    admin: ADMIN_MENU,
    director: DIRECTOR_MENU,
    doctor: DOCTOR_MENU,
    nurse: DOCTOR_MENU.filter(s => s.id !== 'personal'),
    pharmacist: [],
    laborantin: [],
    receptionist: []
  },
  clinique: {
    admin: ADMIN_MENU,
    director: DIRECTOR_MENU,
    doctor: DOCTOR_MENU,
    nurse: DOCTOR_MENU.filter(s => s.id !== 'personal'),
    pharmacist: [],
    laborantin: [],
    receptionist: []
  },
  centre_medical: {
    admin: ADMIN_MENU,
    director: DIRECTOR_MENU,
    doctor: DOCTOR_MENU,
    nurse: DOCTOR_MENU.filter(s => s.id !== 'personal'),
    pharmacist: [],
    laborantin: [],
    receptionist: []
  },
  cabinet_medical: {
    admin: ADMIN_MENU.filter(s => ['general', 'administration', 'communication'].includes(s.id)),
    director: ADMIN_MENU.filter(s => ['general', 'administration', 'communication'].includes(s.id)),
    doctor: DOCTOR_MENU,
    nurse: DOCTOR_MENU.filter(s => s.id !== 'personal'),
    pharmacist: [],
    laborantin: [],
    receptionist: []
  },
  pharmacie: {
    admin: [],
    director: [],
    doctor: [],
    nurse: [],
    pharmacist: [],
    laborantin: [],
    receptionist: []
  },
  laboratoire: {
    admin: [],
    director: [],
    doctor: [],
    nurse: [],
    pharmacist: [],
    laborantin: [],
    receptionist: []
  },
  centre_sante: {
    admin: ADMIN_MENU,
    director: DIRECTOR_MENU,
    doctor: DOCTOR_MENU,
    nurse: DOCTOR_MENU.filter(s => s.id !== 'personal'),
    pharmacist: [],
    laborantin: [],
    receptionist: []
  }
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Obtenir le menu selon le contexte
export function getMenuForContext(
  establishmentType: string,
  role: string
): MenuSection[] {
  const normalizedType = establishmentType?.toLowerCase() as EstablishmentType;
  const normalizedRole = role?.toLowerCase() as ProfessionalRole;
  
  if (!normalizedType || !normalizedRole) {
    return [];
  }
  
  const menuMap = MENU_DEFINITIONS[normalizedType];
  if (!menuMap) {
    return [];
  }
  
  return menuMap[normalizedRole] || [];
}

// Obtenir le menu pour un rôle spécifique
export function getMenuForRole(role: string): MenuSection[] {
  const normalizedRole = role?.toLowerCase();
  
  switch (normalizedRole) {
    case 'director':
      return DIRECTOR_MENU;
    case 'admin':
      return ADMIN_MENU;
    case 'doctor':
      return DOCTOR_MENU;
    default:
      return [];
  }
}

// Vérifier si un utilisateur a accès à un item de menu
export function hasAccessToMenuItem(
  item: MenuItem,
  permissions: string[],
  isAdmin: boolean
): boolean {
  // Admin a accès à tout
  if (isAdmin) return true;
  
  // Si pas de permission requise, accessible à tous
  if (!item.permission) return true;
  
  // Vérifier la permission
  return permissions.includes(item.permission);
}
```

---

## 📦 ÉTAPE 3 : CONTEXTE MULTI-ÉTABLISSEMENT AMÉLIORÉ

### 3.1 Créer `src/contexts/MultiEstablishmentContext.tsx`

```typescript
// src/contexts/MultiEstablishmentContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// ============================================
// TYPES
// ============================================

interface EstablishmentAffiliation {
  staff_id: string;
  establishment_id: string;
  establishment_name: string;
  establishment_type: string;
  role_in_establishment: string;
  department: string;
  job_position: string;
  matricule: string;
  is_admin: boolean;
  is_department_head: boolean;
  permissions: string[];
  status: string;
}

interface ProfessionalContext {
  establishment_id: string;
  establishment_name: string;
  establishment_type: string;
  role_in_establishment: string;
  department: string;
  job_position: string;
  matricule: string;
  is_admin: boolean;
  is_department_head: boolean;
  permissions: string[];
}

interface MultiEstablishmentContextType {
  // États
  establishments: EstablishmentAffiliation[];
  currentEstablishment: ProfessionalContext | null;
  currentRole: string | null;
  availableRoles: string[];
  loading: boolean;
  
  // Actions
  selectEstablishment: (establishmentId: string) => Promise<void>;
  switchRole: (role: string) => Promise<void>;
  refreshEstablishments: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  
  // Helpers
  isAdmin: boolean;
  isDirector: boolean;
  canManageStaff: boolean;
}

// ============================================
// CONTEXTE
// ============================================

const MultiEstablishmentContext = createContext<MultiEstablishmentContextType | undefined>(undefined);

export const MultiEstablishmentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  // États
  const [establishments, setEstablishments] = useState<EstablishmentAffiliation[]>([]);
  const [currentEstablishment, setCurrentEstablishment] = useState<ProfessionalContext | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // CHARGEMENT DES ÉTABLISSEMENTS
  // ============================================
  
  const loadEstablishments = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Appel RPC pour récupérer tous les établissements
      const { data, error } = await supabase.rpc('get_professional_establishments', {
        _user_id: user.id
      });

      if (error) {
        // Si l'utilisateur n'est pas un professionnel, c'est normal
        if (error.code === 'PGRST116' || error.message?.includes('function')) {
          console.debug('Utilisateur non-professionnel');
          setLoading(false);
          return;
        }
        
        console.error('Erreur de chargement des établissements:', error);
        toast.error('Impossible de charger vos établissements');
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.debug('Aucun établissement trouvé');
        setEstablishments([]);
        setCurrentEstablishment(null);
        setLoading(false);
        return;
      }

      setEstablishments(data);

      // Auto-sélection si un seul établissement
      if (data.length === 1) {
        await selectEstablishment(data[0].establishment_id);
      } else {
        // Sélectionner le premier établissement admin ou le premier tout court
        const adminEstab = data.find((e: EstablishmentAffiliation) => e.is_admin);
        const firstEstab = adminEstab || data[0];
        await selectEstablishment(firstEstab.establishment_id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des établissements:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // ============================================
  // SÉLECTION D'UN ÉTABLISSEMENT
  // ============================================
  
  const selectEstablishment = useCallback(async (establishmentId: string) => {
    if (!user?.id) return;

    try {
      // Récupérer les rôles disponibles
      const { data: rolesData, error: rolesError } = await supabase.rpc('get_available_roles', {
        _user_id: user.id,
        _establishment_id: establishmentId
      });

      if (rolesError) {
        console.error('Erreur chargement des rôles:', rolesError);
        return;
      }

      if (!rolesData || rolesData.length === 0) {
        console.error('Aucun rôle trouvé');
        return;
      }

      // Stocker les rôles disponibles
      const roles = rolesData.map((r: any) => r.role);
      setAvailableRoles(roles);

      // Sélectionner le rôle (priorité: rôle sauvegardé > admin > premier)
      const savedRole = localStorage.getItem(`selected_role_${establishmentId}`);
      const adminRole = rolesData.find((r: any) => r.is_admin)?.role;
      const selectedRole = (savedRole && roles.includes(savedRole)) 
        ? savedRole 
        : adminRole || roles[0];

      // Charger le contexte pour ce rôle
      const { data: contextData, error: contextError } = await supabase.rpc('get_professional_context', {
        _user_id: user.id,
        _establishment_id: establishmentId,
        _role: selectedRole
      });

      if (contextError || !contextData) {
        console.error('Erreur chargement contexte:', contextError);
        return;
      }

      setCurrentEstablishment(contextData[0]);
      setCurrentRole(selectedRole);
      
      // Sauvegarder les sélections
      localStorage.setItem('selected_establishment_id', establishmentId);
      localStorage.setItem(`selected_role_${establishmentId}`, selectedRole);
      
      toast.success(`Connecté à ${contextData[0].establishment_name} en tant que ${selectedRole}`);
    } catch (error) {
      console.error('Erreur sélection établissement:', error);
    }
  }, [user?.id]);

  // ============================================
  // CHANGEMENT DE RÔLE
  // ============================================
  
  const switchRole = useCallback(async (role: string) => {
    if (!currentEstablishment || !user?.id) return;

    if (role === currentRole) {
      return;
    }

    try {
      // Recharger le contexte avec le nouveau rôle
      const { data: contextData, error: contextError } = await supabase.rpc('get_professional_context', {
        _user_id: user.id,
        _establishment_id: currentEstablishment.establishment_id,
        _role: role
      });

      if (contextError || !contextData) {
        console.error('Erreur changement de rôle:', contextError);
        toast.error('Impossible de changer de rôle');
        return;
      }

      setCurrentEstablishment(contextData[0]);
      setCurrentRole(role);
      
      // Sauvegarder le nouveau rôle
      localStorage.setItem(`selected_role_${currentEstablishment.establishment_id}`, role);
      
      toast.success(`Rôle changé: ${role}`);
    } catch (error) {
      console.error('Erreur switch rôle:', error);
      toast.error('Erreur lors du changement de rôle');
    }
  }, [currentEstablishment, currentRole, user?.id]);

  // ============================================
  // PERMISSIONS
  // ============================================
  
  const hasPermission = useCallback((permission: string): boolean => {
    if (!currentEstablishment) return false;
    
    // Admin a toutes les permissions
    if (currentEstablishment.is_admin) return true;
    
    // Vérifier dans la liste des permissions
    return currentEstablishment.permissions.includes(permission);
  }, [currentEstablishment]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  }, [hasPermission]);

  // ============================================
  // RAFRAÎCHIR
  // ============================================
  
  const refreshEstablishments = useCallback(async () => {
    await loadEstablishments();
  }, [loadEstablishments]);

  // ============================================
  // HELPERS
  // ============================================
  
  const isAdmin = currentEstablishment?.is_admin || false;
  const isDirector = currentRole === 'director';
  const canManageStaff = hasPermission('manage_staff');

  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    loadEstablishments();
  }, [loadEstablishments]);

  // ============================================
  // PROVIDER
  // ============================================
  
  const value: MultiEstablishmentContextType = {
    // États
    establishments,
    currentEstablishment,
    currentRole,
    availableRoles,
    loading,
    
    // Actions
    selectEstablishment,
    switchRole,
    refreshEstablishments,
    hasPermission,
    hasAnyPermission,
    
    // Helpers
    isAdmin,
    isDirector,
    canManageStaff
  };

  return (
    <MultiEstablishmentContext.Provider value={value}>
      {children}
    </MultiEstablishmentContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useMultiEstablishment = () => {
  const context = useContext(MultiEstablishmentContext);
  if (!context) {
    throw new Error('useMultiEstablishment doit être utilisé dans MultiEstablishmentProvider');
  }
  return context;
};
```

---

## 📦 ÉTAPE 4 : COMPOSANT DE CHANGEMENT DE RÔLE

### 4.1 Créer `src/components/professional/RoleSwitcher.tsx`

```typescript
// src/components/professional/RoleSwitcher.tsx
import { useState } from 'react';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Check, Shield, Stethoscope } from 'lucide-react';
import { ROLE_LABELS, ROLE_ICONS } from '@/config/menuDefinitions';
import { toast } from 'sonner';

export function RoleSwitcher() {
  const {
    currentRole,
    availableRoles,
    switchRole,
    isAdmin
  } = useMultiEstablishment();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Ne pas afficher si un seul rôle
  if (!availableRoles || availableRoles.length <= 1) {
    return null;
  }

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole || isSwitching) return;

    setIsSwitching(true);
    try {
      await switchRole(newRole);
      setIsOpen(false);
      
      // Notification de succès
      toast.success('Rôle changé', {
        description: `Vous êtes maintenant en mode ${ROLE_LABELS[newRole] || newRole}`
      });
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de changer de rôle'
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const Icon = ROLE_ICONS[role];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'director':
        return 'bg-purple-600 text-white';
      case 'admin':
        return 'bg-blue-600 text-white';
      case 'doctor':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="px-4 py-3 border-t border-border/50 bg-muted/20">
      <div className="text-xs text-muted-foreground mb-2 uppercase font-medium">
        Rôle actuel
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-3 px-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isSwitching}
          >
            <div className="flex items-center gap-3">
              {getRoleIcon(currentRole || '')}
              <div className="text-left">
                <div className="text-sm font-semibold">
                  {ROLE_LABELS[currentRole || ''] || currentRole}
                </div>
                <div className="text-xs text-muted-foreground">
                  {availableRoles.length} rôle{availableRoles.length > 1 ? 's' : ''} disponible{availableRoles.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform text-muted-foreground ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-[280px]">
          <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">
            Basculer vers un autre rôle
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {availableRoles.map((role) => {
            const isActive = role === currentRole;
            const Icon = ROLE_ICONS[role];
            
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleChange(role)}
                disabled={isActive || isSwitching}
                className={`cursor-pointer py-3 ${isActive ? 'bg-accent' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-4 h-4" />}
                    <div>
                      <div className="font-medium">
                        {ROLE_LABELS[role] || role}
                      </div>
                      {role === 'director' && (
                        <div className="text-xs text-muted-foreground">
                          Accès administration complet
                        </div>
                      )}
                      {role === 'doctor' && (
                        <div className="text-xs text-muted-foreground">
                          Accès médical uniquement
                        </div>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Badge du rôle actuel */}
      <div className="mt-3 flex items-center gap-2">
        <Badge className={getRoleBadgeColor(currentRole || '')}>
          {isAdmin && <Shield className="w-3 h-3 mr-1" />}
          {ROLE_LABELS[currentRole || ''] || currentRole}
        </Badge>
        {isAdmin && (
          <Badge variant="outline" className="text-xs">
            Admin
          </Badge>
        )}
      </div>
    </div>
  );
}
```

---

## 📦 ÉTAPE 5 : LAYOUT AVEC MENU HIÉRARCHIQUE

### 5.1 Créer `src/components/layout/ProfessionalEstablishmentLayout.tsx`

```typescript
// src/components/layout/ProfessionalEstablishmentLayout.tsx
import { ReactNode, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { RoleSwitcher } from '@/components/professional/RoleSwitcher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Menu,
  LogOut,
  Settings,
  User,
  Building2,
  ChevronRight
} from 'lucide-react';
import { getMenuForContext, hasAccessToMenuItem } from '@/config/menuDefinitions';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
}

export function ProfessionalEstablishmentLayout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const {
    currentEstablishment,
    currentRole,
    isAdmin,
    hasPermission,
    establishments
  } = useMultiEstablishment();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ============================================
  // MENU CONTEXTUEL
  // ============================================
  
  const menu = useMemo(() => {
    if (!currentEstablishment || !currentRole) return [];
    
    return getMenuForContext(
      currentEstablishment.establishment_type,
      currentRole
    );
  }, [currentEstablishment, currentRole]);

  // Sections ouvertes par défaut
  const defaultOpenSections = menu.map(section => section.id);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/login/professional');
  };

  const handleNavigate = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  // ============================================
  // RENDER HELPERS
  // ============================================
  
  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;
    
    // Vérifier les permissions
    const hasAccess = hasAccessToMenuItem(
      item,
      currentEstablishment?.permissions || [],
      isAdmin
    );
    
    if (!hasAccess) return null;
    
    return (
      <Link
        key={item.href}
        to={item.href}
        className={`
          flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200
          ${isActive 
            ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
            : 'hover:bg-accent/50 text-foreground'
          }
          rounded-md mx-2
        `}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <Badge 
            variant={isActive ? 'secondary' : 'outline'} 
            className="text-xs"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const renderMenuSection = (section: any) => (
    <AccordionItem 
      key={section.id} 
      value={section.id} 
      className="border-none"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-accent/30 hover:no-underline rounded-md mx-2">
        <span className="text-sm font-semibold">{section.label}</span>
      </AccordionTrigger>
      <AccordionContent className="pb-2 pt-1">
        <div className="space-y-1">
          {section.items.map(renderMenuItem)}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  // ============================================
  // SIDEBAR CONTENT
  // ============================================
  
  const SidebarContent = () => (
    <>
      {/* Header avec établissement */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">
              {currentEstablishment?.establishment_name || 'Établissement'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentEstablishment?.department || 'Service'}
            </p>
          </div>
        </div>
        
        {/* Bouton pour changer d'établissement si plusieurs */}
        {establishments.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 justify-between"
            onClick={() => navigate('/professional/select-establishment')}
          >
            <span className="text-xs">Changer d'établissement</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Switcher de rôle */}
      <RoleSwitcher />

      {/* Menu en accordéon */}
      <div className="flex-1 overflow-y-auto py-4">
        <Accordion 
          type="multiple" 
          defaultValue={defaultOpenSections}
          className="w-full"
        >
          {menu.map(renderMenuSection)}
        </Accordion>
      </div>

      {/* Footer avec profil utilisateur */}
      <div className="p-4 border-t border-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto p-3 hover:bg-accent/50"
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                  {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'PR'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || 'Professionnel'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/professional/profile')}>
              <User className="h-4 w-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/professional/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 dark:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:left-0 bg-card border-r border-border shadow-sm">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Bar Mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full">
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>
              
              <div>
                <h2 className="text-lg font-semibold">
                  {currentEstablishment?.establishment_name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {currentRole ? `${currentRole} - ${currentEstablishment?.department}` : ''}
                </p>
              </div>
            </div>
            
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-bold">
                {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'PR'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 📦 ÉTAPE 6 : TEST ET VALIDATION

### 6.1 Créer un script de test

```bash
# scripts/test-multi-roles.sh
#!/bin/bash

echo "🧪 Test du système multi-rôles Dr. DJEKI"
echo "========================================="

# 1. Appliquer les migrations
echo "📦 Application des migrations SQL..."
psql $DATABASE_URL -f supabase/migrations/20251031_multi_roles_architecture.sql

# 2. Vérifier la création
echo "✅ Vérification des données..."
psql $DATABASE_URL -c "
  SELECT 
    es.role_in_establishment,
    es.department,
    es.is_admin
  FROM establishment_staff es
  JOIN professionals p ON p.id = es.professional_id
  JOIN auth.users u ON u.id = p.user_id
  WHERE u.email = 'directeur.sogara@sante.ga';
"

echo "✅ Test terminé !"
```

### 6.2 Checklist de validation

```markdown
## ✅ CHECKLIST DE VALIDATION

### Base de données
- [ ] Table `establishment_staff` créée
- [ ] Fonctions RPC créées
- [ ] Dr. DJEKI a 2 entrées (director + doctor)
- [ ] Permissions correctement définies

### Frontend - Fichiers
- [ ] `/src/config/menuDefinitions.ts` créé
- [ ] `/src/contexts/MultiEstablishmentContext.tsx` mis à jour
- [ ] `/src/components/professional/RoleSwitcher.tsx` créé
- [ ] `/src/components/layout/ProfessionalEstablishmentLayout.tsx` créé

### Frontend - Fonctionnalités
- [ ] Connexion avec `directeur.sogara@sante.ga` fonctionne
- [ ] Dashboard s'affiche avec le bon établissement
- [ ] RoleSwitcher visible avec 2 rôles
- [ ] Menu DIRECTEUR (5 sections) s'affiche par défaut
- [ ] Changement vers MÉDECIN fonctionne
- [ ] Menu MÉDECIN (4 sections) s'affiche après switch
- [ ] Accordéons s'ouvrent/ferment correctement
- [ ] Items actifs surlignés en bleu
- [ ] Badges de notification visibles
- [ ] Permissions respectées (items cachés si pas de permission)

### UX/UI
- [ ] Animation fluide des accordéons
- [ ] Indicateur visuel du rôle actuel
- [ ] Toast de confirmation au changement
- [ ] Menu mobile responsive
- [ ] Persistance du rôle sélectionné après rafraîchissement
```

---

## 🚀 COMMANDES DE DÉPLOIEMENT

```bash
# 1. Installer les dépendances UI si nécessaire
npm install @radix-ui/react-accordion

# 2. Appliquer les migrations
psql $DATABASE_URL < supabase/migrations/20251031_multi_roles_architecture.sql

# 3. Lancer le serveur de développement
npm run dev

# 4. Se connecter et tester
# Email: directeur.sogara@sante.ga
# Password: DirecteurSOGARA2024!
```

---

## 📊 RÉSULTAT ATTENDU

### Interface Finale

```
┌─────────────────────────────────┬────────────────────────────────┐
│  SIDEBAR (fixe)                 │  ZONE PRINCIPALE              │
├─────────────────────────────────┼────────────────────────────────┤
│  🏥 CMST SOGARA                 │                                │
│  Service: Direction Médicale    │  Contenu principal selon       │
│                                 │  la page sélectionnée          │
│  [Changer établissement →]      │                                │
├─────────────────────────────────┤                                │
│  RÔLE ACTUEL                    │                                │
│  🛡️ Directeur ▼                 │                                │
│  2 rôles disponibles            │                                │
│  [Badge: Directeur] [Admin]     │                                │
├─────────────────────────────────┤                                │
│  📊 GÉNÉRAL ▼                   │                                │
│    └─ Tableau de bord           │                                │
│    └─ Statistiques              │                                │
│    └─ Agenda & RDV [8]          │                                │
│                                 │                                │
│  🩺 DIRECTION MÉDICALE ▼        │                                │
│    └─ Corps médical             │                                │
│    └─ Services                  │                                │
│    └─ Protocoles                │                                │
│                                 │                                │
│  🛡️ ADMINISTRATION ▼            │                                │
│    └─ Personnel                 │                                │
│    └─ Finances & CNAMGS         │                                │
│    └─ Infrastructure            │                                │
│    └─ Stocks & Pharmacie        │                                │
│                                 │                                │
│  🏥 ACTIVITÉ MÉDICALE ▼         │                                │
│    └─ Tous les patients         │                                │
│    └─ Toutes consultations      │                                │
│    └─ Rapports médicaux         │                                │
│                                 │                                │
│  💬 COMMUNICATION ▼             │                                │
│    └─ Messages [5]              │                                │
│    └─ Intégrations              │                                │
│    └─ Paramètres                │                                │
├─────────────────────────────────┤                                │
│  👤 Dr. Jules DJEKI             │                                │
│  directeur.sogara@sante.ga      │                                │
└─────────────────────────────────┴────────────────────────────────┘
```

### Après changement vers MÉDECIN

```
Menu change instantanément:
- GÉNÉRAL (2 items)
- ACTIVITÉ MÉDICALE (5 items)
- PERSONNEL (3 items)
- PARAMÈTRES (1 item)

Badge: [Médecin] (vert au lieu de violet)
```

---

## 🎉 SUCCÈS !

Si tous les points de la checklist sont validés, l'implémentation est réussie !

Le Dr. Jules DJEKI peut maintenant :
- ✅ Se connecter avec un seul compte
- ✅ Voir ses 2 rôles au CMST SOGARA
- ✅ Basculer instantanément entre DIRECTEUR et MÉDECIN
- ✅ Accéder à des menus contextuels différents
- ✅ Conserver les permissions spécifiques à chaque rôle

---

**Fin du prompt complet d'implémentation**  
**Version 1.0 - 31 octobre 2025**
