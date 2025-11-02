import { useState, useRef, ChangeEvent } from "react";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Upload,
  FileDown,
  Sparkles,
  ScrollText,
  Target,
  FileText,
  BookOpen,
  Shield,
  Folder,
  Calendar,
  User,
  Eye,
  Trash2,
  Filter,
  ArrowUpDown,
  Download,
  Grid3x3,
  List,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { KnowledgeDocument, SortOption } from "@/types/knowledge";
import PDFMiniature from "./PDFMiniature";
import PDFViewer from "./PDFViewer";

const CATEGORY_CONFIG = {
  loi: { label: "Lois & Règlements", icon: Shield, color: "blue" },
  decret: { label: "Décrets & Arrêtés", icon: ScrollText, color: "indigo" },
  rapport: { label: "Rapports", icon: FileText, color: "purple" },
  etude: { label: "Études", icon: BookOpen, color: "pink" },
  guide: { label: "Guides & Manuels", icon: Folder, color: "emerald" },
  strategie: { label: "Stratégies", icon: Target, color: "amber" },
  autre: { label: "Autres", icon: FileText, color: "slate" },
};

const KnowledgeBase = () => {
  const {
    documents,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    uploadDocument,
    deleteDocument,
    exportToJSON,
    isUploading,
    stats,
  } = useKnowledgeBase();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [activeCategoryLabel, setActiveCategoryLabel] = useState<string>("");
  const [viewerDoc, setViewerDoc] = useState<KnowledgeDocument | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Array<{name: string, status: 'pending' | 'processing' | 'success' | 'error'}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilter({ ...filter, recherche: value });
  };

  const handleCategoryFilter = (value: string, label: string) => {
    setSelectedCategory(value);
    setFilter({
      ...filter,
      categorie: value === "all" ? undefined : value,
    });
    
    if (value !== "all") {
      setActiveCategoryLabel(label);
      setShowCategoryDialog(true);
      setViewMode("grid");
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|txt|md|doc|docx)$/i)) {
        toast.error(`Fichier "${file.name}" : type non supporté`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`Fichier "${file.name}" : taille maximale 50 MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setShowUploadDialog(true);
    setUploadProgress(0);
    setUploadingFiles(validFiles.map(f => ({ name: f.name, status: 'pending' as const })));

    let processedCount = 0;
    const totalFiles = validFiles.length;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      
      setUploadingFiles(prev => prev.map(f => 
        f.name === file.name ? { ...f, status: 'processing' } : f
      ));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const progress = (processedCount / totalFiles) * 100 + (10 / totalFiles);
          if (progress >= ((processedCount + 1) / totalFiles) * 100 - 5) {
            clearInterval(interval);
            return progress;
          }
          return prev + (10 / totalFiles);
        });
      }, 200);

      try {
        const newDoc = await uploadDocument(file);
        processedCount++;
        
        clearInterval(interval);
        setUploadProgress((processedCount / totalFiles) * 100);
        
        setUploadingFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'success' } : f
        ));

      } catch (error) {
        clearInterval(interval);
        setUploadingFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'error' } : f
        ));
      }
    }

    setTimeout(() => {
      setUploadingFiles(prev => {
        const successCount = prev.filter(f => f.status === 'success').length;
        if (successCount > 0) {
          exportKnowledgeBaseToJSON();
          toast.success(`${successCount} document(s) ajouté(s), classifié(s) et exporté(s) en JSON!`);
        }
        return [];
      });
      setShowUploadDialog(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1500);
  };

  const handleDelete = (id: string, titre: string) => {
    if (confirm(`Supprimer le document "${titre}" ?`)) {
      deleteDocument(id);
      toast.success("Document supprimé");
    }
  };

  const exportKnowledgeBaseToJSON = () => {
    const allDocs = documents.map(doc => ({
      id: doc.id,
      titre: doc.titre,
      description: doc.description,
      categorie: doc.categorie,
      tags: doc.tags,
      auteur: doc.auteur,
      date_publication: doc.date_publication,
      date_ajout: doc.date_ajout,
      contenu_extrait: doc.contenu_extrait?.slice(0, 5000),
      metadonnees: doc.metadonnees,
      nombre_consultations: doc.nombre_consultations,
    }));
    
    const knowledgeBaseJSON = {
      metadata: {
        version: "1.0",
        last_updated: new Date().toISOString(),
        total_documents: allDocs.length,
        categories_count: Object.keys(CATEGORY_CONFIG).reduce((acc, cat) => {
          acc[cat] = allDocs.filter(d => d.categorie === cat).length;
          return acc;
        }, {} as Record<string, number>),
      },
      documents: allDocs,
    };
    
    const dataStr = JSON.stringify(knowledgeBaseJSON, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `base-connaissance-${new Date().toISOString().split('T')[0]}.json`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dossiers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestion et classification des documents • {stats.total} documents • {formatFileSize(stats.totalSize)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            Importer
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt,.md,.doc,.docx"
            multiple
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          const count = stats.byCategory[key] || 0;
          const total = stats.total || 1;
          const percentage = Math.round((count / total) * 100);
          
          const isPositive = count > 0;
          const trendValue = isPositive ? `+${Math.min(percentage, 50)}%` : "0%";
          
          const folderColors = {
            blue: { 
              main: "from-blue-400 to-blue-600",
              tab: "bg-blue-500",
              light: "bg-blue-100 dark:bg-blue-900/30",
              border: "border-blue-400"
            },
            indigo: { 
              main: "from-indigo-400 to-indigo-600",
              tab: "bg-indigo-500",
              light: "bg-indigo-100 dark:bg-indigo-900/30",
              border: "border-indigo-400"
            },
            purple: { 
              main: "from-purple-400 to-purple-600",
              tab: "bg-purple-500",
              light: "bg-purple-100 dark:bg-purple-900/30",
              border: "border-purple-400"
            },
            pink: { 
              main: "from-pink-400 to-pink-600",
              tab: "bg-pink-500",
              light: "bg-pink-100 dark:bg-pink-900/30",
              border: "border-pink-400"
            },
            emerald: { 
              main: "from-emerald-400 to-emerald-600",
              tab: "bg-emerald-500",
              light: "bg-emerald-100 dark:bg-emerald-900/30",
              border: "border-emerald-400"
            },
            amber: { 
              main: "from-amber-400 to-amber-600",
              tab: "bg-amber-500",
              light: "bg-amber-100 dark:bg-amber-900/30",
              border: "border-amber-400"
            },
            slate: { 
              main: "from-slate-400 to-slate-600",
              tab: "bg-slate-500",
              light: "bg-slate-100 dark:bg-slate-900/30",
              border: "border-slate-400"
            },
          };
          
          const colors = folderColors[config.color as keyof typeof folderColors];
          
          return (
            <div
              key={key}
              className={cn(
                "group relative cursor-pointer transition-all duration-300",
                "hover:-translate-y-2",
                selectedCategory === key && "scale-105"
              )}
              onClick={() => handleCategoryFilter(key, config.label)}
            >
              <div className="relative" style={{ paddingTop: "20px" }}>
                <div className={cn(
                  "absolute top-0 left-8 h-6 w-24 rounded-t-xl transition-all",
                  colors.tab,
                  "shadow-md group-hover:shadow-lg"
                )} />
                
                <div className={cn(
                  "relative rounded-2xl overflow-hidden",
                  colors.light,
                  "border-2", colors.border,
                  "shadow-xl group-hover:shadow-2xl transition-all",
                  "h-48"
                )}>
                  {isPositive && (
                    <div className="absolute top-3 right-3 left-3 space-y-1">
                      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className="h-24 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
                          style={{
                            transform: `translateY(${i * 8}px) translateX(${i * 4}px) rotate(${i * 2}deg)`,
                            opacity: 1 - i * 0.15,
                          }}
                        >
                          <div className="p-3 space-y-1">
                            <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="h-1.5 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-900/90">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {config.label}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            {count}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {count > 1 ? "documents" : count === 1 ? "document" : "vide"}
                          </span>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        isPositive 
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                          : "bg-slate-500/20 text-slate-600 dark:text-slate-400"
                      )}>
                        {trendValue}
                      </div>
                    </div>
                  </div>

                  {!isPositive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16 text-slate-300 dark:text-slate-700 opacity-30" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher par titre, auteur, tags..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pertinence">Pertinence</SelectItem>
              <SelectItem value="date_desc">Plus récent</SelectItem>
              <SelectItem value="date_asc">Plus ancien</SelectItem>
              <SelectItem value="consultations">Plus consulté</SelectItem>
              <SelectItem value="titre_asc">Titre (A-Z)</SelectItem>
              <SelectItem value="titre_desc">Titre (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setFilter({});
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        {documents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucun document trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
            {documents.map((doc) => (
              <PDFMiniature
                key={doc.id}
                document={doc}
                onClick={() => setViewerDoc(doc)}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Import et Classification Intelligente
            </DialogTitle>
            <DialogDescription>
              Analyse IA et extraction automatique des métadonnées • Export JSON automatique
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Progress value={uploadProgress} className="h-2" />
            
            {uploadingFiles.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uploadingFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors",
                      file.status === 'success' && "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
                      file.status === 'error' && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                      file.status === 'processing' && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
                      file.status === 'pending' && "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {file.status === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
                      {file.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />}
                      {file.status === 'processing' && <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />}
                      {file.status === 'pending' && <Clock className="h-5 w-5 text-slate-400 shrink-0" />}
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {file.status === 'success' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Classifié</Badge>}
                      {file.status === 'error' && <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Erreur</Badge>}
                      {file.status === 'processing' && <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Analyse...</Badge>}
                      {file.status === 'pending' && <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">En attente</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              {uploadProgress < 30 && "Lecture et analyse des documents..."}
              {uploadProgress >= 30 && uploadProgress < 60 && "Extraction du contenu et métadonnées..."}
              {uploadProgress >= 60 && uploadProgress < 90 && "Classification intelligente par dossier..."}
              {uploadProgress >= 90 && uploadProgress < 100 && "Export JSON et finalisation..."}
              {uploadProgress === 100 && "✓ Terminé ! Base de connaissances mise à jour"}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedDoc && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl pr-8">
                  {selectedDoc.titre}
                </DialogTitle>
                <DialogDescription>
                  {selectedDoc.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Catégorie</p>
                    <Badge>{CATEGORY_CONFIG[selectedDoc.categorie].label}</Badge>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Auteur</p>
                    <p className="font-medium">{selectedDoc.auteur}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Date publication</p>
                    <p className="font-medium">{formatDate(selectedDoc.date_publication)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Consultations</p>
                    <p className="font-medium">{selectedDoc.nombre_consultations} vues</p>
                  </div>
                  {selectedDoc.metadonnees?.nombre_pages && (
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 mb-1">Pages</p>
                      <p className="font-medium">{selectedDoc.metadonnees.nombre_pages}</p>
                    </div>
                  )}
                  {selectedDoc.fichier_taille && (
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 mb-1">Taille</p>
                      <p className="font-medium">{formatFileSize(selectedDoc.fichier_taille)}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-2 text-sm">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedDoc.contenu_extrait && (
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-2 text-sm">Extrait</p>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-sm max-h-60 overflow-y-auto">
                      <p className="whitespace-pre-wrap">{selectedDoc.contenu_extrait.slice(0, 1000)}...</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {activeCategoryLabel}
                </DialogTitle>
                <DialogDescription>
                  {documents.length} document{documents.length > 1 ? "s" : ""} • Miniatures PDF
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {documents.map((doc) => (
                  <PDFMiniature
                    key={doc.id}
                    document={doc}
                    onClick={() => {
                      setViewerDoc(doc);
                      setShowCategoryDialog(false);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const config = CATEGORY_CONFIG[doc.categorie];
                  const Icon = config.icon;
                  return (
                    <div
                      key={doc.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-primary/50 transition-all cursor-pointer group"
                      onClick={() => {
                        setViewerDoc(doc);
                        setShowCategoryDialog(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "rounded-lg p-2 shrink-0",
                            `bg-${config.color}-500/15 text-${config.color}-500`
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {doc.titre}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {doc.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span>{formatDate(doc.date_publication)}</span>
                            <span>•</span>
                            <span>{doc.nombre_consultations} vues</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.fichier_taille)}</span>
                          </div>
                        </div>
                        {doc.pertinence_score && (
                          <Badge variant="secondary" className="shrink-0">
                            {doc.pertinence_score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PDFViewer
        document={viewerDoc}
        isOpen={!!viewerDoc}
        onClose={() => setViewerDoc(null)}
      />
    </div>
  );
};

export default KnowledgeBase;

