import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, FileText, Save, Send, X, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecreeCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (decree: DecreeData) => void;
}

interface DecreeData {
  type: string;
  title: string;
  reference: string;
  content: string;
  effectiveDate: Date | undefined;
  expiryDate?: Date | undefined;
  attachments: string[];
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'published';
}

export function DecreeCreator({ isOpen, onClose, onSave }: DecreeCreatorProps) {
  const [decree, setDecree] = useState<DecreeData>({
    type: 'decree',
    title: '',
    reference: '',
    content: '',
    effectiveDate: undefined,
    expiryDate: undefined,
    attachments: [],
    tags: [],
    status: 'draft'
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag && !decree.tags.includes(currentTag)) {
      setDecree(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setDecree(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSave = () => {
    if (!decree.title || !decree.content || !decree.reference) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onSave(decree);
    toast.success("Décret sauvegardé avec succès");
    onClose();
  };

  const handlePublish = () => {
    if (!decree.title || !decree.content || !decree.reference || !decree.effectiveDate) {
      toast.error("Veuillez remplir tous les champs obligatoires avant de publier");
      return;
    }
    onSave({ ...decree, status: 'review' });
    toast.success("Décret envoyé pour révision");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Création d'un Document Ministériel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type de document */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de Document *</Label>
              <Select 
                value={decree.type} 
                onValueChange={(value) => setDecree(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decree">Décret</SelectItem>
                  <SelectItem value="order">Arrêté</SelectItem>
                  <SelectItem value="circular">Circulaire</SelectItem>
                  <SelectItem value="decision">Décision</SelectItem>
                  <SelectItem value="note">Note de Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Référence *</Label>
              <Input
                id="reference"
                placeholder="Ex: DEC/2025/MS/001"
                value={decree.reference}
                onChange={(e) => setDecree(prev => ({ ...prev, reference: e.target.value }))}
              />
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Objet du Document *</Label>
            <Input
              id="title"
              placeholder="Ex: Réorganisation des services d'urgence hospitaliers"
              value={decree.title}
              onChange={(e) => setDecree(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu du Document *</Label>
            <Textarea
              id="content"
              placeholder="Le Ministre de la Santé,

Vu la Constitution ;
Vu la loi n°12/95 du 14 janvier 1995 fixant les orientations de la Politique de Santé ;
Vu le décret n°0292/PR/MS du 21 juillet 2024 portant attributions du Ministre de la Santé ;

Considérant l'urgence de...

DÉCRÈTE :

Article 1er : ...
Article 2 : ...
Article 3 : Le présent décret entre en vigueur à compter de sa date de signature."
              value={decree.content}
              onChange={(e) => setDecree(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date d'Effet *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !decree.effectiveDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {decree.effectiveDate ? (
                      format(decree.effectiveDate, "d MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={decree.effectiveDate}
                    onSelect={(date) => setDecree(prev => ({ ...prev, effectiveDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date d'Expiration (optionnelle)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !decree.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {decree.expiryDate ? (
                      format(decree.expiryDate, "d MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={decree.expiryDate}
                    onSelect={(date) => setDecree(prev => ({ ...prev, expiryDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Mots-clés</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un mot-clé"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {decree.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="py-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Pièces jointes */}
          <div className="space-y-2">
            <Label>Pièces Jointes</Label>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Ajouter des fichiers
            </Button>
            <p className="text-xs text-muted-foreground">
              Formats acceptés: PDF, DOC, DOCX (Max 10MB par fichier)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder en Brouillon
          </Button>
          <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700">
            <Send className="mr-2 h-4 w-4" />
            Envoyer pour Révision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DecreeCreator;
