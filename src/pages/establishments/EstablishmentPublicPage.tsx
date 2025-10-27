import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Award,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Key,
  Heart,
  Zap,
  TrendingUp,
  Menu,
  X,
  Stethoscope,
  LogIn,
  ArrowRight
} from "lucide-react";

// Données des établissements (à remplacer par des vraies données depuis Supabase)
const ESTABLISHMENTS_DATA: Record<string, any> = {
  'cmst-sogara': {
    id: 'cmst-sogara',
    name: 'CMST SOGARA',
    logo: '🏥',
    tagline: 'Soins de Qualité, Santé au Travail',
    heroTitle: 'Votre Santé au Travail, Notre Priorité',
    heroSubtitle: 'Médecine du Travail de Excellence | Services Professionnels | Soins Complets',
    type: 'Clinique',
    sector: 'Privé',
    city: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    address: 'Route de la Sogara',
    phone: '+241 01 55 26 21',
    email: 'contact@cmst-sogara.ga',
    website: 'www.cmst-sogara.ga',
    description: 'Centre Médical et de Santé au Travail de la SOGARA, spécialisé dans la médecine du travail et les soins en entreprise. Nous offrons des services de santé de qualité pour les employés et leurs familles.',
    services: [
      'Médecine du Travail',
      'Infirmerie',
      'Vaccinations',
      'Examens Médicaux d\'Embauche',
      'Suivi Médical Périodique',
      'Soins d\'Urgence',
      'Analyses Médicales de Base'
    ],
    stats: [
      { value: '150+', label: 'Patients Traités', icon: Users },
      { value: '15+', label: 'Ans d\'Expérience', icon: Award },
      { value: '20+', label: 'Spécialistes', icon: Stethoscope },
      { value: '98%', label: 'Satisfaction', icon: Heart }
    ],
    specialties: [
      'Médecine du Travail',
      'Médecine Générale',
      'Soins Infirmiers'
    ],
    capacity: {
      consultation_rooms: 4,
      staff: 8
    },
    hours: {
      weekdays: '07:00 - 19:00',
      saturday: '08:00 - 12:00',
      sunday: 'Fermé'
    },
    staff: [
      {
        name: 'Dr. Jean-Paul NZENZE',
        role: 'Médecin du Travail',
        speciality: 'Médecine du Travail',
        qualification: 'Diplôme de Médecine du Travail',
        experience: '12 ans',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean-Paul'
      },
      {
        name: 'Marie BOUNDA',
        role: 'Infirmière en Chef',
        speciality: 'Soins Infirmiers',
        qualification: 'Diplôme d\'État Infirmier',
        experience: '8 ans',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie'
      },
      {
        name: 'Sophie NDONG',
        role: 'Secrétaire Médicale',
        speciality: 'Administration',
        qualification: 'BTS Secrétariat',
        experience: '6 ans',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
      }
    ],
    accessAccounts: [
      {
        name: 'Administration CMST',
        email: 'sogara.demo@sante.ga',
        password: 'Demo@2024!',
        role: 'Administrateur CMST'
      },
      {
        name: 'Dr. Jean-Pierre MBENGONO',
        email: 'dr.travail.sogara@sante.ga',
        password: 'Demo@2024!',
        role: 'Médecin du Travail'
      },
      {
        name: 'Pierre ONDIMBA',
        email: 'infirmier.sogara@sante.ga',
        password: 'Demo@2024!',
        role: 'Infirmier'
      }
    ],
    accreditations: [
      'Agrément Ministère de la Santé',
      'Certification Médecine du Travail',
      'Convention CNAMGS'
    ]
  }
};

export default function EstablishmentPublicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [establishment, setEstablishment] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingInEmail, setSigningInEmail] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const data = ESTABLISHMENTS_DATA[id];
      if (data) {
        setEstablishment(data);
      }
    }
  }, [id]);

  if (!establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">
              Établissement non trouvé
            </h3>
            <p className="text-gray-500 mt-2 mb-4">
              Cet établissement n'existe pas ou n'a pas encore de page publique.
            </p>
            <Button onClick={() => navigate('/establishments/unclaimed')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header - Style Medicate */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {establishment.logo}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{establishment.name}</h1>
              <p className="text-xs text-gray-500">{establishment.tagline}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium text-sm">Services</a>
            <a href="#doctors" className="text-gray-700 hover:text-blue-600 font-medium text-sm">Équipe</a>
            <a href="#appointments" className="text-gray-700 hover:text-blue-600 font-medium text-sm">Rendez-vous</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium text-sm">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/establishments/unclaimed')} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button className="hidden md:flex bg-gray-900 hover:bg-gray-800">
              <Calendar className="w-4 h-4 mr-2" />
              Rendez-vous
            </Button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section - Inspiré du Design Medicate */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Texte Hero */}
            <div className="space-y-6">
              <div className="inline-block">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  <Award className="w-3 h-3 mr-1" />
                  Établissement Agréé
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {establishment.heroTitle}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {establishment.heroSubtitle}
              </p>

              <p className="text-gray-600 text-lg">
                {establishment.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Calendar className="w-5 h-5 mr-2" />
                  Prendre Rendez-vous
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-gray-300">
                  <Mail className="w-5 h-5 mr-2" />
                  Nous Contacter
                </Button>
              </div>

              {/* Stats Mini */}
              <div className="flex gap-8 pt-8">
                <div>
                  <p className="text-3xl font-bold text-gray-900">150+</p>
                  <p className="text-sm text-gray-600">Patients Satisfaits</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">15+</p>
                  <p className="text-sm text-gray-600">Années d'Expérience</p>
                </div>
              </div>
            </div>

            {/* Images Équipe - Style Medicate */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {establishment.staff.slice(0, 2).map((doctor, idx) => (
                  <div key={idx} className={`relative group ${idx === 0 ? 'col-span-2 md:col-span-1' : ''}`}>
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 p-4">
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg p-3">
                        <p className="font-semibold text-gray-900 text-sm">{doctor.name}</p>
                        <p className="text-xs text-gray-600">{doctor.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge "Best Doctor" */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg border-4 border-white">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                  <p className="text-xs font-bold">TOP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {establishment.stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Services Offerts</h2>
            <p className="text-xl text-gray-600">Des services de santé complets adaptés à vos besoins</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {establishment.services.map((service: string, idx: number) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl hover:shadow-lg transition-shadow border border-blue-100">
                <CheckCircle2 className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service}</h3>
                <p className="text-gray-600 text-sm">Services professionnels de haute qualité</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-16 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe Médicale</h2>
            <p className="text-xl text-gray-600">Professionnels expérimentés à votre service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {establishment.staff.map((doctor: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                  <img 
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600 font-semibold">{doctor.role}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div><Badge variant="secondary" className="text-xs">{doctor.speciality}</Badge></div>
                    <p>{doctor.qualification}</p>
                    <p className="text-blue-600 font-medium">{doctor.experience} d'expérience</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Prendre RDV
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Access Section */}
      <section id="contact" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Nous Contacter</h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                    <p className="text-gray-600">
                      {establishment.address}<br />
                      {establishment.city}, {establishment.province}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                    <p className="text-gray-600">{establishment.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{establishment.email}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
                    <p className="text-gray-600">
                      Lun-Ven: {establishment.hours.weekdays}<br />
                      Sam: {establishment.hours.saturday}<br />
                      Dim: {establishment.hours.sunday}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accreditations */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {establishment.accreditations.map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Accès Démo</h2>
              </div>
              
              <p className="text-gray-700 mb-6 text-sm">
                Testez nos services avec ces comptes de démonstration :
              </p>

              <div className="space-y-4">
                {establishment.accessAccounts.map((account: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <p className="font-semibold text-gray-900">{account.name}</p>
                        <p className="text-xs text-blue-600 font-medium">{account.role}</p>
                        <div className="space-y-1 pt-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                              {account.email}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <Key className="w-3 h-3" />
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                              {account.password}
                            </code>
                          </div>
                        </div>
                        <div className="pt-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={signingInEmail === account.email}
                            onClick={async () => {
                              try {
                                setSigningInEmail(account.email);
                                const { error } = await supabase.auth.signInWithPassword({
                                  email: account.email,
                                  password: account.password,
                                });
                                if (error) throw error;
                                navigate('/professional/select-establishment');
                              } catch (e: any) {
                                alert(e?.message || 'Échec de la connexion');
                              } finally {
                                setSigningInEmail(null);
                              }
                            }}
                          >
                            <LogIn className="w-3.5 h-3.5 mr-1.5" />
                            Se connecter
                          </Button>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${account.email}\n${account.password}`);
                        }}
                        className="text-blue-600 hover:text-blue-700 p-2"
                        title="Copier"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-600 mt-6 p-4 bg-white/50 rounded-lg">
                ℹ️ Ces identifiants sont des comptes de démonstration. En production, chaque utilisateur aura ses propres identifiants sécurisés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à Prendre Soin de Votre Santé ?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Prenez rendez-vous en ligne ou contactez-nous directement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Calendar className="w-5 h-5 mr-2" />
              Prendre Rendez-vous
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600">
              <Phone className="w-5 h-5 mr-2" />
              +241 01 55 26 21
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {establishment.logo}
              </div>
              <div>
                <p className="font-bold text-white">{establishment.name}</p>
                <p className="text-xs">{establishment.tagline}</p>
              </div>
            </div>
            <p className="text-sm">© 2025 {establishment.name}. Tous droits réservés. | SANTE.GA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

