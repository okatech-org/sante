import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  Lock,
  Calendar,
  Search,
  CreditCard,
  Bell,
  CheckCircle2,
  AlertCircle,
  Server,
  Code2,
  Pill,
  FileCheck
} from "lucide-react";

export const BackendImplementationPlan = () => {
  const phases = [
    {
      id: "cursor1",
      title: "Prompt 1 : Architecture Backend Convex - Fondations",
      icon: Database,
      color: "from-purple-500/10 to-purple-500/5",
      status: "planned",
      sections: [
        {
          title: "Installation Convex",
          code: "npm install convex\nnpx convex dev",
          items: []
        },
        {
          title: "Structure Dossiers convex/",
          items: [
            "_generated/ (auto-généré par Convex)",
            "schema.ts (schéma complet DB)",
            "auth.ts (authentification)",
            "users/ (patients, medecins, pharmacies, laboratoires, hopitaux)",
            "appointments/ (create, update, cancel, list)",
            "prescriptions/ (create, list)",
            "assurances/ (cnamgs, cnss)",
            "recherche/ (prestataires)",
            "paiements/ (mobile-money, stripe)",
            "utils/ (notifications, validators)"
          ]
        },
        {
          title: "Schéma de Base - Tables Principales",
          items: [
            "users : Authentification + rôles (patient, médecin, pharmacie, labo, hôpital, admin)",
            "patients : Profil patient complet (identité, adresse GPS, assurances, allergies)",
            "medecins : Profil médecin (CNOM, spécialités, cabinet, horaires, tarifs CNAMGS)",
            "rendezvous : Gestion RDV (type, statut, paiement, annulation, documents)",
            "ordonnances : Ordonnances électroniques (médicaments, dispensation, QR code)",
            "pharmacies, laboratoires, hopitaux : Structures médicales",
            "resultats_examens : Résultats laboratoire/imagerie"
          ]
        },
        {
          title: "Index de Recherche Optimisés",
          items: [
            "by_telephone, by_email, by_clerk_id sur users",
            "by_user_id, by_telephone sur patients",
            "by_numero_cnom, by_province_ville sur medecins",
            "search_nom avec filterFields sur medecins (recherche textuelle)",
            "by_patient_id, by_medecin_id, by_date_rdv sur rendezvous",
            "by_patient_date index composé pour requêtes optimales"
          ]
        },
        {
          title: "Types TypeScript Convex",
          items: [
            "Utilisation de v.union() pour énumérations (role, statut, type)",
            "v.object() pour structures imbriquées (adresse GPS, assurances)",
            "v.array() pour listes (spécialités, médicaments, documents)",
            "v.id() pour références entre tables",
            "v.optional() pour champs facultatifs",
            "Validation automatique des données à l'insertion"
          ]
        }
      ]
    },
    {
      id: "cursor2",
      title: "Prompt 2 : API Rendez-vous Backend",
      icon: Calendar,
      color: "from-blue-500/10 to-blue-500/5",
      status: "planned",
      sections: [
        {
          title: "convex/appointments/create.ts",
          items: [
            "createRendezvous mutation : Création RDV avec validation complète",
            "Vérification disponibilité créneau (conflits horaires)",
            "Calcul automatique durée consultation",
            "Récupération adresse médecin pour RDV présentiel",
            "Génération lien unique téléconsultation (WebRTC room)",
            "Gestion statut paiement (confirmé si payé, en_attente sinon)",
            "Programmation rappels SMS automatiques (confirmation immédiate, 24h avant, 1h avant)",
            "Utilisation ctx.scheduler.runAfter() pour rappels différés"
          ]
        },
        {
          title: "convex/appointments/cancel.ts",
          items: [
            "cancelRendezvous mutation : Annulation avec politique remboursement",
            "Calcul délai annulation (>24h: 100%, <24h: 50%, <2h: 0%)",
            "Validation statut (impossible si déjà annulé ou terminé)",
            "Mise à jour statut paiement (rembourse_partiel/total)",
            "Déclenchement processus remboursement automatique (Mobile Money/Stripe)",
            "Envoi notification annulation (SMS/Push)"
          ]
        },
        {
          title: "convex/appointments/list.ts",
          items: [
            "getRendezvousPatient query : Liste RDV avec enrichissement",
            "Filtres : statut (confirmé/terminé/annulé), période (dateDebut/dateFin)",
            "Enrichissement avec données praticien (jointure manuelle)",
            "Tri chronologique adapté (à venir: ascendant, passés: descendant)",
            "countRendezvousAvenir query : Compteur badge dashboard"
          ]
        },
        {
          title: "Fonctionnalités Avancées",
          items: [
            "getCreneauxDisponibles : Génération créneaux 30 min selon horaires médecin",
            "Exclusion créneaux déjà réservés (éviter conflits)",
            "Gestion pauses déjeuner dans horaires",
            "Blocage créneaux passés",
            "Affichage capacité restante par jour"
          ]
        }
      ]
    },
    {
      id: "cursor3",
      title: "Prompt 3 : Recherche & Géolocalisation Backend",
      icon: Search,
      color: "from-green-500/10 to-green-500/5",
      status: "planned",
      sections: [
        {
          title: "convex/recherche/prestataires.ts",
          items: [
            "rechercherMedecins query : Recherche multi-critères avancée",
            "Formule Haversine pour calcul distance GPS précise",
            "Filtres géographiques : province, ville, rayon (km)",
            "Filtres spécialité (correspondance partielle)",
            "Filtres disponibilité : ouvertMaintenant (vérification horaires temps réel)",
            "Filtres assurance : CNAMGS, CNSS, mutuelles spécifiques",
            "Recherche textuelle (nom médecin, toLowerCase)",
            "Tri intelligent : par distance si GPS fourni, sinon par note",
            "Pagination : offset/limit avec métadonnées (total, pages)"
          ]
        },
        {
          title: "Logique Horaires \"Ouvert Maintenant\"",
          items: [
            "Récupération jour actuel (dimanche=0, lundi=1...)",
            "Conversion heure actuelle format HH:MM",
            "Vérification horaire.ouvert = true",
            "Comparaison heureActuelle >= heureDebut && <= heureFin",
            "Gestion pauses (exclusion si dans pause déjeuner)"
          ]
        },
        {
          title: "Optimisations Performance",
          items: [
            "Index composés pour requêtes fréquentes (by_province_ville)",
            "searchIndex pour recherche textuelle performante",
            "Filtres base de données AVANT post-processing",
            "Calcul distance uniquement si position user fournie",
            "Limitation résultats (max 20 par page)"
          ]
        },
        {
          title: "APIs Similaires à Créer",
          items: [
            "rechercherPharmacies : Filtres garde 24/7, Mobile Money",
            "rechercherLaboratoires : Filtres types analyses (biologie, imagerie)",
            "rechercherHopitaux : Filtres urgences, IRM/Scanner disponible",
            "suggererPrestataireProche : Auto-suggestion selon géoloc"
          ]
        }
      ]
    },
    {
      id: "cursor4",
      title: "Prompt 4 : Ordonnances & Résultats Backend",
      icon: Pill,
      color: "from-indigo-500/10 to-indigo-500/5",
      status: "planned",
      sections: [
        {
          title: "convex/prescriptions/create.ts",
          items: [
            "creerOrdonnance mutation : Création ordonnance électronique par médecin",
            "Génération numéro unique format ORD-YYYY-XXXXXX",
            "Calcul automatique date expiration (3 mois)",
            "Génération QR Code pour vérification pharmacie (contient données sérialisées)",
            "Création PDF ordonnance (action asynchrone avec scheduler)",
            "Notification patient (SMS + Push) ordonnance disponible",
            "Notification pharmacie suggérée si spécifiée",
            "Support médicaments multiples avec posologie détaillée"
          ]
        },
        {
          title: "Vérification & Dispensation Ordonnances",
          items: [
            "verifierOrdonnance query : Validation par pharmacie (numéro ou ID)",
            "Vérifications : expiration (3 mois), statut (annulée/dispensée), validité",
            "Enrichissement avec profils patient et médecin",
            "dispenserOrdonnance mutation : Enregistrement dispensation par pharmacie",
            "Gestion dispensation partielle vs complète",
            "Historique dispensations (pharmacie, date, médicaments, montant)",
            "Mise à jour statut automatique (active → dispensée_partielle/complète)",
            "Notification patient après dispensation"
          ]
        },
        {
          title: "Liste & Compteurs Ordonnances",
          items: [
            "getOrdonnancesPatient query : Liste avec filtres statut",
            "Enrichissement avec données médecin prescripteur",
            "Tri chronologique descendant (plus récentes en premier)",
            "countNouvellesOrdonnances : Badge \"Nouvelles\" si <48h",
            "Calcul seuil temporel pour badge notification",
            "Pagination avec limite configurable (défaut 50)"
          ]
        },
        {
          title: "convex/resultats/create.ts - Résultats Examens",
          items: [
            "Table resultats_examens : Biologie + Imagerie unifiée",
            "creerResultatExamen mutation : Création par laboratoire/centre imagerie",
            "Génération numéro résultat format BIO-YYYY-XXXXXX ou IMG-YYYY-XXXXXX",
            "Support analyses biologiques avec valeurs, unités, normes (min/max)",
            "Détection automatique valeurs critiques (hors normes)",
            "Support imagerie : type (Radio/IRM/Scanner/Écho), compte-rendu, images DICOM",
            "Upload PDF résultat (stockage Convex Storage)",
            "Notification patient résultat disponible"
          ]
        },
        {
          title: "Alertes Valeurs Critiques",
          items: [
            "Détection automatique valeurCritique dans analyses",
            "Notification URGENCE médecin prescripteur si valeurs critiques",
            "Notification normale médecin sinon",
            "Système double notification : patient + médecin",
            "Flag vuParPatient et vuParMedecin pour tracking",
            "marquerResultatVu mutation : Marquer résultat comme consulté"
          ]
        },
        {
          title: "Liste & Compteurs Résultats",
          items: [
            "getResultatsPatient query : Liste avec filtre type (biologie/imagerie)",
            "Enrichissement médecin prescripteur + laboratoire",
            "Tri chronologique descendant",
            "countNouveauxResultats : Badge si <48h et non vus",
            "Support téléchargement PDF via pdfUrl",
            "Visualisation images DICOM (URLs multiples)"
          ]
        },
        {
          title: "Intégration Pharmacies",
          items: [
            "rechercherPharmacies query : Recherche avec filtres géolocalisés",
            "Filtres : ouvert 24/7, conventionné CNAMGS, Mobile Money accepté",
            "Calcul distance GPS similaire médecins",
            "Tri par distance ou note",
            "Support recherche garde de nuit/weekend",
            "Badge \"Ouvert maintenant\" selon horaires"
          ]
        },
        {
          title: "Intégration Hôpitaux",
          items: [
            "rechercherHopitaux query : Recherche établissements",
            "Filtres : urgences 24/7, services spécialisés (IRM, Scanner, Labo)",
            "Support multi-spécialités (Chirurgie, Maternité, Pédiatrie...)",
            "Capacité lits disponibles (optionnel)",
            "Services ambulance disponibles",
            "Conventionnement CNAMGS avec tarifs spécifiques"
          ]
        },
        {
          title: "Recherche Unifiée",
          items: [
            "rechercherTousPrestataires query : Multi-types simultanés",
            "Array types : [medecin, pharmacie, laboratoire, hopital]",
            "Agrégation résultats tous types",
            "Tri global par distance (si GPS fourni)",
            "Tag type sur chaque résultat pour affichage différencié",
            "Pagination unifiée sur résultats mixtes"
          ]
        }
      ]
    },
    {
      id: "cursor5",
      title: "Prompt 5 : Paiements Mobile Money & Stripe",
      icon: CreditCard,
      color: "from-orange-500/10 to-orange-500/5",
      status: "planned",
      sections: [
        {
          title: "convex/paiements/mobile-money.ts",
          items: [
            "initierPaiementMobileMoney mutation : Intégration API Airtel/Moov",
            "Génération transaction unique ID",
            "Envoi code USSD push au numéro patient",
            "Webhook callback confirmation paiement",
            "Mise à jour statut RDV automatique si succès",
            "Gestion erreurs (fonds insuffisants, timeout)",
            "Logs transactions pour audit"
          ]
        },
        {
          title: "convex/paiements/stripe.ts",
          items: [
            "createPaymentIntent mutation : Création session Stripe",
            "Conversion FCFA → EUR pour Stripe (taux fixe ou API)",
            "Gestion webhooks Stripe (payment_intent.succeeded)",
            "Validation 3D Secure obligatoire",
            "Remboursements automatiques via Stripe Refunds API"
          ]
        },
        {
          title: "Sécurité Paiements",
          items: [
            "Validation montant côté serveur (jamais confiance client)",
            "Vérification signature webhooks (HMAC SHA256)",
            "Secrets API stockés dans variables environnement Convex",
            "Logs chiffrés des transactions sensibles",
            "PCI-DSS compliance via Stripe"
          ]
        },
        {
          title: "processRefund Action",
          items: [
            "Détection mode paiement original (Mobile Money ou Stripe)",
            "Appel API remboursement correspondante",
            "Mise à jour statut_paiement : rembourse_partiel/total",
            "Notification patient (SMS + Email)",
            "Délai remboursement : 24-48h Mobile Money, instantané Stripe"
          ]
        }
      ]
    },
    {
      id: "cursor6",
      title: "Prompt 6 : Notifications SMS & Push",
      icon: Bell,
      color: "from-pink-500/10 to-pink-500/5",
      status: "planned",
      sections: [
        {
          title: "convex/utils/notifications.ts",
          items: [
            "sendConfirmationSMS action : Confirmation RDV immédiate",
            "sendRappelSMS action : Rappels 24h et 1h avant RDV",
            "sendAnnulationSMS action : Notification annulation + remboursement",
            "Intégration API SMS Gabon (exemple: Africa's Talking, Twilio)",
            "Templates SMS en français adaptés contexte gabonais",
            "Personnalisation : nom patient, praticien, date/heure, montant"
          ]
        },
        {
          title: "Templates SMS Standards",
          items: [
            "Confirmation : \"Votre RDV avec Dr KOMBILA le 16/01 à 10h est confirmé. Montant payé: 9000 FCFA. - SANTE.GA\"",
            "Rappel 24h : \"Rappel: RDV demain 16/01 à 10h avec Dr KOMBILA, Cabinet Montagne Sainte. - SANTE.GA\"",
            "Rappel 1h : \"Votre RDV dans 1h. Lien téléconsult: https://sante.ga/tc/xxx ou Itinéraire: maps.app.goo.gl/xxx\"",
            "Annulation : \"RDV du 16/01 annulé. Remboursement 9000 FCFA sous 48h. - SANTE.GA\""
          ]
        },
        {
          title: "Push Notifications (Web Push API)",
          items: [
            "Enregistrement service worker navigateur",
            "Demande permission notifications utilisateur",
            "Stockage subscription dans profil patient",
            "Envoi notifs push via Firebase Cloud Messaging (FCM)",
            "Badges compteurs (nouveaux RDV, ordonnances, résultats)"
          ]
        },
        {
          title: "Schedulers Convex",
          items: [
            "ctx.scheduler.runAfter(delai, action, args)",
            "Calcul précis delai = dateRdv - now() - offset",
            "Annulation rappels si RDV annulé (cancel scheduled jobs)",
            "Retry automatique en cas d'échec envoi",
            "Logs envois pour debugging"
          ]
        }
      ]
    },
    {
      id: "cursor7",
      title: "Prompt 7 : Authentification Clerk + Convex Auth",
      icon: Lock,
      color: "from-cyan-500/10 to-cyan-500/5",
      status: "planned",
      sections: [
        {
          title: "Configuration Clerk",
          items: [
            "Installation @clerk/clerk-react",
            "Configuration ClerkProvider dans main.tsx",
            "Création compte Clerk + API keys (publishable + secret)",
            "Configuration méthodes connexion : Téléphone (+241), Email, Google",
            "Personnalisation UI Clerk (français, couleurs SANTE.GA)"
          ]
        },
        {
          title: "Intégration Convex Auth",
          items: [
            "Installation convex-helpers/react-clerk",
            "Configuration ConvexProviderWithClerk",
            "Synchronisation Clerk userId → Convex users.clerkId",
            "Trigger onUserCreated : création automatique profil patient",
            "Middleware authentification : ctx.auth.getUserIdentity()"
          ]
        },
        {
          title: "Sécurité Backend Convex",
          items: [
            "Toutes mutations/queries protégées par ctx.auth",
            "Vérification userId === patient.userId avant actions sensibles",
            "Rôles stockés dans users.role (jamais confiance client)",
            "Fonction has_role() pour vérification permissions admin",
            "Rate limiting sur API sensibles (anti-spam)"
          ]
        },
        {
          title: "Gestion Sessions",
          items: [
            "Sessions Clerk : JWT auto-refresh (7 jours validité)",
            "Stockage localStorage clé session (chiffré)",
            "Hook useConvexAuth() : loading, isAuthenticated, userId",
            "Redirection automatique /login si non authentifié",
            "Logout : suppression token + redirection"
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
          <Badge variant="outline" className="text-muted-foreground">
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
            <Server className="h-5 w-5 sm:h-6 sm:w-6" />
            Plan d&apos;Implémentation Backend Cursor
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Architecture backend complète avec Convex pour SANTE.GA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Convex</strong> est une plateforme backend serverless qui remplace 
              traditionnellement un backend Node.js + PostgreSQL. Elle offre une base de données 
              réactive temps réel, des fonctions serverless TypeScript, et une synchronisation 
              automatique client-serveur.
            </AlertDescription>
          </Alert>

          <div className="p-4 sm:p-6 rounded-lg border bg-primary/5">
            <h3 className="font-semibold text-base sm:text-lg mb-3">Pourquoi Convex pour SANTE.GA ?</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Temps réel natif</strong> : Synchronisation instantanée des RDV, ordonnances</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>TypeScript end-to-end</strong> : Typage fort partagé frontend-backend</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Serverless auto-scalable</strong> : Gère automatiquement la montée en charge</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Schedulers intégrés</strong> : Rappels SMS automatiques sans cron jobs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Hébergement gratuit</strong> : Jusqu&apos;à 1M requêtes/mois (idéal MVP)</span>
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
                          <h4 className="font-semibold text-sm sm:text-base text-primary flex items-center gap-2">
                            {section.title}
                          </h4>
                          {section.code && (
                            <div className="p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">
                              <pre>{section.code}</pre>
                            </div>
                          )}
                          {section.items.length > 0 && (
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
                          )}
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

          <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-warning/10 to-transparent">
            <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Points d&apos;Attention Critiques
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <Code2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Secrets API</strong> : Stocker clés Airtel/Moov/Stripe dans variables 
                  environnement Convex (jamais hardcodé)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Code2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Validation serveur</strong> : TOUJOURS valider inputs côté backend 
                  (jamais confiance client)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Code2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Données sensibles</strong> : Chiffrer numéros téléphone, adresses email 
                  (conformité RGPD)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Code2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Rate limiting</strong> : Limiter appels API SMS (éviter spam/coûts excessifs)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Code2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Tests webhooks</strong> : Utiliser ngrok pour tester webhooks Mobile Money/Stripe 
                  en local
                </div>
              </li>
            </ul>
          </div>

          <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-success/10 to-transparent">
            <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Résultat Final Backend
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Un backend Convex complet, sécurisé et scalable qui gère l&apos;intégralité de la 
              logique métier de SANTE.GA : authentification, rendez-vous, paiements, notifications, 
              recherche géolocalisée.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-background border">
                <p className="font-semibold mb-1">Temps réel</p>
                <p className="text-muted-foreground">Synchro RDV instantanée</p>
              </div>
              <div className="p-3 rounded bg-background border">
                <p className="font-semibold mb-1">Serverless</p>
                <p className="text-muted-foreground">0 gestion infrastructure</p>
              </div>
              <div className="p-3 rounded bg-background border">
                <p className="font-semibold mb-1">TypeScript</p>
                <p className="text-muted-foreground">Type-safe end-to-end</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
