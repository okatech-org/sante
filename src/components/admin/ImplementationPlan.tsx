import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Layout,
  FileText,
  MapPin,
  Calendar,
  ClipboardList,
  CheckCircle2,
  Code
} from "lucide-react";

export const ImplementationPlan = () => {
  const phases = [
    {
      id: "phase1",
      title: "Phase 1 : Architecture & Design System",
      icon: Palette,
      color: "from-blue-500/10 to-blue-500/5",
      status: "completed",
      sections: [
        {
          title: "Design System avec Tailwind + shadcn/ui",
          items: [
            "Palette couleurs santé (Vert médical #10B981, Bleu ciel #3B82F6, Rouge #EF4444)",
            "Typographie Inter pour lisibilité optimale",
            "Boutons XXL pour faciliter les clics mobiles",
            "Icônes Lucide React visuelles et explicites",
            "Espacement généreux pour respiration visuelle"
          ]
        },
        {
          title: "Structure de Navigation",
          items: [
            "Barre navigation fixe avec logo + menu hamburger (mobile)",
            "Navigation latérale desktop avec icônes + texte",
            "Bottom Tab Bar mobile (5 onglets max)",
            "8 sections principales : Accueil, RDV, Ordonnances, Résultats, Prestataires, Remboursements, Profil, Paramètres"
          ]
        },
        {
          title: "Pages Fondamentales",
          items: [
            "Landing page avec présentation claire",
            "Pages connexion & inscription",
            "Dashboard patient personnalisé",
            "Page 404 personnalisée"
          ]
        },
        {
          title: "Composants Réutilisables",
          items: [
            "Cards avec ombre douce",
            "Buttons (primary, secondary, outline, danger)",
            "Inputs avec icône et label",
            "Badges colorés pour statuts",
            "Skeleton loaders pour chargements",
            "Toast notifications (succès, erreur, info)"
          ]
        },
        {
          title: "Technologies",
          items: [
            "React 18.3.1 + TypeScript",
            "React Router v6 pour le routing",
            "Tailwind CSS + shadcn/ui",
            "Lucide React pour les icônes",
            "Zustand pour state management léger"
          ]
        }
      ]
    },
    {
      id: "phase2",
      title: "Phase 2 : Landing & Onboarding",
      icon: Layout,
      color: "from-green-500/10 to-green-500/5",
      status: "completed",
      sections: [
        {
          title: "Landing Page",
          items: [
            "Hero : \"La santé de tous, partout, tout le temps\"",
            "2 CTA XXL : Patient / Professionnel de Santé",
            "Section \"Comment ça marche ?\" (3 étapes visuelles)",
            "Services disponibles (Grid 2x3)",
            "Section assurances (CNAMGS, CNSS, Mutuelles)",
            "Footer complet avec liens utiles"
          ]
        },
        {
          title: "Choix Type Utilisateur",
          items: [
            "Grandes cards cliquables : Patient, Médecin, Pharmacie, Laboratoire, Hôpital"
          ]
        },
        {
          title: "Inscription Patient (Multi-étapes)",
          items: [
            "Étape 1 : Informations personnelles (nom, date naissance, sexe, téléphone)",
            "Étape 2 : Adresse (province, ville, quartier)",
            "Étape 3 : Assurance optionnelle (CNAMGS/CNSS/Mutuelle)",
            "Étape 4 : Sécurité (mot de passe + CGU)",
            "Progression visuelle claire (1/4, 2/4, 3/4, 4/4)"
          ]
        },
        {
          title: "Page Connexion",
          items: [
            "Téléphone OU Email",
            "Mot de passe avec option \"Se souvenir\"",
            "Lien mot de passe oublié",
            "Lien création compte"
          ]
        },
        {
          title: "Validations",
          items: [
            "Messages d'erreur en français explicite",
            "Validation côté client (React Hook Form + Zod)",
            "Icônes ✓ vertes pour champs valides"
          ]
        }
      ]
    },
    {
      id: "phase3",
      title: "Phase 3 : Dashboard Patient",
      icon: FileText,
      color: "from-purple-500/10 to-purple-500/5",
      status: "completed",
      sections: [
        {
          title: "Header Fixe",
          items: [
            "Logo SANTE.GA cliquable",
            "Barre recherche : \"Rechercher médecin, pharmacie, hôpital...\"",
            "Menu utilisateur avec photo profil, notifications, déconnexion"
          ]
        },
        {
          title: "Sidebar Navigation",
          items: [
            "Accueil, Mes RDV, Mes Ordonnances, Mes Résultats",
            "Mon Dossier Médical, Trouver Prestataire",
            "Remboursements CNAMGS, Aide & Support",
            "Badges compteurs si nouveautés"
          ]
        },
        {
          title: "Vue d'Ensemble - Sections",
          items: [
            "A. Statut Assurance : CNAMGS/CNSS avec taux couverture et plafond",
            "B. Prochains RDV : Liste chronologique avec actions (voir, annuler)",
            "C. Ordonnances Actives : Badge \"Nouvelle\" si <48h, statut dispensation",
            "D. Résultats Récents : Badge \"Nouveau\", téléchargement PDF",
            "E. Raccourcis Rapides : Trouver médecin, Pharmacies garde, Téléconsult, Hôpitaux"
          ]
        },
        {
          title: "Mobile Bottom Tab Bar",
          items: [
            "5 onglets : Accueil, Recherche, Nouveau RDV (central), Ordonnances, Profil"
          ]
        },
        {
          title: "États Vides",
          items: [
            "Illustrations amicales pour sections vides",
            "Messages encourageants avec CTA clairs",
            "Boutons d'action pour chaque section"
          ]
        },
        {
          title: "Responsive",
          items: [
            "Desktop : Sidebar fixe + Grid 2 colonnes",
            "Tablet : Sidebar cachée (hamburger) + Grid 2 colonnes",
            "Mobile : Bottom tab + Stack vertical"
          ]
        }
      ]
    },
    {
      id: "phase4",
      title: "Phase 4 : Recherche & Géolocalisation",
      icon: MapPin,
      color: "from-orange-500/10 to-orange-500/5",
      status: "completed",
      sections: [
        {
          title: "Barre Recherche Principale",
          items: [
            "Input large avec autocomplete",
            "Suggestions : \"Cardiologue à Libreville\", \"Pharmacie de garde\"...",
            "Bouton \"Ma position\" avec GPS",
            "Bouton \"Filtres avancés\" (sidebar/drawer)"
          ]
        },
        {
          title: "Filtres Avancés (Sidebar/Drawer)",
          items: [
            "Type prestataire : Médecins, Spécialistes, Pharmacies, Laboratoires, Hôpitaux",
            "Localisation : Province, Ville, Rayon (5/10/20/50 km)",
            "Disponibilité : Ouvert maintenant, 24h/24, Accepte nouveaux patients",
            "Assurance : CNAMGS, CNSS, Mutuelles",
            "Services : Téléconsult, RDV en ligne, Paiement en ligne, Imagerie, Urgences"
          ]
        },
        {
          title: "Résultats - Vue Liste",
          items: [
            "Tri : Pertinence / Distance / Note",
            "Compteur résultats",
            "Cards détaillées par type (Médecin, Pharmacie, Hôpital)",
            "Infos : Photo, Note, Distance, Horaires, Tarifs CNAMGS, Actions",
            "Scroll infini ou pagination"
          ]
        },
        {
          title: "Résultats - Vue Carte",
          items: [
            "Carte interactive Gabon (Leaflet/Mapbox)",
            "Marqueurs clusterisés par type (couleurs différentes)",
            "Popup mini-card au clic",
            "Bouton recentrage sur position utilisateur",
            "Légende des couleurs"
          ]
        },
        {
          title: "Modal Profil Prestataire",
          items: [
            "Photo + Infos principales + N° CNOM",
            "Coordonnées complètes + Carte miniature",
            "Horaires détaillés + Badge \"Ouvert maintenant\"",
            "Tarifs & Assurances acceptées",
            "Spécialités médicales + Équipements",
            "Avis patients (derniers 5)",
            "Actions : Appeler, Itinéraire, Prendre RDV"
          ]
        },
        {
          title: "Responsive",
          items: [
            "Desktop : Sidebar filtres fixe + Résultats + Carte (toggle)",
            "Mobile : Filtres drawer + Stack résultats + Carte plein écran"
          ]
        }
      ]
    },
    {
      id: "phase5",
      title: "Phase 5 : Prise de Rendez-vous",
      icon: Calendar,
      color: "from-pink-500/10 to-pink-500/5",
      status: "completed",
      sections: [
        {
          title: "Déclenchement",
          items: [
            "Bouton \"Prendre RDV\" depuis recherche prestataire",
            "Bouton \"Nouveau RDV\" depuis dashboard",
            "Lien direct depuis profil prestataire"
          ]
        },
        {
          title: "Étape 1/4 : Type Consultation",
          items: [
            "2 grandes cards sélectionnables",
            "Consultation au cabinet : Examen physique complet",
            "Téléconsultation : Rapide, idéal renouvellement ordonnance",
            "Prérequis affichés si téléconsult"
          ]
        },
        {
          title: "Étape 2/4 : Date & Heure",
          items: [
            "Layout 2 colonnes (stack mobile)",
            "Calendrier interactif (react-day-picker)",
            "Créneaux horaires par demi-journée (Matin/Après-midi)",
            "États : Disponible, Complet, Sélectionné",
            "Badges informatifs (dernier créneau, plusieurs dispos)"
          ]
        },
        {
          title: "Étape 3/4 : Motif & Informations",
          items: [
            "Textarea motif principal (200 caractères max)",
            "Première consultation ? (Oui/Non radio)",
            "Documents à apporter (checklist optionnelle)",
            "Informations importantes : allergies, traitements (300 caractères)"
          ]
        },
        {
          title: "Étape 4/4 : Paiement & Confirmation",
          items: [
            "Récapitulatif visuel complet",
            "Tarification détaillée avec calcul CNAMGS (Part 80%, Ticket modérateur 20%, GAP)",
            "Mode paiement : Mobile Money (Airtel/Moov), Carte Bancaire, Sur place",
            "Checkbox conditions d'annulation obligatoire",
            "Bouton \"Confirmer\" sticky bottom"
          ]
        },
        {
          title: "Page Confirmation",
          items: [
            "Animation checkmark vert",
            "Card récapitulative",
            "Actions : PDF, Email, SMS, Calendrier (Google Cal/iCal)",
            "Timeline prochaines étapes",
            "Navigation : Accueil, Mes rendez-vous"
          ]
        },
        {
          title: "Responsive & Validations",
          items: [
            "Desktop : Modal large (70%) avec stepper horizontal",
            "Mobile : Page plein écran avec stepper vertical",
            "Loader & Skeleton pendant chargements",
            "Validation Zod temps réel",
            "Messages erreur en français"
          ]
        }
      ]
    },
    {
      id: "phase6",
      title: "Phase 6 : Gestion Rendez-vous",
      icon: ClipboardList,
      color: "from-cyan-500/10 to-cyan-500/5",
      status: "completed",
      sections: [
        {
          title: "Header Page",
          items: [
            "Titre \"Mes Rendez-vous\"",
            "Bouton CTA \"+ Nouveau RDV\"",
            "Statistiques rapides : X RDV à venir, X passés, X annulations"
          ]
        },
        {
          title: "Filtres & Tabs",
          items: [
            "Tabs : À venir (badge), Passés, Annulés",
            "Filtres dropdown : Type, Praticien, Date (semaine/mois/personnalisé)"
          ]
        },
        {
          title: "Liste RDV À Venir",
          items: [
            "Timeline verticale avec dates",
            "Badge \"AUJOURD'HUI\" si jour même",
            "Cards détaillées : Heure, Praticien, Motif, Lieu/Téléconsult",
            "Statut paiement, Countdown dynamique (Dans X heures/jours)",
            "Actions : Appeler, Taxi, Payer, Modifier, Annuler"
          ]
        },
        {
          title: "Cards par Type",
          items: [
            "Consultation présentielle : Praticien + Lieu + Itinéraire",
            "Téléconsultation : Badge spécifique + Lien si proche",
            "Examen : Laboratoire + Instructions (ex: À jeun 12h) + Prescripteur"
          ]
        },
        {
          title: "Liste RDV Passés",
          items: [
            "Groupés par mois (JANVIER 2025, DÉCEMBRE 2024...)",
            "Cards condensées",
            "Documents associés : Compte-rendu, Ordonnance, Résultats (boutons téléchargement)"
          ]
        },
        {
          title: "Liste RDV Annulés",
          items: [
            "Infos annulation : Date, Par qui (patient/praticien)",
            "Remboursement : Montant + Pourcentage + Statut (Remboursé/En cours)"
          ]
        },
        {
          title: "Modal Détails RDV",
          items: [
            "Badge statut, Date complète",
            "Sections : Praticien, Détails consult, Localisation/Lien téléconsult",
            "Paiement : Montant, Mode, Numéro transaction, Reçu téléchargeable",
            "Documents associés téléchargeables",
            "Actions : Modifier (si >24h), Annuler, Reprendre RDV"
          ]
        },
        {
          title: "Modal Annulation",
          items: [
            "Warning visuel",
            "Infos RDV + Politique remboursement (>24h: 100%, <24h: 50%, <2h: 0%)",
            "Calcul remboursement automatique",
            "Motif annulation optionnel (dropdown + textarea si Autre)",
            "Boutons : Non garder / Oui annuler (danger)"
          ]
        },
        {
          title: "Notifications & Rappels",
          items: [
            "Affichage rappels programmés (SMS 24h avant, Notif 1h avant)",
            "Email confirmation envoyé"
          ]
        },
        {
          title: "États Vides",
          items: [
            "Illustrations + Messages selon section vide",
            "CTAs adaptés : Trouver praticien, etc."
          ]
        },
        {
          title: "Fonctionnalités Avancées",
          items: [
            "Badge \"RDV imminent\" si <2h (pulse animation)",
            "Countdown dynamique temps réel",
            "Refresh auto toutes les 5 min si RDV aujourd'hui",
            "Notifications browser si <1h",
            "Export calendrier (.ics)"
          ]
        },
        {
          title: "Responsive",
          items: [
            "Desktop : Cards 2 colonnes timeline",
            "Tablet : Cards 1 colonne timeline",
            "Mobile : Stack vertical, cards condensées"
          ]
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-success border-success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="text-warning border-warning">
            ⏳ En cours
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            📅 Planifié
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Code className="h-5 w-5 sm:h-6 sm:w-6" />
            Plan d&apos;Implémentation Lovable
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Roadmap détaillée des 6 phases de développement de SANTE.GA avec Lovable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 sm:p-6 rounded-lg border bg-primary/5">
            <h3 className="font-semibold text-base sm:text-lg mb-3">Contexte Critique</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Utilisateurs gabonais peu habitués à la navigation web</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Interface ULTRA simple, intuitive, mobile-first</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Langue : Français uniquement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Design moderne mais sobre (pas de surcharge visuelle)</span>
              </li>
            </ul>
          </div>

          <Separator />

          <Accordion type="multiple" className="w-full space-y-4">
            {phases.map((phase) => {
              const PhaseIcon = phase.icon;
              return (
                <AccordionItem 
                  key={phase.id} 
                  value={phase.id}
                  className={`rounded-lg border bg-gradient-to-br ${phase.color} overflow-hidden`}
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                    <div className="flex items-start gap-3 sm:gap-4 text-left flex-1">
                      <div className="p-2 rounded-lg bg-background flex-shrink-0">
                        <PhaseIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-2">
                          {phase.title}
                        </h3>
                        {getStatusBadge(phase.status)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4">
                    <div className="space-y-4 ml-0 sm:ml-14">
                      {phase.sections.map((section, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="font-semibold text-sm sm:text-base text-primary">
                            {section.title}
                          </h4>
                          <ul className="space-y-2">
                            {section.items.map((item, itemIdx) => (
                              <li 
                                key={itemIdx} 
                                className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground p-2 rounded hover:bg-background/50 transition-colors"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          {idx < phase.sections.length - 1 && (
                            <Separator className="my-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Separator />

          <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-success/10 to-transparent">
            <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Résultat Final
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Une plateforme e-santé complète, moderne et intuitive, spécialement conçue pour 
              les utilisateurs gabonais avec une attention particulière à l&apos;accessibilité et 
              la simplicité d&apos;utilisation. Chaque phase du développement a été pensée pour 
              construire progressivement un écosystème de santé numérique cohérent et fonctionnel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
