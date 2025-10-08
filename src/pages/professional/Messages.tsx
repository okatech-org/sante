import { useState, useEffect } from "react";
import { Mail, Send, Search, Star, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { MessagesStats } from "@/components/professional/MessagesStats";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";

export default function ProfessionalMessages() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const { messages, stats, loading, error, markAsRead, toggleStar, deleteMessage } = useMessages();
  const { toast } = useToast();


  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const handleSelectMessage = async (message: any) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      await markAsRead(message.id);
    }
  };

  const handleToggleStar = async (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleStar(messageId);
  };

  const handleDelete = async (messageId: string) => {
    await deleteMessage(messageId);
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    toast({
      title: "Message supprimé",
      description: "Le message a été supprimé avec succès.",
    });
  };

  const handleSendReply = () => {
    // TODO: Implement send reply functionality
    toast({
      title: "Réponse envoyée",
      description: "Votre réponse a été envoyée avec succès.",
    });
    setReplyContent("");
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PatientDashboardLayout>
    );
  }

  if (error) {
    return (
      <PatientDashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientDashboardLayout>
    );
  }

  const filteredMessages = searchQuery
    ? messages.filter(
        (m) =>
          m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

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
          <MessagesStats 
            unread={stats.unread} 
            today={stats.today} 
            starred={stats.starred} 
            archived={stats.archived} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <Card className="lg:col-span-1 rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun message trouvé</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
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
                          <Star 
                            className="h-4 w-4 text-yellow-500 fill-yellow-500 cursor-pointer" 
                            onClick={(e) => handleToggleStar(message.id, e)}
                          />
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
                ))
              )}
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
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleStar(selectedMessage.id)}
                    >
                      <Star className={selectedMessage.isStarred ? "h-4 w-4 text-yellow-500 fill-yellow-500" : "h-4 w-4"} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p>{selectedMessage.content}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Répondre</h4>
                  <Textarea 
                    placeholder="Votre réponse..." 
                    rows={5}
                    className="mb-2"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Brouillon</Button>
                    <Button onClick={handleSendReply} disabled={!replyContent.trim()}>
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
