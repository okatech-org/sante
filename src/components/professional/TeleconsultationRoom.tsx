import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, FileText } from "lucide-react";
import { toast } from "sonner";

interface TeleconsultationRoomProps {
  sessionId: string;
  patientName: string;
  onEndSession: () => void;
  onCreatePrescription: () => void;
}

export function TeleconsultationRoom({
  sessionId,
  patientName,
  onEndSession,
  onCreatePrescription
}: TeleconsultationRoomProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initializeMediaDevices();
    
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      toast.success("Connexion établie");
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error("Impossible d'accéder à la caméra/micro");
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleEndSession = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onEndSession();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Téléconsultation</h2>
          <p className="text-sm text-muted-foreground">Patient: {patientName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="default" className="gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            En cours · {formatDuration(duration)}
          </Badge>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-muted">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (PIP) */}
        <div className="absolute top-4 right-4 w-64 h-48 rounded-lg overflow-hidden border-2 border-primary shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <VideoOff className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Waiting State */}
        {!remoteVideoRef.current?.srcObject && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">En attente du patient...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Le patient rejoindra la consultation dans quelques instants
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t p-6 bg-card">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full h-14 w-14"
          >
            {isVideoEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full h-14 w-14"
          >
            {isAudioEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full h-14 w-14"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onCreatePrescription}
            className="gap-2"
          >
            <FileText className="h-5 w-5" />
            Créer une ordonnance
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndSession}
            className="rounded-full h-14 w-14"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}