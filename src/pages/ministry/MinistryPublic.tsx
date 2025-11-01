// Page publique du Ministère de la Santé (sans authentification)
// SANTE.GA - Plateforme E-Santé Gabon

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Users, 
  Activity, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  AlertCircle,
  FileText,
  Stethoscope,
  Syringe,
  Baby,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const MinistryPublic = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section - Moderne et épuré */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              République Gabonaise
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ministère de la Santé
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-50 font-light">
              Œuvrer pour un Gabon en meilleure santé
            </p>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold">1.8M</div>
                <div className="text-sm text-blue-100">Bénéficiaires CNAMGS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold">238</div>
                <div className="text-sm text-blue-100">Établissements</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold">2,159</div>
                <div className="text-sm text-blue-100">Médecins</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold">78%</div>
                <div className="text-sm text-blue-100">Couverture</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Programmes Prioritaires */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Programmes Prioritaires
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des actions concrètes pour améliorer l'accès aux soins et la santé des Gabonais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Programme Paludisme */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-400">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-500 transition-colors">
                  <Shield className="h-6 w-6 text-green-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Lutte contre le Paludisme</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Distribution de 500,000 moustiquaires imprégnées dans toutes les provinces
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      72% accompli
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programme Vaccination */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <Syringe className="h-6 w-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Vaccination Élargie (PEV)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Campagne nationale contre la rougeole et la rubéole
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      89% couverture
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programme Santé Maternelle */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-400">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-500 transition-colors">
                  <Baby className="h-6 w-6 text-pink-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Santé Maternelle</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Réduction de la mortalité maternelle et néonatale
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-pink-600 border-pink-300">
                      <Activity className="h-3 w-3 mr-1" />
                      65% objectif
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Réseau de Soins */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Réseau de Soins
            </h2>
            <p className="text-gray-600">
              Un maillage territorial pour garantir l'accès aux soins partout au Gabon
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Building2 className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
              <div className="text-sm text-gray-600">CHU</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Building2 className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">9</div>
              <div className="text-sm text-gray-600">CHR</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Heart className="h-8 w-8 mx-auto mb-3 text-red-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">52</div>
              <div className="text-sm text-gray-600">Centres</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Stethoscope className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">147</div>
              <div className="text-sm text-gray-600">Cliniques</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Activity className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">114</div>
              <div className="text-sm text-gray-600">Pharmacies</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Users className="h-8 w-8 mx-auto mb-3 text-teal-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
              <div className="text-sm text-gray-600">Laboratoires</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes et Actualités */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Alertes Sanitaires */}
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold">Alertes Sanitaires</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      URGENT
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">Rupture d'insuline</div>
                      <div className="text-sm text-gray-600">Haut-Ogooué - 3 établissements</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      INFO
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">Paludisme en hausse</div>
                      <div className="text-sm text-gray-600">Nyanga - +15% de cas</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publications */}
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Publications Récentes</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Rapport Annuel 2024</div>
                      <div className="text-sm text-gray-600">15 octobre 2025</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Bulletin Épidémiologique</div>
                      <div className="text-sm text-gray-600">Semaine 44 - 2025</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">PNDS 2024-2028</div>
                      <div className="text-sm text-gray-600">Document stratégique</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="border-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
            <h2 className="text-3xl font-bold mb-2">Nous Contacter</h2>
            <p className="text-blue-100">Ministère de la Santé publique et de la Population</p>
          </div>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Adresse</div>
                  <div className="text-sm text-gray-600">
                    À côté de l'immeuble Alu-Suisse<br />
                    Libreville, Gabon
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Téléphone</div>
                  <div className="text-sm text-gray-600">
                    +241 01-72-26-61<br />
                    +241 06 47 74 83
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Email</div>
                  <div className="text-sm text-gray-600">
                    contact@sante.gouv.ga
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Horaires</div>
                  <div className="text-sm text-gray-600">
                    Lun - Ven: 08h00 - 17h00<br />
                    Weekend: Fermé
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Ministère de la Santé publique et de la Population - République Gabonaise
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Propulsé par SANTE.GA - Plateforme Nationale de Santé Numérique
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MinistryPublic;
