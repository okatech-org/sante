import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Bed, 
  Activity,
  Search,
  Filter
} from "lucide-react";
import { HealthEstablishment, GABON_PROVINCES } from "@/types/ministry";

export const NationalEstablishmentsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const mockEstablishments: HealthEstablishment[] = [
    {
      id: "est-001",
      nom: "Centre Hospitalier Universitaire de Libreville",
      type: "chu",
      province: "Estuaire",
      ville: "Libreville",
      adresse: "Avenue Bouët, Libreville",
      telephone: "+241 01-76-30-01",
      email: "contact@chul.ga",
      secteur: "public",
      status_operationnel: "operationnel",
      capacite_lits: 450,
      taux_occupation: 78,
      services_disponibles: ["Urgences", "Maternité", "Chirurgie", "Radiologie", "Laboratoire"],
      equipements_majeurs: [
        { nom: "Scanner", quantite: 2, etat: "fonctionnel" },
        { nom: "IRM", quantite: 1, etat: "fonctionnel" },
        { nom: "Radiographie", quantite: 4, etat: "fonctionnel" }
      ],
      autorisation_exploitation: {
        numero: "AE-001-2024",
        date_delivrance: "2024-01-15",
        date_expiration: "2029-01-15"
      }
    },
    {
      id: "est-002",
      nom: "CHR de Franceville",
      type: "chr",
      province: "Haut-Ogooué",
      ville: "Franceville",
      adresse: "Centre-ville, Franceville",
      telephone: "+241 01-67-50-20",
      email: "contact@chrfranceville.ga",
      secteur: "public",
      status_operationnel: "operationnel",
      capacite_lits: 250,
      taux_occupation: 65,
      services_disponibles: ["Urgences", "Maternité", "Chirurgie", "Pédiatrie"],
      equipements_majeurs: [
        { nom: "Scanner", quantite: 1, etat: "en_panne" },
        { nom: "Échographie", quantite: 2, etat: "fonctionnel" }
      ],
      autorisation_exploitation: {
        numero: "AE-042-2023",
        date_delivrance: "2023-06-10",
        date_expiration: "2028-06-10"
      }
    },
    {
      id: "est-003",
      nom: "Clinique SOGARA",
      type: "clinique",
      province: "Estuaire",
      ville: "Libreville",
      adresse: "Quartier Sogara, PK8, Libreville",
      telephone: "+241 01-77-00-00",
      email: "contact@cliniquesogara.ga",
      secteur: "prive",
      status_operationnel: "operationnel",
      capacite_lits: 80,
      taux_occupation: 70,
      services_disponibles: ["Urgences", "Consultations", "Imagerie", "Laboratoire", "Hospitalisation"],
      equipements_majeurs: [
        { nom: "Scanner", quantite: 1, etat: "fonctionnel" },
        { nom: "Échographie", quantite: 3, etat: "fonctionnel" }
      ],
      autorisation_exploitation: {
        numero: "AE-150-2022",
        date_delivrance: "2022-03-20",
        date_expiration: "2027-03-20"
      }
    }
  ];

  const [establishments] = useState<HealthEstablishment[]>(mockEstablishments);

  const filteredEstablishments = establishments.filter(est => {
    const matchesSearch = est.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         est.ville.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = selectedProvince === "all" || est.province === selectedProvince;
    const matchesType = selectedType === "all" || est.type === selectedType;
    const matchesStatus = selectedStatus === "all" || est.status_operationnel === selectedStatus;
    
    return matchesSearch && matchesProvince && matchesType && matchesStatus;
  });

  const getStatusColor = (status: HealthEstablishment['status_operationnel']) => {
    switch(status) {
      case 'operationnel': return 'default';
      case 'partiel': return 'warning';
      case 'en_maintenance': return 'secondary';
      case 'ferme': return 'destructive';
    }
  };

  const getStatusLabel = (status: HealthEstablishment['status_operationnel']) => {
    switch(status) {
      case 'operationnel': return 'Opérationnel';
      case 'partiel': return 'Partiel';
      case 'en_maintenance': return 'Maintenance';
      case 'ferme': return 'Fermé';
    }
  };

  const getTypeLabel = (type: HealthEstablishment['type']) => {
    switch(type) {
      case 'chu': return 'CHU';
      case 'chr': return 'CHR';
      case 'chd': return 'CHD';
      case 'centre_sante': return 'Centre de Santé';
      case 'clinique': return 'Clinique';
      case 'hopital_militaire': return 'Hôpital Militaire';
      case 'dispensaire': return 'Dispensaire';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Annuaire National des Structures de Santé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger>
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les provinces</SelectItem>
                {GABON_PROVINCES.map(province => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="chu">CHU</SelectItem>
                <SelectItem value="chr">CHR</SelectItem>
                <SelectItem value="chd">CHD</SelectItem>
                <SelectItem value="centre_sante">Centre de Santé</SelectItem>
                <SelectItem value="clinique">Clinique</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="operationnel">Opérationnel</SelectItem>
                <SelectItem value="partiel">Partiel</SelectItem>
                <SelectItem value="en_maintenance">Maintenance</SelectItem>
                <SelectItem value="ferme">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{establishments.length}</div>
              <div className="text-sm text-blue-600">Total Établissements</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {establishments.filter(e => e.status_operationnel === 'operationnel').length}
              </div>
              <div className="text-sm text-green-600">Opérationnels</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {establishments.reduce((sum, e) => sum + e.capacite_lits, 0)}
              </div>
              <div className="text-sm text-purple-600">Lits Totaux</div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEstablishments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun établissement trouvé avec ces critères</p>
              </div>
            ) : (
              filteredEstablishments.map((est) => (
                <Card key={est.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold">{est.nom}</h3>
                            <Badge variant={getStatusColor(est.status_operationnel)}>
                              {getStatusLabel(est.status_operationnel)}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{getTypeLabel(est.type)}</Badge>
                            <Badge variant="outline">{est.secteur.toUpperCase()}</Badge>
                            <Badge variant="outline">{est.province}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{est.adresse}, {est.ville}</span>
                          </div>
                          
                          {est.telephone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{est.telephone}</span>
                            </div>
                          )}
                          
                          {est.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{est.email}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Bed className="h-4 w-4" />
                            <span>{est.capacite_lits} lits • Occupation: {est.taux_occupation}%</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {est.services_disponibles.slice(0, 5).map((service) => (
                            <span
                              key={service}
                              className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                            >
                              {service}
                            </span>
                          ))}
                          {est.services_disponibles.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                              +{est.services_disponibles.length - 5} autres
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <Activity className="h-4 w-4 mr-2" />
                            Voir Détails
                          </Button>
                          <Button size="sm" variant="outline">
                            Inspection
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

