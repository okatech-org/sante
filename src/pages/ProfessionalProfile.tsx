import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  Award,
  Briefcase,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Building2,
  GraduationCap,
  Stethoscope,
  MessageSquare,
  Heart
} from "lucide-react";
import drDemoAvatar from "@/assets/dr-demo-avatar.jpg";

// Données fictives pour Dr Démo
const DR_DEMO_PROFILE = {
  id: "dr-demo-cabinet-001",
  name: "Dr. Démo",
  fullName: "Dr. Jean-Pierre Démo",
  specialty: "Médecine Générale",
  avatar: drDemoAvatar,
  rating: 5.0,
  reviewsCount: 42,
  patientsCount: 250,
  experienceYears: 15,
  ordreNumber: "DEMO-0001",
  email: "dr.demo@esante.ga",
  phone: "+241 01 23 45 67",
  location: {
    name: "Cabinet Médical Dr. Démo",
    address: "Boulevard Triomphal, Louis, 1er Arrondissement",
    city: "Libreville",
    province: "Estuaire",
    coordinates: { lat: 0.4162, lng: 9.4673 }
  },
  bio: "Médecin généraliste passionné avec plus de 15 ans d'expérience dans la prise en charge globale des patients. Spécialisé dans le suivi des maladies chroniques et la médecine préventive. Conventionné CNAMGS et disponible pour les consultations à domicile.",
  services: [
    "Consultation générale",
    "Médecine préventive",
    "Suivi des maladies chroniques",
    "Téléconsultation",
    "Visite à domicile",
    "Certificats médicaux"
  ],
  consultationFees: {
    standard: 25000,
    cnamgs: 20000,
    homeVisit: 40000,
    teleconsultation: 15000
  },
  conventions: [
    { name: "CNAMGS", active: true },
    { name: "CNSS", active: true },
    { name: "Mutuelle Gabonaise", active: true }
  ],
  schedule: [
    { day: "Lundi", hours: "08h00 - 17h00" },
    { day: "Mardi", hours: "08h00 - 17h00" },
    { day: "Mercredi", hours: "08h00 - 17h00" },
    { day: "Jeudi", hours: "08h00 - 17h00" },
    { day: "Vendredi", hours: "08h00 - 17h00" },
    { day: "Samedi", hours: "09h00 - 13h00" },
    { day: "Dimanche", hours: "Fermé" }
  ],
  diplomas: [
    {
      title: "Doctorat en Médecine",
      institution: "Université des Sciences de la Santé",
      year: 2008,
      country: "Gabon"
    },
    {
      title: "Diplôme Inter-Universitaire en Médecine Tropicale",
      institution: "Université de Bordeaux",
      year: 2010,
      country: "France"
    },
    {
      title: "Formation en Télémédecine",
      institution: "CHU de Libreville",
      year: 2022,
      country: "Gabon"
    }
  ],
  reviews: [
    {
      id: "1",
      patientName: "Marie K.",
      rating: 5,
      date: "2025-01-15",
      comment: "Excellent médecin, très à l'écoute et professionnel. Explications claires et prend le temps nécessaire pour chaque patient."
    },
    {
      id: "2",
      patientName: "Paul M.",
      rating: 5,
      date: "2025-01-10",
      comment: "Très bon suivi médical, disponible et réactif. Je recommande vivement!"
    },
    {
      id: "3",
      patientName: "Sophie N.",
      rating: 5,
      date: "2025-01-05",
      comment: "Cabinet propre et bien équipé. Dr Démo est très compétent et rassurant."
    },
    {
      id: "4",
      patientName: "André B.",
      rating: 5,
      date: "2024-12-28",
      comment: "Ponctuel, professionnel et bienveillant. Les rendez-vous sont faciles à obtenir."
    }
  ]
};

export default function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Pour cet exemple, on utilise toujours le profil de Dr Démo
  const profile = DR_DEMO_PROFILE;

  const handleBookAppointment = () => {
    navigate(`/appointments?providerId=${profile.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
      {/* Header avec retour */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Section principale du profil */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar et informations principales */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Vérifié
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Heart className="w-3 h-3" />
                    {profile.patientsCount}+ patients
                  </Badge>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{profile.fullName}</h1>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground mb-3">
                    <Stethoscope className="w-5 h-5" />
                    {profile.specialty}
                  </div>
                  
                  {/* Note et avis */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <span className="font-semibold">{profile.rating}</span>
                      <span className="text-muted-foreground">({profile.reviewsCount} avis)</span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Briefcase className="w-3 h-3" />
                      {profile.experienceYears} ans d'expérience
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>

                {/* Informations de contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{profile.location.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location.address}, {profile.location.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button size="lg" onClick={handleBookAppointment} className="gap-2">
                    <Calendar className="w-5 h-5" />
                    Prendre rendez-vous
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contacter
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets de contenu */}
        <Tabs defaultValue="tarifs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="tarifs" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Tarifs</span>
            </TabsTrigger>
            <TabsTrigger value="horaires" className="gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Horaires</span>
            </TabsTrigger>
            <TabsTrigger value="diplomes" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Diplômes</span>
            </TabsTrigger>
            <TabsTrigger value="avis" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Avis</span>
            </TabsTrigger>
          </TabsList>

          {/* Tarifs */}
          <TabsContent value="tarifs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tarifs de consultation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg space-y-2">
                    <h3 className="font-semibold">Consultation au cabinet</h3>
                    <p className="text-3xl font-bold text-primary">{profile.consultationFees.standard.toLocaleString()} FCFA</p>
                    <p className="text-sm text-muted-foreground">Tarif standard</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg space-y-2 bg-primary/5">
                    <h3 className="font-semibold flex items-center gap-2">
                      CNAMGS
                      <Badge variant="secondary">Conventionné</Badge>
                    </h3>
                    <p className="text-3xl font-bold text-primary">{profile.consultationFees.cnamgs.toLocaleString()} FCFA</p>
                    <p className="text-sm text-muted-foreground">Tarif conventionné</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg space-y-2">
                    <h3 className="font-semibold">Visite à domicile</h3>
                    <p className="text-3xl font-bold text-primary">{profile.consultationFees.homeVisit.toLocaleString()} FCFA</p>
                    <p className="text-sm text-muted-foreground">Selon localisation</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg space-y-2">
                    <h3 className="font-semibold">Téléconsultation</h3>
                    <p className="text-3xl font-bold text-primary">{profile.consultationFees.teleconsultation.toLocaleString()} FCFA</p>
                    <p className="text-sm text-muted-foreground">En ligne</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Conventionnements</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.conventions.map((conv) => (
                      <Badge key={conv.name} variant={conv.active ? "default" : "secondary"} className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {conv.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Services proposés</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {profile.services.map((service) => (
                      <div key={service} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Horaires */}
          <TabsContent value="horaires">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.schedule.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{schedule.day}</span>
                      <span className={schedule.hours === "Fermé" ? "text-muted-foreground" : "text-primary font-semibold"}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diplômes */}
          <TabsContent value="diplomes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Formation et diplômes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.diplomas.map((diploma, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{diploma.title}</h3>
                        <p className="text-muted-foreground">{diploma.institution}</p>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{diploma.year}</span>
                          <span>•</span>
                          <span>{diploma.country}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avis */}
          <TabsContent value="avis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Avis des patients ({profile.reviewsCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Résumé des notes */}
                  <div className="flex items-center gap-6 p-4 bg-secondary/10 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{profile.rating}</div>
                      <div className="flex items-center gap-1 text-yellow-500 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{profile.reviewsCount} avis</div>
                    </div>
                    <Separator orientation="vertical" className="h-20" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        100% des patients recommandent ce médecin
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Liste des avis */}
                  <div className="space-y-4">
                    {profile.reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{review.patientName}</div>
                            <div className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
