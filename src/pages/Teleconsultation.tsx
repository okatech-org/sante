import { useState } from "react";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageSquare,
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  CheckCircle2,
  AlertCircle,
  Users,
  Star
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
  },
  {
    id: "4",
    name: "Dr. NGUEMA Jacques",
    specialty: "Cardiologie",
    avatar: "/placeholder.svg",
    available: true,
    rating: 4.6
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
      <div className="min-h-screen bg-[#0f1419] flex flex-col">
        {/* Video Interface */}
        <div className="flex-1 relative">
          {/* Main Video - Doctor */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-5xl mx-auto p-4 lg:p-8">
              <div className="h-full rounded-2xl backdrop-blur-xl bg-[#1a1f2e]/95 border border-white/10 shadow-2xl overflow-hidden">
                <div className="h-full flex flex-col items-center justify-center relative">
                  {videoEnabled ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Avatar className="h-32 w-32 mx-auto ring-4 ring-[#00d4ff]/20">
                          <AvatarImage src={selectedDoctor.avatar} />
                          <AvatarFallback className="text-4xl bg-[#00d4ff]/20 text-[#00d4ff]">
                            {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-2xl font-semibold text-white">{selectedDoctor.name}</h3>
                          <p className="text-gray-400">{selectedDoctor.specialty}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-[#1a1f2e]/50">
                      <VideoOff className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Consultation Info Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <Badge className="backdrop-blur-xl bg-[#1a1f2e]/80 px-4 py-2 text-white border-white/10">
                      <Clock className="h-3 w-3 mr-2" />
                      <span className="font-mono">00:05:23</span>
                    </Badge>
                    <Badge className="backdrop-blur-xl bg-[#00d4ff]/20 px-4 py-2 text-[#00d4ff] border-[#00d4ff]/30">
                      <CheckCircle2 className="h-3 w-3 mr-2" />
                      En ligne
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Self Video - Picture in Picture */}
          <div className="absolute bottom-24 right-4 w-48 h-36 lg:w-64 lg:h-48">
            <div className="h-full rounded-xl backdrop-blur-xl bg-[#1a1f2e]/95 border border-white/10 overflow-hidden">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#00d4ff]/5 to-[#0088ff]/5">
                {videoEnabled ? (
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto ring-2 ring-[#00d4ff]/20">
                      <AvatarFallback className="text-xl bg-[#00d4ff] text-white">VU</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-gray-400 mt-2">Vous</p>
                  </div>
                ) : (
                  <VideoOff className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1a1f2e]/95 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="container max-w-3xl mx-auto flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={videoEnabled ? "secondary" : "destructive"}
              onClick={() => setVideoEnabled(!videoEnabled)}
              className="rounded-full h-14 w-14 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              size="lg"
              variant={audioEnabled ? "secondary" : "destructive"}
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="rounded-full h-14 w-14 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 w-14 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 w-14 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              <FileText className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              onClick={endConsultation}
              className="rounded-full h-16 w-16 ml-4 bg-[#ff0088] hover:bg-[#e0007a]"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-8 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Téléconsultation
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Consultez un médecin à distance, en toute sécurité
          </p>
        </div>

        {/* Stats Cards */}
        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#00d4ff]" />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white mb-1">24</p>
              <p className="text-[10px] sm:text-sm text-gray-400">Médecins disponibles</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#0088ff]/20 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#0088ff]" />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white mb-1">~5 min</p>
              <p className="text-[10px] sm:text-sm text-gray-400">Temps d'attente moyen</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#ffaa00]/20 flex items-center justify-center mb-2">
                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffaa00]" />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white mb-1">3</p>
              <p className="text-[10px] sm:text-sm text-gray-400">Consultations ce mois</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 bg-[#1a1f2e]/80 border border-white/10">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="available" className="gap-2 data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff]">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Médecins </span>disponibles
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="gap-2 data-[state=active]:bg-[#0088ff]/20 data-[state=active]:text-[#0088ff]">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Consultations </span>programmées
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Available Doctors */}
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAvailableDoctors.map((doctor) => (
                <div key={doctor.id} className="rounded-xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 hover:bg-[#1a1f2e]/90 transition-all shadow-xl">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 ring-2 ring-[#00d4ff]/20">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback className="text-xl bg-[#00d4ff]/20 text-[#00d4ff]">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
                          <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                            <Stethoscope className="h-3 w-3" />
                            {doctor.specialty}
                          </p>
                        </div>
                        <Badge 
                          variant={doctor.available ? "default" : "secondary"}
                          className={cn(
                            "gap-1",
                            doctor.available ? "bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30" : "bg-white/10 text-gray-400"
                          )}
                        >
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            doctor.available ? "bg-[#00d4ff] animate-pulse" : "bg-gray-400"
                          )} />
                          {doctor.available ? "Disponible" : "Occupé"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(doctor.rating) 
                                ? "fill-[#ffaa00] text-[#ffaa00]" 
                                : "text-gray-600"
                            )}
                          />
                        ))}
                        <span className="text-xs text-gray-400 ml-2">
                          {doctor.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  {!doctor.available && doctor.nextSlot && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 p-3 bg-white/5 rounded-lg mb-3">
                      <Clock className="h-4 w-4" />
                      Prochain créneau : {doctor.nextSlot}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#00d4ff] hover:bg-[#00b8e6] text-white"
                      disabled={!doctor.available}
                      onClick={() => startConsultation(doctor)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {doctor.available ? "Démarrer" : "Non disponible"}
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                      <Calendar className="h-4 w-4 mr-2" />
                      Planifier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Scheduled Consultations */}
          <TabsContent value="scheduled" className="space-y-4">
            {mockUpcomingConsultations.map((consultation) => (
              <div key={consultation.id} className="rounded-xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 hover:bg-[#1a1f2e]/90 transition-all shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center">
                      <Video className="h-6 w-6 text-[#00d4ff]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{consultation.doctor}</h3>
                        <Badge 
                          className={cn(
                            consultation.status === "confirmed" 
                              ? "bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30" 
                              : "bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]/30"
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
                      <p className="text-sm text-gray-400">{consultation.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{consultation.date}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {consultation.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                        Modifier
                      </Button>
                      <Button size="sm" className="bg-[#00d4ff] hover:bg-[#00b8e6] text-white">
                        <Video className="h-4 w-4 mr-2" />
                        Rejoindre
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PatientDashboardLayout>
  );
}
