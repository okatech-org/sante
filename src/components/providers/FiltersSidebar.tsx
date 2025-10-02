import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Stethoscope, Heart, Pill, Building2, FlaskConical, X } from "lucide-react";
import { gabonProvinces, gabonCities } from "@/lib/gabon-data";
import { useState } from "react";

interface FiltersSidebarProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const FiltersSidebar = ({ open, onClose, onApplyFilters }: FiltersSidebarProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("estuaire");
  const [selectedCity, setSelectedCity] = useState("");
  const [radius, setRadius] = useState([10]);
  const [openNow, setOpenNow] = useState(false);
  const [open24h, setOpen24h] = useState(false);
  const [availableToday, setAvailableToday] = useState(false);
  const [acceptsNewPatients, setAcceptsNewPatients] = useState(false);
  const [cnamgs, setCnamgs] = useState(false);
  const [cnss, setCnss] = useState(false);
  const [telemedicine, setTelemedicine] = useState(false);
  const [onlineBooking, setOnlineBooking] = useState(false);

  const providerTypes = [
    { id: 'generaliste', label: 'Médecins généralistes', icon: Stethoscope },
    { id: 'specialiste', label: 'Spécialistes', icon: Heart },
    { id: 'pharmacie', label: 'Pharmacies', icon: Pill },
    { id: 'hopital', label: 'Hôpitaux & Cliniques', icon: Building2 },
    { id: 'laboratoire', label: 'Laboratoires', icon: FlaskConical }
  ];

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedProvince("estuaire");
    setSelectedCity("");
    setRadius([10]);
    setOpenNow(false);
    setOpen24h(false);
    setAvailableToday(false);
    setAcceptsNewPatients(false);
    setCnamgs(false);
    setCnss(false);
    setTelemedicine(false);
    setOnlineBooking(false);
  };

  const handleApply = () => {
    onApplyFilters({
      types: selectedTypes,
      province: selectedProvince,
      city: selectedCity,
      radius: radius[0],
      openNow,
      open24h,
      availableToday,
      acceptsNewPatients,
      cnamgs,
      cnss,
      telemedicine,
      onlineBooking
    });
    onClose();
  };

  const FilterContent = () => (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="space-y-6 pr-4">
        {/* Type de prestataire */}
        <div>
          <h3 className="font-semibold mb-3">Type de prestataire</h3>
          <div className="space-y-3">
            {providerTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTypes([...selectedTypes, type.id]);
                    } else {
                      setSelectedTypes(selectedTypes.filter(t => t !== type.id));
                    }
                  }}
                />
                <Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer">
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Localisation */}
        <div>
          <h3 className="font-semibold mb-3">Localisation</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="province" className="mb-2 block">Province</Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger id="province">
                  <SelectValue placeholder="Sélectionner une province" />
                </SelectTrigger>
                <SelectContent>
                  {gabonProvinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city" className="mb-2 block">Ville</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent>
                  {gabonCities[selectedProvince]?.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block">Rayon: {radius[0]} km</Label>
              <Slider
                value={radius}
                onValueChange={setRadius}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Disponibilité */}
        <div>
          <h3 className="font-semibold mb-3">Disponibilité</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="open-now">Ouvert maintenant</Label>
              <Switch id="open-now" checked={openNow} onCheckedChange={setOpenNow} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="open-24h">Ouvert 24h/24</Label>
              <Switch id="open-24h" checked={open24h} onCheckedChange={setOpen24h} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="available-today">Disponible aujourd'hui</Label>
              <Switch id="available-today" checked={availableToday} onCheckedChange={setAvailableToday} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-patients">Accepte nouveaux patients</Label>
              <Switch id="new-patients" checked={acceptsNewPatients} onCheckedChange={setAcceptsNewPatients} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Assurance */}
        <div>
          <h3 className="font-semibold mb-3">Assurance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="cnamgs">Conventionné CNAMGS</Label>
              <Switch id="cnamgs" checked={cnamgs} onCheckedChange={setCnamgs} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cnss">Accepte CNSS</Label>
              <Switch id="cnss" checked={cnss} onCheckedChange={setCnss} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Services */}
        <div>
          <h3 className="font-semibold mb-3">Services spécifiques</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="telemedicine">Téléconsultation</Label>
              <Switch id="telemedicine" checked={telemedicine} onCheckedChange={setTelemedicine} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="online-booking">Prise de RDV en ligne</Label>
              <Switch id="online-booking" checked={onlineBooking} onCheckedChange={setOnlineBooking} />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  // Desktop version
  const DesktopFilters = () => (
    <aside className="hidden md:block w-80 border-r bg-sidebar h-[calc(100vh-64px)] sticky top-16">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filtres</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Réinitialiser
          </Button>
        </div>
        <FilterContent />
        <div className="mt-6 pt-4 border-t">
          <Button onClick={handleApply} className="w-full">
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </aside>
  );

  // Mobile version
  const MobileFilters = () => (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filtres
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Réinitialiser
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterContent />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <Button onClick={handleApply} className="w-full">
            Appliquer les filtres
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <DesktopFilters />
      <MobileFilters />
    </>
  );
};
