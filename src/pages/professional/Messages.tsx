import { useState, useEffect } from "react";
import { Mail, Send, Search, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { MessagesStats } from "@/components/professional/MessagesStats";

export default function ProfessionalMessages() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    document.title = "Messages | Espace Professionnel - SANTE.GA";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Messagerie sécurisée pour communiquer avec les patients et confrères.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.origin + '/professional/messages');
  }, []);

  const messages = [
    {
      id: 1,
      from: "Marie MOUSSAVOU",
      subject: "Question sur mon traitement",
      preview: "Bonjour Docteur, j'ai une question concernant...",
      date: "2025-02-05 10:30",
      isRead: false,
      isStarred: true,
      category: "patient"
    },
    {
      id: 2,
      from: "CNAMGS - Service Facturation",
      subject: "Validation facture FACT-2025-089",
      preview: "Votre facture a été validée pour un montant de...",
      date: "2025-02-04 15:45",
      isRead: true,
      isStarred: false,
      category: "admin"
    },
    {
      id: 3,
      from: "Jean NZENGUE",
      subject: "Demande de certificat médical",
      preview: "Pourriez-vous me fournir un certificat médical pour...",
      date: "2025-02-04 09:20",
      isRead: false,
      isStarred: false,
      category: "patient"
    },
    {
      id: 4,
      from: "CHU Libreville - RH",
      subject: "Télé-expertise demandée",
      preview: "Un de nos confrères sollicite votre expertise sur...",
      date: "2025-02-03 14:00",
      isRead: true,
      isStarred: true,
      category: "professional"
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messagerie</h1>
          <p className="text-muted-foreground">Communication avec les patients et confrères</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Nouveau message
        </Button>
      </div>

        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <MessagesStats unread={5} today={8} starred={12} archived={234} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <Card className="lg:col-span-1 rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                    !message.isRead ? 'bg-primary/5' : ''
                  } ${selectedMessage?.id === message.id ? 'bg-muted' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(message.from)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                          {message.from}
                        </p>
                        {message.isStarred && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className={`text-sm mb-1 truncate ${!message.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {message.preview}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.date).toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          {/* Détail du message */}
          <Card className="lg:col-span-2 rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
          {selectedMessage ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{getInitials(selectedMessage.from)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{selectedMessage.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        De: {selectedMessage.from}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Star className={selectedMessage.isStarred ? "h-4 w-4 text-yellow-500 fill-yellow-500" : "h-4 w-4"} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p>
                    Bonjour Docteur,
                  </p>
                  <p>
                    {selectedMessage.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <p>
                    Cordialement,<br />
                    {selectedMessage.from}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Répondre</h4>
                  <Textarea 
                    placeholder="Votre réponse..." 
                    rows={5}
                    className="mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Brouillon</Button>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez un message pour le lire</p>
              </div>
            </CardContent>
          )}
        </Card>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}
