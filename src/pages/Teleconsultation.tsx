import { useState } from "react";

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageSquare,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  CheckCircle2,
  AlertCircle,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  available: boolean;
  nextSlot?: string;
  rating: number;
}

const mockAvailableDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. ONDO Marie",
    specialty: "Médecine Générale",
    avatar: "/placeholder.svg",
    available: true,
    rating: 4.8
  },
  {
    id: "2",
    name: "Dr. MBADINGA Paul",
    specialty: "Pédiatrie",
    avatar: "/placeholder.svg",
    available: true,
    rating: 4.9
  },
  {
    id: "3",
    name: "Dr. EKOMI Sophie",
    specialty: "Dermatologie",
    avatar: "/placeholder.svg",
    available: false,
    nextSlot: "14h30",
    rating: 4.7
  }
];

const mockUpcomingConsultations = [
  {
    id: "1",
    doctor: "Dr. ONDO Marie",
    specialty: "Médecine Générale",
    date: "Aujourd'hui",
    time: "15h00",
    status: "confirmed"
  },
  {
    id: "2",
    doctor: "Dr. NGUEMA Jacques",
    specialty: "Cardiologie",
    date: "Demain",
    time: "10h30",
    status: "pending"
  }
];

export default function Teleconsultation() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("available");
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const startConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setInCall(true);
  };

  const endConsultation = () => {
    setInCall(false);
    setSelectedDoctor(null);
    setVideoEnabled(true);
    setAudioEnabled(true);
  };

  if (inCall && selectedDoctor) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Video Interface */}
        <div className="flex-1 relative bg-gradient-to-br from-muted/30 to-background">
          {/* Main Video - Doctor */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-5xl mx-auto p-4 lg:p-8">
              <Card className="h-full backdrop-blur-xl bg-card/95 border-2 overflow-hidden">
                <div className="h-full flex flex-col items-center justify-center relative">
                  {videoEnabled ? (
                    <div className="w-full h-full bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Avatar className="h-32 w-32 mx-auto ring-4 ring-primary/20">
                          <AvatarImage src={selectedDoctor.avatar} />
                          <AvatarFallback className="text-4xl">
                            {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-2xl font-semibold">{selectedDoctor.name}</h3>
                          <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted/10">
                      <VideoOff className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Consultation Info Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <Badge variant="secondary" className="backdrop-blur-xl bg-background/80 px-4 py-2">
                      <Clock className="h-3 w-3 mr-2" />
                      <span className="font-mono">00:05:23</span>
                    </Badge>
                    <Badge className="backdrop-blur-xl bg-success/80 px-4 py-2">
                      <CheckCircle2 className="h-3 w-3 mr-2" />
                      En ligne
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Self Video - Picture in Picture */}
          <div className="absolute bottom-24 right-4 w-48 h-36 lg:w-64 lg:h-48">
            <Card className="h-full backdrop-blur-xl bg-card/95 border-2 overflow-hidden">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                {videoEnabled ? (
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto ring-2 ring-primary/20">
                      <AvatarFallback className="text-xl">VU</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-2">Vous</p>
                  </div>
                ) : (
                  <VideoOff className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card/95 backdrop-blur-xl border-t p-4">
          <div className="container max-w-3xl mx-auto flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={videoEnabled ? "secondary" : "destructive"}
              onClick={() => setVideoEnabled(!videoEnabled)}
              className="rounded-full h-14 w-14"
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              size="lg"
              variant={audioEnabled ? "secondary" : "destructive"}
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="rounded-full h-14 w-14"
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 w-14"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 w-14"
            >
              <FileText className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="destructive"
              onClick={endConsultation}
              className="rounded-full h-16 w-16 ml-4"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
      <MainLayout>
        <div className="container max-w-7xl mx-auto px-4 py-6 lg:py-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Téléconsultation
            </h1>
            <p className="text-muted-foreground">
              Consultez un médecin à distance, en toute sécurité
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Médecins disponibles</p>
                    <p className="text-3xl font-bold">24</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Temps d'attente moyen</p>
                    <p className="text-3xl font-bold">~5 min</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Consultations ce mois</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Video className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto">
              <TabsTrigger value="available" className="gap-2">
                <Stethoscope className="h-4 w-4" />
                Médecins disponibles
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="gap-2">
                <Calendar className="h-4 w-4" />
                Consultations programmées
              </TabsTrigger>
            </TabsList>

            {/* Available Doctors */}
            <TabsContent value="available" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockAvailableDoctors.map((doctor) => (
                  <Card key={doctor.id} className="card-interactive">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                          <AvatarImage src={doctor.avatar} />
                          <AvatarFallback className="text-xl">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{doctor.name}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Stethoscope className="h-3 w-3" />
                                {doctor.specialty}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={doctor.available ? "default" : "secondary"}
                              className={cn(
                                "gap-1",
                                doctor.available && "bg-success text-success-foreground hover:bg-success/90"
                              )}
                            >
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                doctor.available ? "bg-success-foreground animate-pulse" : "bg-muted-foreground"
                              )} />
                              {doctor.available ? "Disponible" : "Occupé"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1 w-8 rounded-full",
                                  i < Math.floor(doctor.rating) 
                                    ? "bg-primary" 
                                    : "bg-muted"
                                )}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {doctor.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {!doctor.available && doctor.nextSlot && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                          <Clock className="h-4 w-4" />
                          Prochain créneau : {doctor.nextSlot}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          disabled={!doctor.available}
                          onClick={() => startConsultation(doctor)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          {doctor.available ? "Démarrer maintenant" : "Non disponible"}
                        </Button>
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Planifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Scheduled Consultations */}
            <TabsContent value="scheduled" className="space-y-4">
              {mockUpcomingConsultations.map((consultation) => (
                <Card key={consultation.id} className="card-interactive">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{consultation.doctor}</h3>
                            <Badge 
                              variant={consultation.status === "confirmed" ? "default" : "secondary"}
                              className={cn(
                                consultation.status === "confirmed" && 
                                "bg-success text-success-foreground hover:bg-success/90"
                              )}
                            >
                              {consultation.status === "confirmed" ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Confirmé
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  En attente
                                </>
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{consultation.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{consultation.date}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {consultation.time}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Rejoindre
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockUpcomingConsultations.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune consultation programmée</h3>
                    <p className="text-muted-foreground mb-6">
                      Planifiez une consultation avec l'un de nos médecins disponibles
                    </p>
                    <Button onClick={() => setActiveTab("available")}>
                      Voir les médecins disponibles
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>

      <MobileBottomNav />
    </div>
  );
}
