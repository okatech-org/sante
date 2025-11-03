// Modal pour gérer les pages d'accueil personnalisées des établissements
// SANTE.GA - Plateforme E-Santé Gabon

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Home,
  Globe,
  FileText,
  Image as ImageIcon,
  Settings,
  Save,
  X,
  ExternalLink,
  Info,
  Shield,
  CheckCircle,
  Copy,
  Eye,
  Star,
  Edit
} from "lucide-react";
import { Establishment } from "@/types/establishment";
import { establishmentsService, EstablishmentHomePage } from "@/services/establishments.service";

interface EstablishmentHomePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishment: Establishment;
  homePageInfo?: EstablishmentHomePage | null;
  onSave: (establishmentId: string, settings: any) => void;
}

export const EstablishmentHomePageModal = ({
  isOpen,
  onClose,
  establishment,
  homePageInfo,
  onSave
}: EstablishmentHomePageModalProps) => {
  const [loading, setLoading] = useState(false);
  const [hasHomePage, setHasHomePage] = useState(homePageInfo?.hasHomePage || false);
  const [customContent, setCustomContent] = useState({
    hero: homePageInfo?.customContent?.hero || "",
    description: homePageInfo?.customContent?.description || "",
    services: homePageInfo?.customContent?.services || [],
    images: homePageInfo?.customContent?.images || []
  });
  const [newService, setNewService] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_establishment_favorites');
      const ids = raw ? JSON.parse(raw) : [];
      setIsFavorite(Array.isArray(ids) ? ids.includes(establishment.id) : false);
    } catch {}
  }, [establishment.id]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('admin_establishment_favorites');
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const exists = ids.includes(establishment.id);
      const next = exists ? ids.filter(id => id !== establishment.id) : [...ids, establishment.id];
      localStorage.setItem('admin_establishment_favorites', JSON.stringify(next));
      setIsFavorite(!exists);
      window.dispatchEvent(new Event('admin:favorite-changed'));
    } catch {}
  };

  // Obtenir l'URL de la page d'accueil (personnalisée ou générique)
  const homePageUrl = homePageInfo?.customUrl || 
                      establishmentsService.getEstablishmentHomeUrl(establishment);
  const fullUrl = `${window.location.origin}${homePageUrl}`;
  const hasCustomUrl = establishmentsService.hasCustomUrl(establishment.name);

  const handleSave = async () => {
    setLoading(true);
    try {
      await establishmentsService.setHomePage(
        establishment.id,
        establishment.name,
        hasHomePage,
        hasHomePage ? customContent : undefined
      );
      
      onSave(establishment.id, { hasHomePage, customContent });
      
      toast.success(
        hasHomePage 
          ? "Page d'accueil activée avec succès" 
          : "Page d'accueil désactivée"
      );
      
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    if (newService.trim()) {
      setCustomContent({
        ...customContent,
        services: [...customContent.services, newService.trim()]
      });
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setCustomContent({
      ...customContent,
      services: customContent.services.filter((_, i) => i !== index)
    });
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewPage = () => {
    window.open(homePageUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Gestion de la Page d'Accueil
            <button
              onClick={toggleFavorite}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`ml-2 p-1 rounded hover:bg-muted/60 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-muted-foreground'}`}
            >
              <Star className="h-4 w-4" />
            </button>
          </DialogTitle>
          <DialogDescription>
            Configurez la page d'accueil personnalisée pour {establishment.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Activation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activation</CardTitle>
              <CardDescription>
                Autorisez cet établissement à avoir une page d'accueil publique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={hasHomePage}
                    onCheckedChange={setHasHomePage}
                    id="homepage-activation"
                  />
                  <Label htmlFor="homepage-activation" className="font-medium">
                    Page d'accueil {hasHomePage ? "activée" : "désactivée"}
                  </Label>
                </div>
                {hasHomePage && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                )}
              </div>

              {hasHomePage && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium">
                        URL de la page {hasCustomUrl && <Badge className="ml-2 bg-purple-100 text-purple-800">Personnalisée</Badge>}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs bg-white px-2 py-1 rounded border flex-1">
                          {fullUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyUrl}
                          className="gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          {copied ? "Copié!" : "Copier"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={previewPage}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Aperçu
                        </Button>
                      </div>
                      {hasCustomUrl && (
                        <p className="text-xs text-blue-700 mt-2">
                          ✨ Cet établissement dispose d'une URL personnalisée
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration du contenu */}
          {hasHomePage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contenu personnalisé</CardTitle>
                <CardDescription>
                  Personnalisez le contenu affiché sur la page d'accueil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="media">Médias</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titre principal (Hero)</Label>
                      <Input
                        value={customContent.hero}
                        onChange={(e) => setCustomContent({...customContent, hero: e.target.value})}
                        placeholder="Ex: Bienvenue au CHU de Libreville"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={customContent.description}
                        onChange={(e) => setCustomContent({...customContent, description: e.target.value})}
                        placeholder="Décrivez l'établissement, sa mission, ses valeurs..."
                        rows={5}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Services proposés</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newService}
                          onChange={(e) => setNewService(e.target.value)}
                          placeholder="Ajouter un service..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                        />
                        <Button onClick={addService} variant="outline">
                          Ajouter
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {customContent.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {service}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeService(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Images</Label>
                      <div className="p-4 border-2 border-dashed rounded-lg text-center">
                        <ImageIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Glissez-déposez des images ici
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Fonctionnalité à venir
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Informations établissement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations actuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Nom</dt>
                  <dd className="font-medium">{establishment.name}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Catégorie</dt>
                  <dd className="font-medium capitalize">{establishment.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Province</dt>
                  <dd className="font-medium">{establishment.location.province}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Statut</dt>
                  <dd>
                    <Badge variant={establishment.status === 'operationnel' ? 'default' : 'secondary'}>
                      {establishment.status}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
