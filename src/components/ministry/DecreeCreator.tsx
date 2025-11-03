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
import { CalendarIcon, FileText, Save, Send, X, Plus, Upload, Sparkles, FileUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
  const [aiContext, setAiContext] = useState('');
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setReferenceFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} fichier(s) ajouté(s)`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateWithAI = async () => {
    if (!aiContext.trim()) {
      toast.error("Veuillez décrire le contexte du document");
      return;
    }

    setIsGenerating(true);
    try {
      // Lire le contenu des fichiers de référence
      const referenceDocuments: string[] = [];
      for (const file of referenceFiles) {
        const text = await file.text();
        referenceDocuments.push(`## ${file.name}\n\n${text}`);
      }

      const { data, error } = await supabase.functions.invoke('generate-decree-with-ai', {
        body: {
          context: aiContext,
          type: decree.type,
          referenceDocuments: referenceDocuments.length > 0 ? referenceDocuments : undefined
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Erreur lors de la génération");
      }

      // Mettre à jour le contenu du décret avec le texte généré
      setDecree(prev => ({
        ...prev,
        content: data.content
      }));

      toast.success("Document généré avec succès par l'IA");
      setShowAiPanel(false);
    } catch (error: any) {
      console.error('Erreur génération IA:', error);
      toast.error(error.message || "Erreur lors de la génération du document");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Création d'un Document Ministériel</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {showAiPanel ? "Fermer l'Assistant IA" : "Générer avec l'IA"}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Panneau Assistant IA */}
          {showAiPanel && (
            <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 p-4 space-y-4">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">Assistant IA - Génération de Document</h3>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="ai-context">Décrivez le contexte et l'objectif du document *</Label>
                  <Textarea
                    id="ai-context"
                    placeholder="Ex: Je souhaite créer un décret portant sur la réorganisation des services d'urgence dans les CHU. L'objectif est d'améliorer les délais de prise en charge et de clarifier les responsabilités de chaque service..."
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Documents de référence (optionnel)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      multiple
                      accept=".txt,.doc,.docx,.pdf,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="reference-files"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('reference-files')?.click()}
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Importer des documents de référence
                    </Button>
                  </div>
                  
                  {referenceFiles.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-sm font-medium">{referenceFiles.length} document(s) importé(s) :</p>
                      {referenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded border">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || !aiContext.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Générer le document avec l'IA
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
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
