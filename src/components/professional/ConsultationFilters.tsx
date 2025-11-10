import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ConsultationFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  type: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasPrescription?: boolean;
}

export function ConsultationFilters({ onFilterChange, onReset }: ConsultationFiltersProps) {
  const [type, setType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [hasPrescription, setHasPrescription] = useState<string>("all");

  const handleApply = () => {
    onFilterChange({
      type: type !== "all" ? type : "",
      dateFrom,
      dateTo,
      hasPrescription: hasPrescription === "all" ? undefined : hasPrescription === "yes",
    });
  };

  const handleReset = () => {
    setType("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setHasPrescription("all");
    onReset();
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type de consultation */}
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Consultation de suivi">Consultation de suivi</SelectItem>
              <SelectItem value="Téléconsultation">Téléconsultation</SelectItem>
              <SelectItem value="Urgence">Urgence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date début */}
        <div className="space-y-2">
          <Label>Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd MMMM yyyy", { locale: fr }) : "Sélectionner"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date fin */}
        <div className="space-y-2">
          <Label>Date de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd MMMM yyyy", { locale: fr }) : "Sélectionner"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Ordonnance */}
        <div className="space-y-2">
          <Label>Ordonnance</Label>
          <Select value={hasPrescription} onValueChange={setHasPrescription}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="yes">Avec ordonnance</SelectItem>
              <SelectItem value="no">Sans ordonnance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleApply} className="w-full">
        Appliquer les filtres
      </Button>
    </Card>
  );
}
