import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Stethoscope, 
  Shield, 
  ArrowLeft,
  Calendar,
  FileText,
  Building2,
  Users,
  BarChart3,
  Settings,
  ChevronRight,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SANTE.GA</h1>
                <p className="text-xs text-muted-foreground">Votre santé digitale</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/about" className="text-sm hover:text-primary transition-colors">
                À propos
              </Link>
              <Link to="/establishments" className="text-sm hover:text-primary transition-colors">
                Établissements
              </Link>
              <Link to="/support" className="text-sm hover:text-primary transition-colors">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bienvenue sur SANTE.GA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez votre espace de connexion selon votre profil
          </p>
        </div>

        {/* Login Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Patient Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer"
                onClick={() => navigate('/login/patient')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Espace Patient</CardTitle>
              <CardDescription className="text-base">
                Gérez votre santé en ligne facilement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Prendre et gérer vos rendez-vous</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Consulter vos ordonnances</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Accéder à votre dossier médical</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Badge className="w-full justify-center py-2" variant="secondary">
                  Compatible CNAMGS & CNSS
                </Badge>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                Connexion Patient
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Nouveau patient ? 
                <Link to="/signup/patient" className="text-primary hover:underline ml-1">
                  Créer un compte
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Professional Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-indigo-200 cursor-pointer"
                onClick={() => navigate('/login/professional')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Espace Professionnel</CardTitle>
              <CardDescription className="text-base">
                Pour tous les professionnels de santé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Gérer vos patients</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Organiser vos consultations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Multi-établissements</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="outline" className="text-xs">Médecins</Badge>
                  <Badge variant="outline" className="text-xs">Infirmiers</Badge>
                  <Badge variant="outline" className="text-xs">Pharmaciens</Badge>
                  <Badge variant="outline" className="text-xs">Administratifs</Badge>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Connexion Professionnel
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Nouveau professionnel ? 
                <Link to="/signup/professional" className="text-primary hover:underline ml-1">
                  Demander l'accès
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-200 cursor-pointer relative overflow-hidden"
                onClick={() => navigate('/login/admin')}>
            <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-bl-lg">
              Accès restreint
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Administration</CardTitle>
              <CardDescription className="text-base">
                Gestion de la plateforme SANTE.GA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Gérer les établissements</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Superviser les utilisateurs</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Statistiques globales</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Badge className="w-full justify-center py-2" variant="destructive">
                  Authentification renforcée
                </Badge>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Connexion Admin
                <Shield className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Support technique : 
                <a href="mailto:support@sante.ga" className="text-primary hover:underline ml-1">
                  support@sante.ga
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="mt-16 py-8 border-t">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Accès rapide aux établissements</h2>
            <p className="text-muted-foreground">Connexion directe pour le personnel de ces établissements</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login/professional?establishment=cmst-sogara')}
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              CMST SOGARA
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login/professional?establishment=chu-libreville')}
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              CHU Libreville
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login/professional?establishment=chr-melen')}
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              CHR Melen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/establishments')}
              className="flex items-center gap-2"
            >
              Voir tous les établissements
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold">Comment choisir votre espace ?</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><strong>Patient :</strong> Si vous souhaitez prendre rendez-vous, consulter vos ordonnances ou accéder à votre dossier médical.</li>
                <li><strong>Professionnel :</strong> Si vous êtes médecin, infirmier, pharmacien ou personnel administratif d'un établissement de santé.</li>
                <li><strong>Administration :</strong> Réservé aux administrateurs de la plateforme SANTE.GA pour la gestion globale du système.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2024 SANTE.GA - Votre santé digitale au Gabon
              </span>
            </div>
            
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                Confidentialité
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary">
                Conditions
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-primary">
                Aide
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
