import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { SuperAdminHeader } from "@/components/superadmin/SuperAdminHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Activity,
  FileText,
  Calendar,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Navigate } from "react-router-dom";

interface AuditLog {
  id: string;
  timestamp: Date;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  action: string;
  category: "user" | "professional" | "establishment" | "security" | "system";
  target?: {
    type: string;
    id: string;
    name: string;
  };
  severity: "info" | "warning" | "critical";
  details: string;
  ipAddress: string;
  metadata?: Record<string, any>;
}

const AdminAudit = () => {
  const { hasAnyRole, isLoading } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock data
  useState(() => {
    const mockLogs: AuditLog[] = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        actor: { id: "u1", name: "Dr. Nkoghe Admin", role: "super_admin" },
        action: "Approved professional registration",
        category: "professional",
        target: { type: "professional", id: "p123", name: "Dr. Marie Bongo" },
        severity: "info",
        details: "Professional registration approved for Dr. Marie Bongo (Cardiologist)",
        ipAddress: "41.207.xxx.xxx",
        metadata: { licenseNumber: "GA-DOC-2025-001", specialty: "Cardiology" }
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        actor: { id: "u2", name: "Admin Obame", role: "admin" },
        action: "Changed establishment status",
        category: "establishment",
        target: { type: "establishment", id: "e456", name: "CHU de Libreville" },
        severity: "warning",
        details: "Status changed from 'active' to 'suspended' for CHU de Libreville",
        ipAddress: "41.207.xxx.xxx",
        metadata: { previousStatus: "active", newStatus: "suspended", reason: "Maintenance inspection" }
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        actor: { id: "u1", name: "Dr. Nkoghe Admin", role: "super_admin" },
        action: "Rejected professional registration",
        category: "professional",
        target: { type: "professional", id: "p789", name: "Jean Ndong" },
        severity: "info",
        details: "Professional registration rejected - Invalid license documentation",
        ipAddress: "41.207.xxx.xxx",
        metadata: { rejectionReason: "Invalid license documentation" }
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        actor: { id: "u3", name: "System", role: "system" },
        action: "Failed login attempt",
        category: "security",
        severity: "critical",
        details: "Multiple failed login attempts detected from IP 192.168.1.100",
        ipAddress: "192.168.1.100",
        metadata: { attemptCount: 5, blocked: true }
      },
      {
        id: "5",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        actor: { id: "u2", name: "Admin Obame", role: "admin" },
        action: "Updated user profile",
        category: "user",
        target: { type: "user", id: "u999", name: "Patient Nguema" },
        severity: "info",
        details: "User profile updated - Contact information modified",
        ipAddress: "41.207.xxx.xxx",
        metadata: { fieldsChanged: ["phone", "email"] }
      },
      {
        id: "6",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        actor: { id: "u1", name: "Dr. Nkoghe Admin", role: "super_admin" },
        action: "Created new establishment",
        category: "establishment",
        target: { type: "establishment", id: "e999", name: "Clinique de la Sobraga" },
        severity: "info",
        details: "New establishment created: Clinique de la Sobraga (Port-Gentil)",
        ipAddress: "41.207.xxx.xxx",
        metadata: { type: "clinic", province: "Ogooué-Maritime", city: "Port-Gentil" }
      },
      {
        id: "7",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        actor: { id: "u3", name: "System", role: "system" },
        action: "Database backup completed",
        category: "system",
        severity: "info",
        details: "Automated daily database backup completed successfully",
        ipAddress: "127.0.0.1",
        metadata: { backupSize: "2.4GB", duration: "12m 34s" }
      },
      {
        id: "8",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
        actor: { id: "u2", name: "Admin Obame", role: "admin" },
        action: "Suspended professional account",
        category: "professional",
        target: { type: "professional", id: "p555", name: "Dr. Koumba" },
        severity: "warning",
        details: "Professional account suspended - Pending investigation",
        ipAddress: "41.207.xxx.xxx",
        metadata: { reason: "Multiple complaints received", reviewDate: "2025-01-15" }
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  });

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!hasAnyRole(['super_admin', 'admin'])) {
    return <Navigate to="/dashboard" replace />;
  }

  const stats = {
    total: logs.length,
    today: logs.filter(log => {
      const today = new Date();
      return log.timestamp.toDateString() === today.toDateString();
    }).length,
    critical: logs.filter(log => log.severity === 'critical').length,
    warnings: logs.filter(log => log.severity === 'warning').length
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (dateFilter) {
          case "today":
            return logDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return logDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return logDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleSeverityChange = (value: string) => {
    setSeverityFilter(value);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
  };

  const openDetailsDialog = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <Info className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return <Shield className="h-4 w-4" />;
      case "system":
        return <Activity className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Apply filters when dependencies change
  useEffect(() => {
    filterLogs();
  }, [searchTerm, categoryFilter, severityFilter, dateFilter]);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <SuperAdminHeader />
        
        <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Journal d'Audit</h1>
            <p className="text-muted-foreground">
              Historique des actions et événements système
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Tous les logs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">Événements du jour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critiques</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">Incidents critiques</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avertissements</CardTitle>
              <Info className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.warnings}</div>
              <p className="text-xs text-muted-foreground">À surveiller</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Action, utilisateur, détails..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="user">Utilisateurs</SelectItem>
                    <SelectItem value="professional">Professionnels</SelectItem>
                    <SelectItem value="establishment">Établissements</SelectItem>
                    <SelectItem value="security">Sécurité</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gravité</label>
                <Select value={severityFilter} onValueChange={handleSeverityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select value={dateFilter} onValueChange={handleDateChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Événements ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horodatage</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Acteur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.timestamp.toLocaleString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(log.severity)} className="gap-1">
                          {getSeverityIcon(log.severity)}
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="capitalize">{log.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.actor.name}</div>
                          <div className="text-xs text-muted-foreground">{log.actor.role}</div>
                        </div>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        {log.target ? (
                          <div>
                            <div className="font-medium">{log.target.name}</div>
                            <div className="text-xs text-muted-foreground">{log.target.type}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsDialog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'Événement</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Horodatage</label>
                    <p className="font-mono">{selectedLog.timestamp.toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ID Événement</label>
                    <p className="font-mono">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gravité</label>
                    <Badge variant={getSeverityColor(selectedLog.severity)} className="gap-1 mt-1">
                      {getSeverityIcon(selectedLog.severity)}
                      {selectedLog.severity}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getCategoryIcon(selectedLog.category)}
                      <span className="capitalize">{selectedLog.category}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Acteur</label>
                    <p className="font-medium">{selectedLog.actor.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.actor.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adresse IP</label>
                    <p className="font-mono">{selectedLog.ipAddress}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>

                {selectedLog.target && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cible</label>
                    <p className="font-medium">{selectedLog.target.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLog.target.type} (ID: {selectedLog.target.id})
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Détails</label>
                  <p className="mt-1">{selectedLog.details}</p>
                </div>

                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Métadonnées</label>
                    <pre className="mt-1 p-4 bg-muted rounded-lg overflow-x-auto text-xs">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminAudit;
