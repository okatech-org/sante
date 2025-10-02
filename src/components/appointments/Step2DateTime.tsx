import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

// Mock time slots data
const generateTimeSlots = (date: Date | null) => {
  if (!date) return { morning: [], afternoon: [] };
  
  const morning = [
    { time: "08:00 - 08:30", available: true },
    { time: "08:30 - 09:00", available: true },
    { time: "09:00 - 09:30", available: true },
    { time: "09:30 - 10:00", available: false },
    { time: "10:00 - 10:30", available: true },
    { time: "10:30 - 11:00", available: true },
    { time: "11:00 - 11:30", available: false },
    { time: "11:30 - 12:00", available: true },
  ];

  const afternoon = [
    { time: "14:00 - 14:30", available: true },
    { time: "14:30 - 15:00", available: true },
    { time: "15:00 - 15:30", available: false },
    { time: "15:30 - 16:00", available: true },
    { time: "16:00 - 16:30", available: true },
    { time: "16:30 - 17:00", available: true },
    { time: "17:00 - 17:30", available: false },
  ];

  return { morning, afternoon };
};

export const Step2DateTime = ({ onNext, onBack }: Step2Props) => {
  const { selectedDate, selectedTimeSlot, setSelectedDate, setSelectedTimeSlot } = useAppointmentStore();
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots(selectedDate));

  const canProceed = selectedDate !== null && selectedTimeSlot !== null;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null);
    setTimeSlots(generateTimeSlots(date || null));
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
  };

  const availableCount = [...timeSlots.morning, ...timeSlots.afternoon].filter(s => s.available).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choisissez votre créneau</h2>
        <p className="text-muted-foreground">Sélectionnez une date puis un horaire disponible</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Calendrier */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Calendrier</h3>
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
              locale={fr}
              className="rounded-md border pointer-events-auto"
            />
            {selectedDate && (
              <div className="mt-4">
                <Badge variant="secondary" className="w-full justify-center py-2">
                  {availableCount} créneaux disponibles
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Créneaux horaires */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">
              {selectedDate 
                ? `Créneaux disponibles - ${format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}`
                : 'Créneaux horaires'
              }
            </h3>

            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                <p>← Sélectionnez une date dans le calendrier</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Matin */}
                <div>
                  <h4 className="font-medium mb-3 text-muted-foreground">MATIN</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.morning.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                        className="justify-between h-auto py-3"
                      >
                        <span className={!slot.available ? 'line-through' : ''}>
                          {slot.time}
                        </span>
                        {selectedTimeSlot === slot.time && <Check className="h-4 w-4" />}
                        {!slot.available && <span className="text-xs">Complet</span>}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Après-midi */}
                <div>
                  <h4 className="font-medium mb-3 text-muted-foreground">APRÈS-MIDI</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.afternoon.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                        className="justify-between h-auto py-3"
                      >
                        <span className={!slot.available ? 'line-through' : ''}>
                          {slot.time}
                        </span>
                        {selectedTimeSlot === slot.time && <Check className="h-4 w-4" />}
                        {!slot.available && <span className="text-xs">Complet</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between max-w-6xl mx-auto">
        <Button variant="outline" onClick={onBack} size="lg">
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="min-w-32">
          Suivant
        </Button>
      </div>
    </div>
  );
};
