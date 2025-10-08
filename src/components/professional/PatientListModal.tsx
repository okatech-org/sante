import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Eye, FileText, Calendar } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PatientListModalProps {
  open: boolean;
  onClose: () => void;
}

export function PatientListModal({ open, onClose }: PatientListModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const mockPatients = [
    {
      id: "1",
      name: "Marie OKOME",
      age: 34,
      gender: "F",
      cnamgs: "GAB123456789",
      phone: "+241 06 12 34 56",
      lastVisit: "2025-02-05",
      status: "Actif"
    },
    {
      id: "2",
      name: "Jean MBADINGA",
      age: 58,
      gender: "M",
      cnamgs: "GAB987654321",
      phone: "+241 06 98 76 54",
      lastVisit: "2025-02-01",
      status: "Suivi"
    },
    {
      id: "3",
      name: "Sophie NGUEMA",
      age: 42,
      gender: "F",
      cnamgs: null,
      phone: "+241 06 11 22 33",
      lastVisit: "2025-01-28",
      status: "Actif"
    },
    {
      id: "4",
      name: "Pierre ONDO",
      age: 29,
      gender: "M",
      cnamgs: null,
      phone: "+241 06 44 55 66",
      lastVisit: "2025-01-15",
      status: "Actif"
    },
  ];

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.cnamgs?.includes(searchQuery) ||
    patient.phone.includes(searchQuery)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Mes Patients</span>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Nouveau patient
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, N° CNAMGS ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Patients Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Âge/Sexe</TableHead>
                  <TableHead>CNAMGS</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Dernière visite</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age} ans, {patient.gender}</TableCell>
                    <TableCell>
                      {patient.cnamgs ? (
                        <Badge variant="outline" className="font-mono text-xs">
                          {patient.cnamgs}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Non couvert</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{patient.phone}</TableCell>
                    <TableCell className="text-sm">{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === "Suivi" ? "default" : "secondary"}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun patient trouvé
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
