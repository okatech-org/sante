import { useState } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Search, Plus, MapPin, Phone, Mail, CheckCircle, XCircle, Clock, Eye, Ban, Edit } from "lucide-react";
import { toast } from "sonner";

export default function AdminEstablishments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const establishments = [
    {
      id: "1",
      name: "CHU de Libreville",
      type: "hospital",
      status: "verified",
      city: "Libreville",
      province: "Estuaire",
      phone: "+241 01 76 24 68",
      email: "contact@chu-libreville.ga",
      beds: 450,
      staff: 234,
      services: ["Urgences", "Chirurgie", "Maternité", "Cardiologie"],
      cnamgs: true,
      created_at: "2023-01-15"
    },
    {
      id: "2",
      name: "Clinique Mandji",
      type: "clinic",
      status: "verified",
      city: "Port-Gentil",
      province: "Ogooué-Maritime",
      phone: "+241 01 55 34 89",
      email: "contact@clinique-mandji.ga",
      beds: 45,
      staff: 67,
      services: ["Consultations", "Chirurgie", "Imagerie"],
      cnamgs: true,
      created_at: "2023-03-20"
    },
    {
      id: "3",
      name: "Pharmacie de la Grâce",
      type: "pharmacy",
      status: "verified",
      city: "Libreville",
      province: "Estuaire",
      phone: "+241 01 44 55 66",
      email: "pharmacie.grace@gmail.com",
      beds: 0,
      staff: 8,
      services: ["Médicaments", "Garde 24/7", "Livraison"],
      cnamgs: true,
      created_at: "2023-05-10"
    },
    {
      id: "4",
      name: "Laboratoire Bio-Santé",
      type: "laboratory",
      status: "pending",
      city: "Libreville",
      province: "Estuaire",
      phone: "+241 01 77 88 99",
      email: "contact@biosante.ga",
      beds: 0,
      staff: 15,
      services: ["Biochimie", "Hématologie", "Microbiologie"],
      cnamgs: false,
      created_at: "2024-12-15"
    },
    {
      id: "5",
      name: "Cabinet Médical Glass",
      type: "cabinet",
      status: "verified",
      city: "Libreville",
      province: "Estuaire",
      phone: "+241 01 33 22 11",
      email: "cabinet.glass@sante.ga",
      beds: 0,
      staff: 5,
      services: ["Médecine générale", "Pédiatrie"],
      cnamgs: true,
      created_at: "2023-08-01"
    }
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hospital: "Hôpital",
      clinic: "Clinique",
      pharmacy: "Pharmacie",
      laboratory: "Laboratoire",
      cabinet: "Cabinet médical"
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      verified: { label: "Vérifié", className: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30" },
      pending: { label: "En attente", className: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30" },
      suspended: { label: "Suspendu", className: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30" }
    };
    const variant = variants[status] || variants.pending;
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

  const filteredEstablishments = establishments.filter(est => {
    const matchesSearch = est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         est.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || est.type === filterType;
    const matchesStatus = filterStatus === "all" || est.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: establishments.length,
    verified: establishments.filter(e => e.status === "verified").length,
    pending: establishments.filter(e => e.status === "pending").length,
    hospitals: establishments.filter(e => e.type === "hospital").length,
    clinics: establishments.filter(e => e.type === "clinic").length,
    pharmacies: establishments.filter(e => e.type === "pharmacy").length
  };

  const handleVerify = (id: string) => {
    toast.success("Établissement vérifié avec succès");
  };

  const handleSuspend = (id: string) => {
    toast.error("Établissement suspendu");
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Gestion des Établissements
          </h1>
          <p className="text-muted-foreground mt-2">
            Administrez les structures de santé de SANTE.GA
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
              <p className="text-xs text-muted-foreground mt-1">Vérifiés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">En attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.hospitals}</div>
              <p className="text-xs text-muted-foreground mt-1">Hôpitaux</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.clinics}</div>
              <p className="text-xs text-muted-foreground mt-1">Cliniques</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.pharmacies}</div>
              <p className="text-xs text-muted-foreground mt-1">Pharmacies</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Liste des établissements</CardTitle>
                <CardDescription>Gérez et validez les structures de santé</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nouvel établissement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un établissement</DialogTitle>
                    <DialogDescription>
                      Créez un nouvel établissement de santé
                    </DialogDescription>
                  </DialogHeader>
                  {/* Form would go here */}
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Formulaire de création à implémenter...</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="hospital">Hôpitaux</SelectItem>
                  <SelectItem value="clinic">Cliniques</SelectItem>
                  <SelectItem value="pharmacy">Pharmacies</SelectItem>
                  <SelectItem value="laboratory">Laboratoires</SelectItem>
                  <SelectItem value="cabinet">Cabinets</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="verified">Vérifiés</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>CNAMGS</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstablishments.map((est) => (
                    <TableRow key={est.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{est.name}</div>
                          {est.type === "hospital" && (
                            <div className="text-xs text-muted-foreground">
                              {est.beds} lits • {est.staff} personnel
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(est.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {est.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {est.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {est.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(est.status)}</TableCell>
                      <TableCell>
                        {est.cnamgs ? (
                          <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Oui
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30">
                            <XCircle className="w-3 h-3 mr-1" />
                            Non
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {est.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleVerify(est.id)}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          {est.status === "verified" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSuspend(est.id)}
                            >
                              <Ban className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayoutSimple>
  );
}

