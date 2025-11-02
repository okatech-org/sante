import { FileText, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { KnowledgeDocument } from "@/types/knowledge";

interface PDFMiniatureProps {
  document: KnowledgeDocument;
  onClick?: () => void;
}

const PDFMiniature = ({ document, onClick }: PDFMiniatureProps) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCategoryColor = (categorie: string) => {
    const colors = {
      loi: "border-blue-400 bg-blue-50 dark:bg-blue-950/20",
      decret: "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20",
      rapport: "border-purple-400 bg-purple-50 dark:bg-purple-950/20",
      etude: "border-pink-400 bg-pink-50 dark:bg-pink-950/20",
      guide: "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
      strategie: "border-amber-400 bg-amber-50 dark:bg-amber-950/20",
      autre: "border-slate-400 bg-slate-50 dark:bg-slate-950/20",
    };
    return colors[categorie as keyof typeof colors] || colors.autre;
  };

  const generateMockPDFContent = () => {
    const lines = [];
    const titleWords = document.titre.split(' ');
    
    for (let i = 0; i < 20; i++) {
      if (i === 0) {
        lines.push(titleWords.slice(0, 3).join(' '));
      } else if (i === 1) {
        lines.push(titleWords.slice(3).join(' '));
      } else if (i === 3) {
        lines.push(document.auteur);
      } else if (i === 4) {
        lines.push(new Date(document.date_publication).toLocaleDateString('fr-FR'));
      } else if (i > 6) {
        lines.push('─'.repeat(15));
      } else {
        lines.push('');
      }
    }
    return lines;
  };

  const pdfLines = generateMockPDFContent();

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-300",
        "hover:-translate-y-2 hover:scale-105"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "relative rounded-lg border-2 shadow-lg overflow-hidden",
          "bg-white dark:bg-slate-900",
          getCategoryColor(document.categorie),
          "aspect-[210/297]",
          "group-hover:shadow-2xl"
        )}
        style={{
          width: "180px",
        }}
      >
        <div className="absolute inset-0 p-4 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className={cn(
              "rounded-lg p-1.5",
              document.categorie === "loi" && "bg-blue-500/20 text-blue-600",
              document.categorie === "decret" && "bg-indigo-500/20 text-indigo-600",
              document.categorie === "rapport" && "bg-purple-500/20 text-purple-600",
              document.categorie === "etude" && "bg-pink-500/20 text-pink-600",
              document.categorie === "guide" && "bg-emerald-500/20 text-emerald-600",
              document.categorie === "strategie" && "bg-amber-500/20 text-amber-600",
              document.categorie === "autre" && "bg-slate-500/20 text-slate-600"
            )}>
              <FileText className="h-3 w-3" />
            </div>
            {document.pertinence_score && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {document.pertinence_score}%
              </Badge>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="space-y-0.5 text-[9px] leading-tight text-slate-700 dark:text-slate-400 font-mono">
              {pdfLines.map((line, idx) => (
                <div key={idx} className={cn(
                  "truncate",
                  idx === 0 && "font-bold text-[10px]",
                  idx === 3 && "text-slate-500 dark:text-slate-500 italic",
                  idx > 6 && "opacity-40"
                )}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-2 space-y-1 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="h-2.5 w-2.5" />
                {document.nombre_consultations}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-2.5 w-2.5" />
                {formatFileSize(document.fichier_taille)}
              </span>
            </div>
            {document.metadonnees?.nombre_pages && (
              <div className="text-center text-[9px] text-slate-400">
                {document.metadonnees.nombre_pages} pages
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "flex items-center justify-center"
        )}>
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl">
            <Eye className="h-5 w-5 inline mr-2" />
            <span className="text-sm font-medium">Ouvrir</span>
          </div>
        </div>
      </div>

      <div className="mt-2 px-1">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 mb-1">
          {document.titre.slice(0, 40)}{document.titre.length > 40 ? "..." : ""}
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          {new Date(document.date_publication).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default PDFMiniature;

