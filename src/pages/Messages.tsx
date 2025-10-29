import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService } from "@/services/patientService";
import { 
  Bell, Mail, Calendar, AlertCircle, CheckCircle,
  Loader2, Trash2, Eye
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Messages() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'appointment': return <Calendar className="w-5 h-5" />;
      case 'prescription': return <Mail className="w-5 h-5" />;
      case 'result': return <CheckCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Messages & Notifications
            </h1>
            <p className="text-muted-foreground">{unreadCount} message(s) non lu(s)</p>
          </div>
          <Button variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Non lus</p>
                  <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                </div>
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Lus</p>
                  <p className="text-2xl font-bold text-green-600">
                    {notifications.length - unreadCount}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border rounded-lg flex items-start gap-4 ${
                        !notif.read ? 'bg-primary/5 border-primary/20' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !notif.read ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {getTypeIcon(notif.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold">{notif.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                            <p className="text-xs text-muted-foreground/70 mt-2">
                              {new Date(notif.date).toLocaleString('fr-FR')}
                            </p>
                          </div>
                          {!notif.read && (
                            <Badge className="bg-primary/20 text-primary">Nouveau</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        {!notif.read && (
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3">
                {notifications.filter(n => !n.read).map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 border rounded-lg flex items-start gap-4 bg-primary/5 border-primary/20"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
                      {getTypeIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{notif.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {new Date(notif.date).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}
