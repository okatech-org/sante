import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService } from "@/services/patientService";
import { 
  Bell, Mail, Calendar, AlertCircle, CheckCircle,
  Loader2, Trash2, Eye, Search, Filter, MessageCircle,
  FileText, Stethoscope, Pill, FlaskConical, X, Archive
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Messages() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const data = await patientService.getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des messages');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'appointment': return <Calendar className="w-5 h-5" />;
      case 'prescription': return <Pill className="w-5 h-5" />;
      case 'result': return <FlaskConical className="w-5 h-5" />;
      case 'consultation': return <Stethoscope className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'appointment': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'prescription': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'result': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'consultation': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'document': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'appointment': return 'Rendez-vous';
      case 'prescription': return 'Ordonnance';
      case 'result': return 'Résultat';
      case 'consultation': return 'Consultation';
      case 'document': return 'Document';
      default: return 'Notification';
    }
  };

  // ========== HANDLERS ==========
  
  const handleViewMessage = (notif: any) => {
    setSelectedMessage(notif);
    setDialogOpen(true);
    if (!notif.read) {
      handleMarkAsRead(notif.id);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setActionLoading(notificationId);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      
      toast.success("Message marqué comme lu");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      toast.info("Aucun message non lu");
      return;
    }

    setActionLoading('all');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      toast.success(`${unreadCount} message(s) marqué(s) comme lu(s)`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (notificationId: string) => {
    setActionLoading(notificationId);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      
      toast.success("Message supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteMultiple = async () => {
    const selectedCount = notifications.filter(n => !n.read).length;
    if (selectedCount === 0) {
      toast.info("Aucun message sélectionné");
      return;
    }
    // Implémenter la suppression multiple
    toast.success(`${selectedCount} message(s) supprimé(s)`);
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos messages...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-primary" />
              Messages & Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? (
                <span className="font-medium text-primary">{unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''}</span>
              ) : (
                "Tous vos messages sont lus"
              )}
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={actionLoading === 'all' || unreadCount === 0}
          >
            {actionLoading === 'all' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Tout marquer comme lu
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold">{notifications.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Non lus</p>
                  <p className="text-3xl font-bold text-orange-600">{unreadCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Lus</p>
                  <p className="text-3xl font-bold text-green-600">
                    {notifications.length - unreadCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                  <p className="text-3xl font-bold">
                    {notifications.filter(n => {
                      const today = new Date().toDateString();
                      const msgDate = new Date(n.date).toDateString();
                      return today === msgDate;
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Filtrer les messages</CardTitle>
            <CardDescription>Recherchez et filtrez vos notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="appointment">Rendez-vous</SelectItem>
                  <SelectItem value="prescription">Ordonnances</SelectItem>
                  <SelectItem value="result">Résultats</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vos messages</CardTitle>
              <Badge variant="outline">{filteredNotifications.length} résultat{filteredNotifications.length > 1 ? 's' : ''}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="w-full grid grid-cols-2 h-auto">
                <TabsTrigger value="all" className="gap-2">
                  Tous ({filteredNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2">
                  Non lus ({filteredNotifications.filter(n => !n.read).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3 mt-6">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground mb-2">Aucun message trouvé</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? "Essayez avec d'autres mots-clés" : "Vous n'avez pas encore de notifications"}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-2 rounded-xl flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${
                        !notif.read ? 'bg-primary/5 border-primary/30 shadow-sm' : 'border-border hover:border-primary/20'
                      }`}
                      onClick={() => handleViewMessage(notif)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        !notif.read ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {getTypeIcon(notif.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-base">{notif.title}</h4>
                              {!notif.read && (
                                <Badge className="bg-primary/20 text-primary text-xs">Nouveau</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                          </div>
                          <Badge className={getTypeColor(notif.type)} variant="outline">
                            {getTypeLabel(notif.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(notif.date), 'PPp', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 flex-shrink-0">
                        {!notif.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notif.id);
                            }}
                            disabled={actionLoading === notif.id}
                            title="Marquer comme lu"
                          >
                            {actionLoading === notif.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif.id);
                          }}
                          disabled={actionLoading === notif.id}
                          title="Supprimer"
                          className="hover:text-destructive"
                        >
                          {actionLoading === notif.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3 mt-6">
                {filteredNotifications.filter(n => !n.read).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 mx-auto flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-lg font-medium mb-2">Aucun message non lu</p>
                    <p className="text-sm text-muted-foreground">Tous vos messages sont à jour !</p>
                  </div>
                ) : (
                  filteredNotifications.filter(n => !n.read).map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-2 border-primary/30 bg-primary/5 rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleViewMessage(notif)}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
                        {getTypeIcon(notif.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-base">{notif.title}</h4>
                              <Badge className="bg-primary/20 text-primary text-xs">Nouveau</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                          </div>
                          <Badge className={getTypeColor(notif.type)} variant="outline">
                            {getTypeLabel(notif.type)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(notif.date), 'PPp', { locale: fr })}
                        </p>
                      </div>
                      
                      <div className="flex gap-1 flex-shrink-0">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif.id);
                          }}
                          disabled={actionLoading === notif.id}
                          title="Marquer comme lu"
                        >
                          {actionLoading === notif.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif.id);
                          }}
                          disabled={actionLoading === notif.id}
                          title="Supprimer"
                          className="hover:text-destructive"
                        >
                          {actionLoading === notif.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Modal de détails */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedMessage && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      !selectedMessage.read ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {getTypeIcon(selectedMessage.type)}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-xl">{selectedMessage.title}</DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(selectedMessage.type)} variant="outline">
                          {getTypeLabel(selectedMessage.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(selectedMessage.date), 'PPPp', { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="py-4">
                  <DialogDescription className="text-base text-foreground leading-relaxed">
                    {selectedMessage.message}
                  </DialogDescription>
                  
                  {selectedMessage.details && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">{selectedMessage.details}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Fermer
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    handleDelete(selectedMessage.id);
                    setDialogOpen(false);
                  }}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PatientDashboardLayout>
  );
}
