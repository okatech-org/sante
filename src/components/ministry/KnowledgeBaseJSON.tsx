import { useState } from "react";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileDown,
  Database,
  Sparkles,
  Code2,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const KnowledgeBaseJSON = () => {
  const { allDocuments, exportToJSON, stats } = useKnowledgeBase();
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyJSON = (doc: any) => {
    const jsonStr = JSON.stringify(doc, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedId(doc.id);
    toast.success("JSON copié dans le presse-papier");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllJSON = () => {
    const jsonStr = JSON.stringify(allDocuments, null, 2);
    navigator.clipboard.writeText(jsonStr);
    toast.success("Base de connaissance complète copiée");
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white shadow-lg">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Base de Connaissance JSON</CardTitle>
                <CardDescription>
                  Extraction et transformation automatique des dossiers en format structuré
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Activée
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="rounded-lg bg-white/50 dark:bg-slate-900/50 p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Documents extraits</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-white/50 dark:bg-slate-900/50 p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Taille totale</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
            <div className="rounded-lg bg-white/50 dark:bg-slate-900/50 p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Catégories</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Object.keys(stats.byCategory).length}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportToJSON} className="gap-2 flex-1">
              <FileDown className="h-4 w-4" />
              Télécharger JSON complet
            </Button>
            <Button variant="outline" onClick={handleCopyAllJSON} className="gap-2">
              <Copy className="h-4 w-4" />
              Copier tout
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Aperçu JSON par document</h3>
          <Badge variant="outline">{allDocuments.length} documents</Badge>
        </div>

        {allDocuments.map((doc) => (
          <Card
            key={doc.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {expandedDoc === doc.id ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
                <Code2 className="h-4 w-4 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium">{doc.titre}</p>
                  <p className="text-xs text-slate-500">
                    {doc.categorie} • {doc.auteur} • {formatFileSize(doc.fichier_taille)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {doc.pertinence_score}%
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyJSON(doc);
                  }}
                >
                  {copiedId === doc.id ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {expandedDoc === doc.id && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
                <pre className="text-xs overflow-x-auto p-4 bg-slate-900 dark:bg-slate-950 text-green-400 rounded-lg max-h-96 overflow-y-auto">
                  {JSON.stringify(doc, null, 2)}
                </pre>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBaseJSON;

