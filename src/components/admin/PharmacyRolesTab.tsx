// ============================================
// COMPONENT: PharmacyRolesTab
// Description: Affichage des rôles pharmaceutiques
// ============================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PHARMACY_ROLES, 
  PHARMACY_ROLE_CATEGORIES,
  PharmacyRoleType,
  GABON_PHARMACY_CONTEXT
} from "@/types/pharmacy-roles";
import { 
  CheckCircle, 
  GraduationCap, 
  Shield, 
  Users,
  AlertCircle,
  MapPin,
  TrendingDown
} from "lucide-react";

export const PharmacyRolesTab = () => {
  return (
    <div className="space-y-6">
      {/* Contexte Gabonais - Alerte */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <CardTitle className="text-lg text-orange-900">
                Contexte Pharmaceutique au Gabon
              </CardTitle>
              <p className="text-sm text-orange-700 mt-2">
                Défis majeurs du secteur pharmaceutique gabonais
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Défis Identifiés
            </p>
            <ul className="text-sm text-orange-800 space-y-1">
              {GABON_PHARMACY_CONTEXT.challenges.map((challenge, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Couverture Territoriale
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-orange-800">
              <div>
                <span className="font-medium">Libreville:</span> {GABON_PHARMACY_CONTEXT.coverage.libreville}
              </div>
              <div>
                <span className="font-medium">Port-Gentil:</span> {GABON_PHARMACY_CONTEXT.coverage.port_gentil}
              </div>
              <div>
                <span className="font-medium">Franceville:</span> {GABON_PHARMACY_CONTEXT.coverage.franceville}
              </div>
              <div>
                <span className="font-medium">Oyem:</span> {GABON_PHARMACY_CONTEXT.coverage.oyem}
              </div>
            </div>
            <p className="text-xs text-orange-700 mt-2 italic">
              ⚠️ 4 provinces sans pharmacie privée: {GABON_PHARMACY_CONTEXT.coverage.provinces_sans_pharmacie.join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rôles par catégorie */}
      {Object.entries(PHARMACY_ROLE_CATEGORIES).map(([categoryKey, category]) => (
        <Card key={categoryKey}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {category.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.roles.map((roleType) => {
              const role = PHARMACY_ROLES[roleType];
              return (
                <div 
                  key={role.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-base">{role.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role.description}
                      </p>
                    </div>
                    {role.requirements.inscription_onpg && (
                      <Badge variant="default" className="bg-primary">
                        ONPG
                      </Badge>
                    )}
                  </div>

                  {/* Prérequis */}
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                          Formation Requise
                        </p>
                        <p className="text-sm font-medium">
                          {role.requirements.formation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      {role.requirements.inscription_onpg && (
                        <div className="flex items-center gap-1 text-primary">
                          <Shield className="h-3 w-3" />
                          <span className="font-medium">Inscription ONPG obligatoire</span>
                        </div>
                      )}
                      {role.requirements.nationalite_gabonaise && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="h-3 w-3" />
                          <span className="font-medium">Nationalité gabonaise requise</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Responsabilités */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Responsabilités
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-sm">
                      {role.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1 text-xs">✓</span>
                          <span className="text-muted-foreground">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Note de bas de page */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">
                Intégration avec SANTE.GA
              </p>
              <ul className="space-y-1 text-blue-800">
                <li>• Gestion des ordonnances électroniques</li>
                <li>• Vérification de disponibilité des stocks en temps réel</li>
                <li>• Facturation CNAMGS automatique (tiers-payant)</li>
                <li>• Alerte interactions médicamenteuses</li>
                <li>• Géolocalisation des pharmacies 24/7</li>
                <li>• Connexion avec UbiPharm Gabon (grossiste national)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
