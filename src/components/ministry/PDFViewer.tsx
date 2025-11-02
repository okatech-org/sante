import { useState } from "react";
import { KnowledgeDocument } from "@/types/knowledge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  Sparkles,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PDFViewerProps {
  document: KnowledgeDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

const PDFViewer = ({ document, isOpen, onClose }: PDFViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  if (!document) return null;

  const generateMockPDFPages = () => {
    const pages = [];
    const totalPages = document.metadonnees?.nombre_pages || 10;
    
    for (let i = 0; i < Math.min(totalPages, 5); i++) {
      const lines = [];
      for (let j = 0; j < 35; j++) {
        if (i === 0 && j === 0) {
          lines.push(document.titre);
        } else if (i === 0 && j === 2) {
          lines.push(document.auteur);
        } else if (i === 0 && j === 3) {
          lines.push(new Date(document.date_publication).toLocaleDateString('fr-FR', { dateStyle: 'long' }));
        } else if (i === 0 && j > 5 && j < 30) {
          lines.push(document.description);
        } else if (j > 5 && j < 30) {
          lines.push('─'.repeat(50) + ' ' + '─'.repeat(20));
        } else {
          lines.push('');
        }
      }
      pages.push(lines);
    }
    return pages;
  };

  const pages = generateMockPDFPages();

  const handleGenerateAnalysis = async () => {
    setAnalysisLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalysisLoading(false);
    setShowAnalysis(true);
    toast.success("Analyse générée avec succès");
  };

  const mockAnalysis = {
    resume: `Ce document "${document.titre}" constitue un texte fondamental pour la politique de santé au Gabon. Rédigé par ${document.auteur}, il établit les principes directeurs et le cadre juridique nécessaire à l'organisation et au fonctionnement du système de santé gabonais.`,
    points_cles: [
      "Définition du cadre réglementaire et juridique",
      "Établissement des responsabilités ministérielles",
      "Organisation du système de santé national",
      "Mécanismes de financement et de gouvernance",
    ],
    recommandations: [
      "Appliquer strictement les dispositions du texte",
      "Former le personnel sur les nouvelles directives",
      "Communiquer les changements aux parties prenantes",
    ],
    niveau_priorite: "HAUTE",
    impact: "Ce document a un impact direct sur l'ensemble de la politique sanitaire nationale et nécessite une attention particulière lors de son application.",
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl pr-8">{document.titre}</DialogTitle>
              <DialogDescription className="mt-2">
                {document.description}
              </DialogDescription>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {document.auteur}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(document.date_publication).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {document.nombre_consultations} consultations
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  {document.metadonnees?.nombre_pages || 0} pages
                </span>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shrink-0">
              {document.pertinence_score}% Pertinence
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex gap-4 h-[calc(95vh-200px)]">
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled>
                  {zoom}%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger ({formatFileSize(document.fichier_taille)})
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 rounded-lg p-6">
              <div className="mx-auto bg-white dark:bg-slate-900 shadow-2xl" style={{ 
                width: `${(210 * zoom) / 100}mm`,
                maxWidth: '100%',
              }}>
                {pages.map((pageLines, pageIdx) => (
                  <div
                    key={pageIdx}
                    className="relative border border-slate-300 dark:border-slate-700 mb-4"
                    style={{
                      aspectRatio: '210/297',
                      padding: `${zoom / 10}mm`,
                    }}
                  >
                    <div className="absolute top-2 right-2 text-xs text-slate-400">
                      Page {pageIdx + 1}
                    </div>
                    <div className="h-full overflow-hidden">
                      <div className="space-y-1 text-xs leading-relaxed text-slate-800 dark:text-slate-300 font-serif">
                        {pageLines.map((line, lineIdx) => (
                          <div key={lineIdx} className={cn(
                            lineIdx === 0 && "font-bold text-xl mb-2",
                            lineIdx === 2 && "font-semibold text-sm mt-4",
                            lineIdx === 3 && "text-slate-500 italic text-sm"
                          )}>
                            {line || '\u00A0'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-96 flex flex-col gap-3">
            <Button
              onClick={handleGenerateAnalysis}
              disabled={analysisLoading}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {analysisLoading ? (
                <>
                  <Brain className="h-4 w-4 animate-pulse" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Rapport et Analyse IA
                </>
              )}
            </Button>

            {showAnalysis && (
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-300">
                      Analyse IA
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Résumé Exécutif
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {mockAnalysis.resume}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Points Clés
                      </h4>
                      <ul className="space-y-2">
                        {mockAnalysis.points_cles.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Recommandations
                      </h4>
                      <ul className="space-y-2">
                        {mockAnalysis.recommandations.map((reco, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{reco}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg bg-white/50 dark:bg-slate-900/50 p-3 border border-amber-400/30">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Niveau de Priorité
                      </h4>
                      <Badge className="bg-amber-500 text-white">
                        {mockAnalysis.niveau_priorite}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Impact Ministériel</h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                        {mockAnalysis.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!showAnalysis && (
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <div className="space-y-3">
                  <Brain className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Cliquez sur "Rapport et Analyse IA" pour obtenir un résumé exécutif et des recommandations
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;

