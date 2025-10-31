import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, Search, Send, Paperclip, User,
  Clock, CheckCheck, Circle
} from 'lucide-react';

export default function ProfessionalMessages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Données fictives
  const conversations = [
    {
      id: 1,
      contact: 'Dr. Marie OKEMBA',
      role: 'Médecin - Cardiologie',
      lastMessage: 'Merci pour le transfert du dossier',
      timestamp: '10:30',
      unread: 2,
      status: 'online'
    },
    {
      id: 2,
      contact: 'Infirmière Patricia NZE',
      role: 'Infirmière - Urgences',
      lastMessage: 'Le patient de la chambre 101 demande à vous voir',
      timestamp: '09:15',
      unread: 1,
      status: 'offline'
    },
    {
      id: 3,
      contact: 'Administration SOGARA',
      role: 'Service Administratif',
      lastMessage: 'Rappel: Réunion demain à 14h',
      timestamp: 'Hier',
      unread: 0,
      status: 'offline'
    },
    {
      id: 4,
      contact: 'Dr. Paul NGUEMA',
      role: 'Médecin - Urgences',
      lastMessage: 'J\'ai besoin d\'un avis sur un cas',
      timestamp: 'Hier',
      unread: 0,
      status: 'online'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Dr. Marie OKEMBA',
      text: 'Bonjour Dr. DJEKI, j\'ai bien reçu le dossier du patient',
      timestamp: '10:25',
      isMe: false
    },
    {
      id: 2,
      sender: 'Moi',
      text: 'Parfait ! N\'hésitez pas si vous avez besoin de plus d\'informations',
      timestamp: '10:28',
      isMe: true
    },
    {
      id: 3,
      sender: 'Dr. Marie OKEMBA',
      text: 'Merci pour le transfert du dossier',
      timestamp: '10:30',
      isMe: false
    }
  ];

  const filteredConversations = conversations.filter(c =>
    c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Envoi message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            Messagerie
          </h1>
          <p className="text-muted-foreground mt-1">
            Communication avec vos collègues
          </p>
        </div>
        <Badge variant="default">
          {conversations.reduce((sum, c) => sum + c.unread, 0)} nouveaux messages
        </Badge>
      </div>

      {/* Interface de messagerie */}
      <div className="grid grid-cols-12 gap-6 h-[700px]">
        {/* Liste des conversations */}
        <Card className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    {conv.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {conv.contact}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {conv.role}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  
                  {conv.unread > 0 && (
                    <Badge variant="default" className="ml-2">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Zone de conversation */}
        <Card className="col-span-12 lg:col-span-8 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header conversation */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {conversations.find(c => c.id === selectedConversation)?.contact}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {conversations.find(c => c.id === selectedConversation)?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-2xl p-3 ${
                        msg.isMe 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp}
                        </span>
                        {msg.isMe && (
                          <CheckCheck className="h-3 w-3 text-muted-foreground ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input message */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="gap-2">
                    <Send className="h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                <p className="text-muted-foreground">
                  Choisissez un contact dans la liste pour commencer à échanger
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
