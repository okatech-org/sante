# 🔧 DÉTAILS TECHNIQUES - MENUS HIÉRARCHIQUES MULTI-RÔLES

**Complément du prompt principal**  
**Cas d'usage avancés et configurations spécifiques**

---

## 🗄️ CONFIGURATION BASE DE DONNÉES DÉTAILLÉE

### Structure Analysée Existante

**Tables principales** :
```sql
-- Profils professionnels
public.professionals (
  id UUID,
  user_id UUID → auth.users.id,
  full_name TEXT,
  email TEXT,
  professional_type TEXT,
  numero_ordre TEXT,
  specialization TEXT,
  verified BOOLEAN
);

-- Affiliations établissements (SUPPORT MULTI-RÔLES)
public.establishment_staff (
  id UUID,
  establishment_id UUID → establishments.id,
  professional_id UUID → professionals.id,
  role_in_establishment TEXT, -- 'director', 'doctor', 'nurse'
  department TEXT,
  job_position TEXT,
  matricule TEXT,
  is_admin BOOLEAN,
  is_department_head BOOLEAN,
  permissions TEXT[],
  status TEXT DEFAULT 'active'
);
```

**Clé du multi-rôles** : Un professionnel peut avoir **plusieurs entrées** dans `establishment_staff` pour le même établissement avec des rôles différents.

### Exemple Dr. Jules DJEKI
```sql
-- ENTRÉE 1 : Directeur
INSERT INTO establishment_staff VALUES (
  'staff-djeki-director',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- CMST SOGARA
  'prof-djeki-001',
  'director',          -- RÔLE 1
  'Direction Médicale',
  'Directeur Médical',
  'DIR-001',
  true,               -- is_admin
  true,               -- is_department_head  
  ARRAY['all'],       -- permissions
  'active'
);

-- ENTRÉE 2 : Médecin
INSERT INTO establishment_staff VALUES (
  'staff-djeki-doctor', 
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- MÊME établissement
  'prof-djeki-001',     -- MÊME professionnel
  'doctor',             -- RÔLE 2 (différent)
  'Médecine Générale',
  'Médecin Généraliste',
  'MED-001',
  false,              -- is_admin
  false,              -- is_department_head
  ARRAY['consultation', 'prescription', 'view_dmp'], -- permissions
  'active'
);
```

---

## 📱 INTERFACE DÉTAILLÉE

### Spécifications UI/UX

**Couleurs et Thèmes** :
```css
/* Rôle actif */
.role-active {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Hover états */
.role-hover:hover {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
}

/* Badges rôles */
.badge-director { background: #1e40af; color: white; }
.badge-doctor { background: #059669; color: white; }
```

**Animations et Transitions** :
```css
/* Transition rôle */
.role-transition {
  transition: all 0.2s ease-in-out;
}

/* Animation accordéon */
.accordion-enter {
  transform: scaleY(0);
  opacity: 0;
}

.accordion-enter-active {
  transform: scaleY(1);
  opacity: 1;
  transition: transform 150ms ease, opacity 150ms ease;
}
```

**Responsive Mobile** :
```typescript
// Comportement mobile < 768px
const isMobile = useMediaQuery('(max-width: 768px)');

if (isMobile) {
  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-80">
        {/* Même sidebar mais dans Sheet */}
      </SheetContent>
    </Sheet>
  );
}
```

---

## ⚡ OPTIMISATIONS PERFORMANCE

### Cache des Menus
```typescript
// src/hooks/useMenuCache.ts
import { useMemo } from 'react';
import { getMenuForRole } from '@/config/menuDefinitions';

export const useMenuCache = (role: string) => {
  return useMemo(() => {
    return getMenuForRole(role);
  }, [role]);
};
```

### Lazy Loading des Rôles
```typescript
// Charger les rôles seulement quand nécessaire
const [rolesLoaded, setRolesLoaded] = useState(false);

const loadRolesIfNeeded = async (establishmentId: string) => {
  if (rolesLoaded) return availableRoles;
  
  const roles = await loadRolesForEstablishment(establishmentId);
  setRolesLoaded(true);
  return roles;
};
```

### Debounce des Changements
```typescript
import { debounce } from 'lodash';

const debouncedRoleSwitch = debounce(async (role: string) => {
  await switchRole(role);
}, 300);
```

---

## 🔐 GESTION DES PERMISSIONS

### Permissions Granulaires par Rôle
```typescript
// src/config/rolePermissions.ts
export const ROLE_PERMISSIONS = {
  director: [
    'all', // Accès complet
    'manage_staff', 'view_analytics', 'manage_billing', 
    'manage_schedule', 'manage_services', 'consultation',
    'prescription', 'view_dmp', 'edit_dmp'
  ],
  doctor: [
    'consultation', 'prescription', 'view_dmp', 'edit_dmp',
    'order_lab_test', 'view_lab_results', 'admit_patient',
    'view_appointments', 'manage_appointments'
  ],
  nurse: [
    'view_dmp', 'emergency_access', 'triage', 
    'manage_appointments', 'basic_consultation'
  ]
};

// Fonction de vérification
export const hasRolePermission = (
  userRole: string, 
  requiredPermission: string
): boolean => {
  const rolePerms = ROLE_PERMISSIONS[userRole] || [];
  return rolePerms.includes('all') || rolePerms.includes(requiredPermission);
};
```

### Hook de Permissions
```typescript
// src/hooks/usePermissions.ts
export const usePermissions = () => {
  const { currentRole } = useMultiEstablishment();
  
  return {
    canManageStaff: hasRolePermission(currentRole, 'manage_staff'),
    canViewFinances: hasRolePermission(currentRole, 'view_billing'),
    canPrescribe: hasRolePermission(currentRole, 'prescription'),
    canAccessEmergency: hasRolePermission(currentRole, 'emergency_access')
  };
};
```

---

## 🎨 COMPOSANTS AVANCÉS

### Badge de Rôle Dynamique
```typescript
// src/components/professional/RoleBadge.tsx
interface RoleBadgeProps {
  role: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleBadge = ({ role, isActive, size = 'md' }: RoleBadgeProps) => {
  const variant = isActive ? 'default' : 'outline';
  const Icon = ROLE_ICONS[role];

  return (
    <Badge variant={variant} className={`gap-1 ${size === 'lg' ? 'px-3 py-1' : ''}`}>
      {Icon && <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />}
      {ROLE_LABELS[role]}
    </Badge>
  );
};
```

### Tooltip Informatif
```typescript
// src/components/professional/RoleTooltip.tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export const RoleTooltip = ({ role, children }) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <div className="space-y-2">
          <div className="font-semibold">{ROLE_LABELS[role]}</div>
          <div className="text-xs">
            Permissions :
            <ul className="list-disc list-inside mt-1">
              {permissions.slice(0, 3).map(p => (
                <li key={p}>{p}</li>
              ))}
              {permissions.length > 3 && <li>... et {permissions.length - 3} autres</li>}
            </ul>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
```

---

## 📊 MÉTRIQUES ET ANALYTICS

### Tracking des Changements de Rôle
```typescript
// src/utils/roleAnalytics.ts
export const trackRoleSwitch = (
  fromRole: string, 
  toRole: string, 
  establishmentId: string
) => {
  // Analytics internes
  const event = {
    type: 'role_switch',
    timestamp: new Date().toISOString(),
    data: { fromRole, toRole, establishmentId }
  };
  
  // Stocker localement
  const events = JSON.parse(localStorage.getItem('role_switches') || '[]');
  events.push(event);
  localStorage.setItem('role_switches', JSON.stringify(events.slice(-50)));

  // Optionnel : Envoyer à un service d'analytics
  // sendAnalyticsEvent(event);
};
```

### Monitoring Performance
```typescript
// src/hooks/useRolePerformance.ts
export const useRolePerformance = () => {
  const [switchTime, setSwitchTime] = useState(0);
  
  const measureRoleSwitch = async (switchFunction: () => Promise<void>) => {
    const start = performance.now();
    await switchFunction();
    const end = performance.now();
    
    setSwitchTime(end - start);
    console.log(`🚀 Switch de rôle en ${(end - start).toFixed(2)}ms`);
  };
  
  return { switchTime, measureRoleSwitch };
};
```

---

## 🐛 GESTION D'ERREURS AVANCÉE

### Error Boundary Spécialisé
```typescript
// src/components/ErrorBoundary/RoleErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class RoleErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Erreur dans RoleErrorBoundary:', error, errorInfo);
    
    // Remettre à zéro le rôle en cas d'erreur
    localStorage.removeItem('current_role');
    
    // Optionnel : Reporter l'erreur
    // reportError(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <div className="text-red-600 font-semibold">Erreur de rôle</div>
          <div className="text-sm text-muted-foreground mt-2">
            {this.state.errorMessage}
          </div>
          <Button 
            onClick={() => {
              this.setState({ hasError: false, errorMessage: '' });
              window.location.reload();
            }}
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🧪 TESTS AUTOMATISÉS

### Tests Unitaires
```typescript
// src/__tests__/multiRoles.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfessionalHub } from '../pages/professional/ProfessionalHub';

describe('Multi-Roles Functionality', () => {
  test('Dr. DJEKI peut voir ses 2 rôles', async () => {
    // Mock du contexte avec 2 rôles
    const mockContext = {
      availableRoles: ['director', 'doctor'],
      currentRole: 'director'
    };
    
    render(<ProfessionalHub />, { wrapper: TestWrapper });
    
    expect(screen.getByText('DIRECTEUR')).toBeInTheDocument();
    expect(screen.getByText('MÉDECIN')).toBeInTheDocument();
  });

  test('Changement de rôle met à jour le menu', async () => {
    render(<ProfessionalHub />, { wrapper: TestWrapper });
    
    // Cliquer sur MÉDECIN
    fireEvent.click(screen.getByText('MÉDECIN'));
    
    await waitFor(() => {
      expect(screen.queryByText('DIRECTION MÉDICALE')).toBeInTheDocument();
      expect(screen.queryByText('ADMINISTRATION')).not.toBeInTheDocument();
    });
  });

  test('Persistance du rôle dans localStorage', () => {
    const { rerender } = render(<ProfessionalHub />);
    
    // Simuler changement de rôle
    fireEvent.click(screen.getByText('MÉDECIN'));
    
    // Vérifier localStorage
    expect(localStorage.getItem('current_role_cmst-sogara')).toBe('doctor');
    
    // Re-render et vérifier persistance
    rerender(<ProfessionalHub />);
    expect(screen.getByText('MÉDECIN')).toHaveClass('role-active');
  });
});
```

### Tests E2E
```typescript
// cypress/e2e/multiRoles.cy.ts
describe('Multi-Roles E2E', () => {
  it('Dr. DJEKI peut switcher entre ses rôles', () => {
    // Connexion
    cy.visit('/login/professional');
    cy.get('[data-testid="email"]').type('directeur.sogara@sante.ga');
    cy.get('[data-testid="password"]').type('DirecteurSOGARA2024!');
    cy.get('[data-testid="submit"]').click();

    // Vérifier redirection
    cy.url().should('include', '/professional');

    // Vérifier sidebar
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('[data-testid="role-admin"]').should('contain', 'ADMIN');
    cy.get('[data-testid="role-doctor"]').should('contain', 'MÉDECIN');

    // Cliquer sur ADMIN
    cy.get('[data-testid="role-admin"]').click();
    cy.get('[data-testid="menu-section"]').should('have.length', 5);

    // Cliquer sur MÉDECIN  
    cy.get('[data-testid="role-doctor"]').click();
    cy.get('[data-testid="menu-section"]').should('have.length', 4);

    // Vérifier que le changement est instantané (< 500ms)
    cy.get('[data-testid="role-doctor"]').click();
    cy.get('[data-testid="menu-activite-medicale"]').should('be.visible', { timeout: 500 });
  });
});
```

---

## 🔄 WORKFLOW DE DÉVELOPPEMENT

### Commandes de Développement
```bash
# 1. Setup initial
npm install @radix-ui/react-accordion lucide-react

# 2. Migrations base de données  
npm run supabase:migrate

# 3. Seed avec données test
npm run supabase:seed

# 4. Génération des types TypeScript
npm run supabase:types

# 5. Tests
npm run test:unit
npm run test:e2e

# 6. Lancement développement
npm run dev

# 7. Build production
npm run build
npm run preview
```

### Variables d'Environnement
```env
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Debug multi-rôles
VITE_DEBUG_MULTI_ROLES=true
VITE_LOG_ROLE_SWITCHES=true
```

---

## 📈 MONITORING ET LOGS

### Logs Structurés
```typescript
// src/utils/logger.ts
export const roleLogger = {
  roleSwitch: (fromRole: string, toRole: string, duration: number) => {
    console.group('🔄 Role Switch');
    console.log('From:', fromRole);
    console.log('To:', toRole);
    console.log('Duration:', `${duration}ms`);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  },

  menuLoad: (role: string, sectionsCount: number) => {
    console.log(`📋 Menu loaded for ${role}: ${sectionsCount} sections`);
  },

  permissionCheck: (permission: string, granted: boolean) => {
    console.log(`🔐 Permission ${permission}: ${granted ? '✅' : '❌'}`);
  }
};
```

### Dashboard de Debug (Développement)
```typescript
// src/components/dev/MultiRoleDebugger.tsx
export const MultiRoleDebugger = () => {
  const { currentRole, availableRoles, establishments } = useMultiEstablishment();
  
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs">
      <div>Role: {currentRole}</div>
      <div>Available: {availableRoles.join(', ')}</div>
      <div>Establishment: {establishments.length}</div>
    </div>
  );
};
```

---

## 🔧 CONFIGURATION AVANCÉE

### Configuration TypeScript Stricte
```typescript
// tsconfig.json - Partie spécifique aux rôles
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": [
    "src/config/menuDefinitions.ts",
    "src/contexts/MultiEstablishmentContext.tsx",
    "src/types/permissions.ts"
  ]
}
```

### Validation Runtime avec Zod
```typescript
// src/schemas/roleSchemas.ts
import { z } from 'zod';

export const RoleSchema = z.enum(['director', 'admin', 'doctor', 'nurse']);

export const EstablishmentRoleSchema = z.object({
  establishmentId: z.string().uuid(),
  role: RoleSchema,
  permissions: z.array(z.string()),
  isAdmin: z.boolean()
});

// Validation dans le contexte
const validateRoleData = (data: unknown) => {
  return EstablishmentRoleSchema.safeParse(data);
};
```

---

## 🎯 STRUCTURE FINALE COMPLÈTE

```
src/
├── config/
│   ├── menuDefinitions.ts          # ⭐ Définitions complètes des menus
│   └── rolePermissions.ts          # Permissions par rôle
│
├── components/
│   ├── layout/
│   │   ├── ProfessionalEstablishmentLayout.tsx  # ⭐ Layout sidebar + accordéon
│   │   └── MultiEstablishmentDashboard.tsx      # Interface sélection
│   ├── professional/
│   │   ├── RoleBadge.tsx           # Badge dynamique
│   │   ├── RoleTooltip.tsx         # Tooltip informatif
│   │   └── RoleSwitcher.tsx        # Sélecteur avancé
│   └── dev/
│       └── MultiRoleDebugger.tsx   # Debug développement
│
├── pages/professional/
│   └── ProfessionalHub.tsx         # ⭐ Page hub unifiée
│
├── contexts/
│   └── MultiEstablishmentContext.tsx  # ⭐ Contexte étendu avec rôles
│
├── hooks/
│   ├── usePermissions.ts           # Hook permissions
│   ├── useMenuCache.ts             # Cache des menus
│   └── useRolePerformance.ts       # Monitoring performance
│
├── types/
│   └── permissions.ts              # Types existants étendus
│
└── __tests__/
    ├── multiRoles.test.tsx         # Tests unitaires
    └── rolePermissions.test.tsx    # Tests permissions
```

---

## 🎉 VALIDATION FINALE

### Scénarios de Test Complets

**Scénario 1** : Connexion et sélection initiale
```
1. Connexion → directeur.sogara@sante.ga
2. Redirection → /professional
3. Sidebar affiche CMST SOGARA
4. Sous CMST : ADMIN et MÉDECIN visibles
5. Aucun rôle sélectionné → Zone principale avec profil
```

**Scénario 2** : Sélection rôle ADMIN
```
1. Clic sur ADMIN dans sidebar
2. ADMIN devient bleu avec icône →
3. Menu accordéon s'affiche (5 sections)
4. currentRole = 'director'
5. localStorage mis à jour
```

**Scénario 3** : Switch vers MÉDECIN
```
1. Clic sur MÉDECIN dans sidebar
2. ADMIN n'est plus bleu
3. MÉDECIN devient bleu avec icône →
4. Menu change instantanément (4 sections)
5. Sections différentes : pas d'ADMINISTRATION
6. currentRole = 'doctor'
```

**Scénario 4** : Persistance et rechargement
```
1. Rafraîchissement de page (F5)
2. currentRole restauré depuis localStorage
3. Menu correct affiché automatiquement
4. Rôle correct surligné en bleu
```

**Scénario 5** : Permissions
```
1. En mode MÉDECIN
2. Item "Personnel" non visible (pas de permission manage_staff)
3. En mode DIRECTEUR
4. Item "Personnel" visible (permission 'all')
```

---

## ⚡ OPTIMISATIONS FINALES

### Préchargement des Menus
```typescript
// Précharger tous les menus au montage
useEffect(() => {
  if (availableRoles.length > 0) {
    availableRoles.forEach(role => {
      getMenuForRole(role); // Met en cache
    });
  }
}, [availableRoles]);
```

### Raccourcis Clavier
```typescript
// src/hooks/useRoleKeyboard.ts
export const useRoleKeyboard = () => {
  const { switchRole, availableRoles } = useMultiEstablishment();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            if (availableRoles[0]) switchRole(availableRoles[0]);
            break;
          case '2':
            if (availableRoles[1]) switchRole(availableRoles[1]);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [availableRoles, switchRole]);
};
```

---

**🎯 PROMPT COMPLET CRÉÉ !**  
**Total** : 500+ lignes de spécifications techniques  
**Prêt pour implémentation** : ✅  
**Architecture analysée** : ✅  
**Détails complets** : ✅
