import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Menu,
  Home,
  Calendar,
  Video,
  Shield,
  Activity,
  Bell,
  Settings,
  FileHeart,
  Pill,
  Search,
  Star,
  Download,
  FileText,
  Image as ImageIcon,
  Film,
  Paperclip,
  Inbox,
  MailOpen,
  AlertCircle,
  Hospital,
  Stethoscope,
  FlaskConical,
  Building2,
  Trash2,
  RefreshCw,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logoSante from "@/assets/logo_sante.png";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: string;
  sender_id: string | null;
  sender_name: string;
  sender_type: 'doctor' | 'hospital' | 'pharmacy' | 'laboratory' | 'admin' | 'system';
  subject: string;
  content: string;
  attachments: Array<{
    name: string;
    type: string;
    size: string;
    url: string;
    preview?: string;
    thumbnail?: string;
    duration?: string;
  }>;
  is_read: boolean;
  is_starred: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'appointment' | 'result' | 'prescription' | 'billing' | 'reminder' | 'alert';
  created_at: string;
  read_at: string | null;
  allow_reply: boolean;
  parent_message_id: string | null;
  deleted_at: string | null;
}

export default function Support() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('messages');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [repliedMessageIds, setRepliedMessageIds] = useState<Set<string>>(new Set());

  const fullName = (user?.user_metadata as any)?.full_name || 'Utilisateur';

  useEffect(() => {
    loadAvatar();
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user?.id}`
      }, () => {
        loadMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const loadAvatar = async () => {
    if (user?.id) {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
  };

  const loadMessages = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // First check if user has any messages
      const { data: existingMessages, error: checkError } = await supabase
        .from('messages')
        .select('id')
        .eq('recipient_id', user?.id)
        .limit(1);

      if (checkError) {
        console.error('Error checking messages:', checkError);
      }

      // If no messages exist for this user, create demo messages
      if (existingMessages && existingMessages.length === 0) {
        await createDemoMessages();
        // After creating, load will happen in createDemoMessages
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading messages:', error);
        toast.error("Erreur lors du chargement des messages");
      } else {
        setMessages((data as any) || []);
        
        // Load replied message IDs
        const { data: repliedMessages } = await supabase
          .from('messages')
          .select('parent_message_id')
          .eq('sender_id', user?.id)
          .not('parent_message_id', 'is', null);
        
        if (repliedMessages) {
          setRepliedMessageIds(new Set(repliedMessages.map(m => m.parent_message_id).filter(Boolean)));
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const createDemoMessages = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-demo-messages');
      
      if (error) {
        console.error('Error creating demo messages:', error);
        return;
      }

      console.log('Demo messages created:', data);
      
      // Reload messages after creation
      await loadMessages();
    } catch (error) {
      console.error('Error in createDemoMessages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAsUnread = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: false })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: false } : msg
      ));

      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, is_read: false });
      }

      toast.success("Message marqué comme non lu");
    } catch (error) {
      console.error('Error marking message as unread:', error);
      toast.error("Erreur lors du marquage comme non lu");
    }
  };

  const toggleStar = async (messageId: string, currentStarred: boolean) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_starred: !currentStarred })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_starred: !currentStarred } : msg
      ));

      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, is_starred: !currentStarred });
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setIsMessageDialogOpen(true);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const handleCloseDialog = () => {
    setIsMessageDialogOpen(false);
    setReplyContent("");
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !selectedMessage || !user?.id) {
      toast.error("Veuillez saisir un message");
      return;
    }

    try {
      setIsSendingReply(true);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedMessage.sender_id,
          sender_name: profileData?.full_name || 'Patient',
          sender_type: 'patient',
          subject: `Re: ${selectedMessage.subject}`,
          content: replyContent,
          parent_message_id: selectedMessage.id,
          category: selectedMessage.category,
          priority: 'normal',
          attachments: []
        });

      if (error) throw error;

      toast.success("Réponse envoyée avec succès");
      setReplyContent("");
      handleCloseDialog();

      // Add to replied message IDs
      if (selectedMessage?.id) {
        setRepliedMessageIds(prev => new Set([...prev, selectedMessage.id]));
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error("Erreur lors de l'envoi de la réponse");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, deleted_at: new Date().toISOString() }
          : msg
      ));

      toast.success("Message déplacé vers la poubelle");
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Erreur lors de la suppression du message");
    }
  };

  const handleRestoreMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: null })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, deleted_at: null }
          : msg
      ));

      toast.success("Message restauré");
    } catch (error) {
      console.error('Error restoring message:', error);
      toast.error("Erreur lors de la restauration du message");
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (selectedTab) {
      case 'all':
        return !message.deleted_at;
      case 'unread':
        return !message.is_read && !message.deleted_at;
      case 'starred':
        return message.is_starred && !message.deleted_at;
      case 'replied':
        return repliedMessageIds.has(message.id) && !message.deleted_at;
      case 'trash':
        return message.deleted_at !== null;
      default:
        return !message.deleted_at;
    }
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/dashboard/patient', color: '#00d4ff' },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar, badge: '2', path: '/appointments', color: '#0088ff' },
    { id: 'teleconsult', label: 'Téléconsultation', icon: Video, path: '/teleconsultation', color: '#00d4ff' },
    { id: 'dossier', label: 'Dossier Médical', icon: FileHeart, path: '/medical-record', color: '#ffaa00' },
    { id: 'ordonnances', label: 'Mes ordonnances', icon: Pill, badge: '1', path: '/prescriptions', color: '#ff0088' },
    { id: 'resultats', label: 'Résultats d\'analyses', icon: Activity, path: '/results', color: '#0088ff' },
    { id: 'cnamgs', label: 'Droits CNAMGS', icon: Shield, path: '/reimbursements', color: '#00d4ff' },
    { id: 'messages', label: 'Messages', icon: Bell, badge: unreadCount > 0 ? unreadCount.toString() : undefined, path: '/messages', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/profile', color: '#ff0088' }
  ];

  const getSenderIcon = (type: string) => {
    switch (type) {
      case 'doctor': return <Stethoscope className="h-5 w-5" />;
      case 'hospital': return <Hospital className="h-5 w-5" />;
      case 'pharmacy': return <Pill className="h-5 w-5" />;
      case 'laboratory': return <FlaskConical className="h-5 w-5" />;
      case 'admin': return <Building2 className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Général',
      appointment: 'Rendez-vous',
      result: 'Résultats',
      prescription: 'Ordonnance',
      billing: 'Facturation',
      reminder: 'Rappel',
      alert: 'Alerte'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getAttachmentIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (type.includes('image')) return <ImageIcon className="h-4 w-4" />;
    if (type.includes('video')) return <Film className="h-4 w-4" />;
    return <Paperclip className="h-4 w-4" />;
  };

  const renderAttachment = (attachment: any, index: number) => {
    // Image attachment
    if (attachment.type.includes('image')) {
      return (
        <div key={index} className="relative group overflow-hidden rounded-lg">
          <img 
            src={attachment.preview || attachment.url} 
            alt={attachment.name}
            className="w-full h-48 object-cover cursor-pointer transition-transform group-hover:scale-105"
            onClick={() => window.open(attachment.url, '_blank')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-white/80 text-xs">{attachment.size}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Téléchargement en cours...");
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Video attachment
    if (attachment.type.includes('video')) {
      return (
        <div key={index} className="relative rounded-lg overflow-hidden bg-black group">
          {attachment.url.includes('youtube') || attachment.url.includes('youtu.be') ? (
            <div className="aspect-video">
              <iframe
                src={attachment.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : attachment.thumbnail ? (
            <div className="aspect-video relative cursor-pointer" onClick={() => window.open(attachment.url, '_blank')}>
              <img 
                src={attachment.thumbnail} 
                alt={attachment.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Film className="h-8 w-8 text-[#ff0088]" />
                </div>
              </div>
              {attachment.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {attachment.duration}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <Film className="h-12 w-12 text-gray-600" />
            </div>
          )}
          <div className="p-3 bg-[#1a1f2e]">
            <p className="text-white text-sm font-medium truncate">{attachment.name}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-gray-400 text-xs">{attachment.size}</p>
              {attachment.duration && (
                <p className="text-gray-400 text-xs">⏱ {attachment.duration}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // PDF and other documents
    return (
      <Card key={index} className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            {getAttachmentIcon(attachment.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-[#00d4ff] transition-colors">
              {attachment.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {attachment.size}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-[#00d4ff] hover:text-[#0088ff] hover:bg-white/5"
            onClick={() => {
              toast.success("Téléchargement en cours...");
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background étoilé */}
      <div className="fixed inset-0 bg-[#0f1419] -z-10">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
          backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
        }} />
      </div>

      <div className="relative flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 p-4 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/90 border border-white/10 shadow-2xl flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-2xl font-bold text-white">SANTE.GA</h1>
              </div>
              <p className="text-xs text-gray-500">Votre santé à portée de clic</p>
            </div>

            <nav className="space-y-1 flex-1 overflow-y-auto">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      if (item.path) navigate(item.path);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? '' : 'bg-white/5'
                        }`}
                        style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                      >
                        <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{fullName.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e]/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-bold text-white tracking-tight">SANTE.GA</h1>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#1a1f2e] border-white/10 p-0">
                <div className="h-full flex flex-col p-6">
                  <div className="mb-8 mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
                      <h1 className="text-2xl font-bold text-white tracking-tight">SANTE.GA</h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">Votre santé à portée de clic</p>
                  </div>

                  <nav className="space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map(item => {
                      const Icon = item.icon;
                      const isActive = activeMenu === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveMenu(item.id);
                            if (item.path) navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isActive ? '' : 'bg-white/5'
                              }`}
                              style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                            >
                              <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                              style={{ backgroundColor: item.color }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-20 md:pt-0">
          <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    <span className="bg-gradient-to-r from-[#ffaa00] via-[#ff8800] to-[#ff6600] bg-clip-text text-transparent">Messages</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                    Communications des professionnels de santé
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Badge className="bg-[#ffaa00] text-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm flex-shrink-0">
                    {unreadCount}
                  </Badge>
                )}
              </div>

              {/* Search and Tabs */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 sm:h-10 text-sm"
                  />
                </div>

                {/* Tabs Filter */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-1 grid grid-cols-5 w-full">
                  <button
                    onClick={() => setSelectedTab("all")}
                    className={`flex items-center justify-center gap-1 px-1.5 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      selectedTab === "all" ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Inbox className="h-4 w-4" />
                    <span className="hidden lg:inline">Tous</span>
                  </button>
                  <button
                    onClick={() => setSelectedTab("unread")}
                    className={`flex items-center justify-center gap-1 px-1.5 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      selectedTab === "unread" ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <MailOpen className="h-4 w-4" />
                    <span className="hidden lg:inline">Non lus</span>
                  </button>
                  <button
                    onClick={() => setSelectedTab("starred")}
                    className={`flex items-center justify-center gap-1 px-1.5 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      selectedTab === "starred" ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Star className="h-4 w-4" />
                    <span className="hidden lg:inline">Favoris</span>
                  </button>
                  <button
                    onClick={() => setSelectedTab("replied")}
                    className={`flex items-center justify-center gap-1 px-1.5 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      selectedTab === "replied" ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden lg:inline">Répondus</span>
                  </button>
                  <button
                    onClick={() => setSelectedTab("trash")}
                    className={`flex items-center justify-center gap-1 px-1.5 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      selectedTab === "trash" ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden lg:inline">Poubelle</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Messages List */}
              <div className="w-full flex flex-col">
                <ScrollArea className="flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center h-full py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffaa00]" />
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 py-12">
                      <Inbox className="h-12 w-12 text-gray-500 mb-3" />
                      <p className="text-gray-400">Aucun message</p>
                    </div>
                  ) : (
                    <>
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleMessageClick(message)}
                          className={`mx-3 my-3 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-all active:bg-white/[0.15] ${
                            selectedMessage?.id === message.id ? 'bg-white/10 border-white/20' : ''
                          } ${!message.is_read ? 'border-l-4 border-l-[#ffaa00]' : ''}`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              message.sender_type === 'doctor' ? 'bg-blue-500/10 text-blue-400' :
                              message.sender_type === 'hospital' ? 'bg-green-500/10 text-green-400' :
                              message.sender_type === 'pharmacy' ? 'bg-purple-500/10 text-purple-400' :
                              message.sender_type === 'laboratory' ? 'bg-orange-500/10 text-orange-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>
                              {getSenderIcon(message.sender_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-xs sm:text-sm font-medium truncate ${
                                  !message.is_read ? 'text-white' : 'text-gray-300'
                                }`}>
                                  {message.sender_name}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (message.deleted_at) {
                                      handleRestoreMessage(message.id);
                                    } else {
                                      toggleStar(message.id, message.is_starred);
                                    }
                                  }}
                                  className="ml-2 p-1 hover:bg-white/5 rounded transition-colors flex-shrink-0"
                                  title={message.deleted_at ? "Restaurer" : "Marquer comme favori"}
                                >
                                  {message.deleted_at ? (
                                    <RefreshCw className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <Star className={`h-4 w-4 ${
                                      message.is_starred ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'
                                    }`} />
                                  )}
                                </button>
                              </div>
                              <p className={`text-xs sm:text-sm truncate mb-1 ${
                                !message.is_read ? 'text-white font-medium' : 'text-gray-400'
                              }`}>
                                {message.subject}
                              </p>
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <Badge variant="outline" className="text-[10px] sm:text-xs border-white/20 text-gray-400 px-1.5 py-0">
                                  {getCategoryLabel(message.category)}
                                </Badge>
                                {message.priority !== 'normal' && (
                                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getPriorityColor(message.priority)}`} />
                                )}
                                {message.attachments && message.attachments.length > 0 && (
                                  <Badge variant="secondary" className="text-[10px] sm:text-xs bg-white/5 px-1.5 py-0">
                                    <Paperclip className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                    {message.attachments.length}
                                  </Badge>
                                )}
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  {format(new Date(message.created_at), 'dd MMM', { locale: fr })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </ScrollArea>
              </div>

              {/* Message Detail Dialog - Centered floating modal */}
              <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-[#1a1f2e] border border-white/20 overflow-hidden animate-in fade-in-0 zoom-in-95">
                  {selectedMessage && (
                    <div className="flex flex-col h-full max-h-[90vh]">
                      {/* Message Header */}
                      <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`p-3 rounded-lg flex-shrink-0 ${
                            selectedMessage.sender_type === 'doctor' ? 'bg-blue-500/10 text-blue-400' :
                            selectedMessage.sender_type === 'hospital' ? 'bg-green-500/10 text-green-400' :
                            selectedMessage.sender_type === 'pharmacy' ? 'bg-purple-500/10 text-purple-400' :
                            selectedMessage.sender_type === 'laboratory' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {getSenderIcon(selectedMessage.sender_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-white text-lg sm:text-xl">
                                  {selectedMessage.sender_name}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                  {format(new Date(selectedMessage.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(selectedMessage.id, selectedMessage.is_starred);
                                }}
                                className="flex-shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <Star className={`h-5 w-5 ${
                                  selectedMessage.is_starred ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'
                                }`} />
                              </button>
                            </div>
                            
                            <div className="mt-3">
                              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                                {selectedMessage.subject}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                                  {getCategoryLabel(selectedMessage.category)}
                                </Badge>
                                {selectedMessage.priority !== 'normal' && (
                                  <Badge className={`${getPriorityColor(selectedMessage.priority)} text-white border-0 text-xs`}>
                                    {selectedMessage.priority === 'urgent' ? 'Urgent' :
                                     selectedMessage.priority === 'high' ? 'Haute' :
                                     selectedMessage.priority === 'low' ? 'Basse' : 'Normal'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message Content */}
                      <ScrollArea className="flex-1 p-4 sm:p-6">
                        <div className="prose prose-invert max-w-none">
                          <p className="text-sm sm:text-base text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {selectedMessage.content}
                          </p>
                        </div>

                        {/* Attachments */}
                        {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                              <Paperclip className="h-4 w-4" />
                              Pièces jointes ({selectedMessage.attachments.length})
                            </h4>
                            <div className="space-y-3">
                              {selectedMessage.attachments.map((attachment, index) => 
                                renderAttachment(attachment, index)
                              )}
                            </div>
                          </div>
                        )}

                        {/* Reply Section */}
                        {selectedMessage.allow_reply && !selectedMessage.deleted_at && (
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <h4 className="text-sm font-semibold text-white mb-3">Répondre</h4>
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Écrivez votre réponse..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setReplyContent("")}
                                  className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                  Annuler
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleSendReply}
                                  disabled={!replyContent.trim() || isSendingReply}
                                  className="bg-gradient-to-r from-[#ffaa00] to-[#ff6600] text-white hover:opacity-90"
                                >
                                  {isSendingReply ? "Envoi..." : "Envoyer"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </ScrollArea>

                      {/* Footer with action buttons */}
                      <div className="p-4 sm:p-6 border-t border-white/10 flex-shrink-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedMessage && !selectedMessage.deleted_at && (
                            <>
                              <Button
                                onClick={() => handleDeleteMessage(selectedMessage.id)}
                                variant="outline"
                                size="sm"
                                className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                              {selectedMessage.is_read && (
                                <Button
                                  onClick={() => markAsUnread(selectedMessage.id)}
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                                >
                                  <MailOpen className="h-4 w-4 mr-2" />
                                  Marquer comme non lu
                                </Button>
                              )}
                            </>
                          )}
                          {selectedMessage && selectedMessage.deleted_at && (
                            <Button
                              onClick={() => handleRestoreMessage(selectedMessage.id)}
                              variant="outline"
                              size="sm"
                              className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Restaurer
                            </Button>
                          )}
                          <div className="flex-1" />
                          <Button
                            onClick={handleCloseDialog}
                            variant="outline"
                            size="sm"
                            className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                          >
                            Fermer
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}