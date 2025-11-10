import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimeSlot {
  slot_date: string;
  slot_time: string;
  is_available: boolean;
}

interface AppointmentSlotPickerProps {
  professionalId: string;
  professionalName: string;
  onSlotSelect: (date: Date, time: string) => void;
  onCancel: () => void;
}

export function AppointmentSlotPicker({
  professionalId,
  professionalName,
  onSlotSelect,
  onCancel
}: AppointmentSlotPickerProps) {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    loadAvailableSlots();
  }, [professionalId]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(), 14), 'yyyy-MM-dd'); // 2 semaines à l'avance

      const { data, error } = await supabase.rpc('get_available_slots', {
        p_professional_id: professionalId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) throw error;

      setSlots(data || []);

      // Extraire les dates uniques avec des créneaux disponibles
      const dates = Array.from(new Set(
        data
          ?.filter((slot: TimeSlot) => slot.is_available)
          .map((slot: TimeSlot) => slot.slot_date)
      )).map(dateStr => parseISO(dateStr as string));

      setAvailableDates(dates);

      // Sélectionner la première date disponible
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
      toast.error("Impossible de charger les disponibilités");
    } finally {
      setLoading(false);
    }
  };

  const getSlotsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return slots.filter(slot => 
      slot.slot_date === dateStr && slot.is_available
    );
  };

  const handleSlotClick = (timeStr: string) => {
    onSlotSelect(selectedDate, timeStr);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (availableDates.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">
              Aucun créneau disponible pour le moment.
            </p>
            <Button variant="outline" onClick={onCancel}>
              Retour
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedDateSlots = getSlotsForDate(selectedDate);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Choisissez une date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {availableDates.map((date, index) => {
              const isSelected = isSameDay(date, selectedDate);
              const availableCount = getSlotsForDate(date).length;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg border transition-all",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "hover:bg-muted hover:border-primary/50"
                  )}
                >
                  <span className="text-xs font-medium">
                    {format(date, 'EEE', { locale: fr })}
                  </span>
                  <span className="text-lg font-bold">
                    {format(date, 'd')}
                  </span>
                  <span className="text-xs">
                    {format(date, 'MMM', { locale: fr })}
                  </span>
                  <Badge 
                    variant={isSelected ? "secondary" : "outline"} 
                    className="mt-1 text-[10px] px-1"
                  >
                    {availableCount}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Créneaux disponibles le {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateSlots.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucun créneau disponible pour cette date
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {selectedDateSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSlotClick(slot.slot_time)}
                  className="flex items-center justify-center gap-1 hover:bg-primary hover:text-primary-foreground"
                >
                  <Clock className="w-3 h-3" />
                  {slot.slot_time.substring(0, 5)}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
