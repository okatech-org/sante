import { useState, useMemo, useCallback } from "react";
import { KnowledgeDocument, KnowledgeFilter, SortOption } from "@/types/knowledge";
import { KnowledgeExtractor } from "@/services/knowledgeExtractor";

const MOCK_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: "kb-1",
    titre: "Loi n°12/95 relative à la Politique de Santé",
    description: "Cadre juridique définissant la politique nationale de santé au Gabon",
    categorie: "loi",
    tags: ["politique", "santé", "législation", "gabon"],
    auteur: "Assemblée Nationale",
    date_publication: "1995-12-15",
    date_ajout: "2024-01-10",
    fichier_type: "application/pdf",
    fichier_taille: 2450000,
    metadonnees: {
      nombre_pages: 45,
      langue: "français",
      version: "1.0",
      statut: "validé"
    },
    pertinence_score: 95,
    nombre_consultations: 342,
    derniere_consultation: "2025-11-01"
  },
  {
    id: "kb-2",
    titre: "PNDS 2024-2028 - Plan National de Développement Sanitaire",
    description: "Stratégie quinquennale du secteur de la santé au Gabon",
    categorie: "strategie",
    tags: ["pnds", "stratégie", "développement", "csu", "2028"],
    auteur: "Ministère de la Santé",
    date_publication: "2024-01-15",
    date_ajout: "2024-01-16",
    fichier_type: "application/pdf",
    fichier_taille: 5120000,
    metadonnees: {
      nombre_pages: 120,
      langue: "français",
      version: "1.0",
      statut: "validé"
    },
    pertinence_score: 98,
    nombre_consultations: 587,
    derniere_consultation: "2025-11-02"
  },
  {
    id: "kb-3",
    titre: "Décret n°0292/PR/MS portant attributions du Ministre",
    description: "Définition des attributions et missions du Ministre de la Santé",
    categorie: "decret",
    tags: ["décret", "attributions", "ministre", "organisation"],
    auteur: "Présidence de la République",
    date_publication: "2023-03-20",
    date_ajout: "2024-01-10",
    fichier_type: "application/pdf",
    fichier_taille: 890000,
    metadonnees: {
      nombre_pages: 12,
      langue: "français",
      version: "1.0",
      statut: "validé"
    },
    pertinence_score: 88,
    nombre_consultations: 234,
    derniere_consultation: "2025-10-28"
  },
  {
    id: "kb-4",
    titre: "Rapport Annuel 2023 - Activités Sanitaires",
    description: "Bilan des activités du Ministère de la Santé pour l'année 2023",
    categorie: "rapport",
    tags: ["rapport", "annuel", "2023", "bilan", "activités"],
    auteur: "Direction Générale de la Santé",
    date_publication: "2024-02-01",
    date_ajout: "2024-02-05",
    fichier_type: "application/pdf",
    fichier_taille: 8450000,
    metadonnees: {
      nombre_pages: 180,
      langue: "français",
      version: "1.0",
      statut: "validé"
    },
    pertinence_score: 85,
    nombre_consultations: 456,
    derniere_consultation: "2025-10-30"
  },
  {
    id: "kb-5",
    titre: "Guide de Gestion des Épidémies au Gabon",
    description: "Protocoles et procédures pour la gestion des urgences épidémiologiques",
    categorie: "guide",
    tags: ["guide", "épidémies", "urgence", "protocole", "santé publique"],
    auteur: "Direction de la Lutte contre la Maladie",
    date_publication: "2023-09-10",
    date_ajout: "2024-01-12",
    fichier_type: "application/pdf",
    fichier_taille: 3200000,
    metadonnees: {
      nombre_pages: 68,
      langue: "français",
      version: "2.1",
      statut: "validé"
    },
    pertinence_score: 92,
    nombre_consultations: 678,
    derniere_consultation: "2025-11-01"
  },
  {
    id: "kb-6",
    titre: "Étude OMS - Système de Santé Gabonais 2024",
    description: "Analyse complète du système de santé du Gabon par l'Organisation Mondiale de la Santé",
    categorie: "etude",
    tags: ["oms", "étude", "système", "analyse", "international"],
    auteur: "Organisation Mondiale de la Santé",
    date_publication: "2024-06-15",
    date_ajout: "2024-06-20",
    fichier_type: "application/pdf",
    fichier_taille: 6700000,
    metadonnees: {
      nombre_pages: 145,
      langue: "français",
      version: "1.0",
      statut: "validé"
    },
    pertinence_score: 94,
    nombre_consultations: 523,
    derniere_consultation: "2025-10-29"
  },
  {
    id: "kb-7",
    titre: "Code de la Santé Publique du Gabon",
    description: "Compilation des lois et règlements en matière de santé publique",
    categorie: "loi",
    tags: ["code", "santé publique", "législation", "compilation"],
    auteur: "Ministère de la Santé",
    date_publication: "2018-12-01",
    date_ajout: "2024-01-10",
    fichier_type: "application/pdf",
    fichier_taille: 12500000,
    metadonnees: {
      nombre_pages: 320,
      langue: "français",
      version: "3.0",
      statut: "validé"
    },
    pertinence_score: 97,
    nombre_consultations: 891,
    derniere_consultation: "2025-11-02"
  },
  {
    id: "kb-8",
    titre: "Bulletin Épidémiologique Mensuel - Octobre 2025",
    description: "Surveillance épidémiologique nationale pour le mois d'octobre 2025",
    categorie: "rapport",
    tags: ["bulletin", "épidémiologie", "surveillance", "octobre", "2025"],
    auteur: "Direction de la Prévention",
    date_publication: "2025-10-31",
    date_ajout: "2025-11-01",
    fichier_type: "application/pdf",
    fichier_taille: 1800000,
    metadonnees: {
      nombre_pages: 25,
      langue: "français",
      version: "1.0",
      statut: "validé"
    },
    pertinence_score: 90,
    nombre_consultations: 145,
    derniere_consultation: "2025-11-02"
  },
];

export const useKnowledgeBase = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(MOCK_KNOWLEDGE_BASE);
  const [filter, setFilter] = useState<KnowledgeFilter>({});
  const [sortBy, setSortBy] = useState<SortOption>("pertinence");
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    if (filter.categorie) {
      filtered = filtered.filter(doc => doc.categorie === filter.categorie);
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(doc => 
        filter.tags!.some(tag => doc.tags.includes(tag))
      );
    }

    if (filter.recherche) {
      const search = filter.recherche.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.titre.toLowerCase().includes(search) ||
        doc.description.toLowerCase().includes(search) ||
        doc.tags.some(tag => tag.toLowerCase().includes(search)) ||
        doc.auteur.toLowerCase().includes(search)
      );
    }

    if (filter.dateDebut) {
      filtered = filtered.filter(doc => doc.date_publication >= filter.dateDebut!);
    }

    if (filter.dateFin) {
      filtered = filtered.filter(doc => doc.date_publication <= filter.dateFin!);
    }

    return filtered;
  }, [documents, filter]);

  const sortedDocuments = useMemo(() => {
    const sorted = [...filteredDocuments];

    switch (sortBy) {
      case "date_desc":
        return sorted.sort((a, b) => 
          new Date(b.date_publication).getTime() - new Date(a.date_publication).getTime()
        );
      case "date_asc":
        return sorted.sort((a, b) => 
          new Date(a.date_publication).getTime() - new Date(b.date_publication).getTime()
        );
      case "pertinence":
        return sorted.sort((a, b) => (b.pertinence_score || 0) - (a.pertinence_score || 0));
      case "consultations":
        return sorted.sort((a, b) => b.nombre_consultations - a.nombre_consultations);
      case "titre_asc":
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      case "titre_desc":
        return sorted.sort((a, b) => b.titre.localeCompare(a.titre));
      default:
        return sorted;
    }
  }, [filteredDocuments, sortBy]);

  const uploadDocument = useCallback(async (file: File): Promise<KnowledgeDocument> => {
    setIsUploading(true);
    
    try {
      const { metadata, contenu } = await KnowledgeExtractor.processDocument(file);
      
      const newDoc: KnowledgeDocument = {
        id: `kb-${Date.now()}`,
        titre: metadata.titre,
        description: metadata.resume,
        categorie: metadata.categorie as any,
        tags: metadata.tags,
        auteur: metadata.auteur,
        date_publication: metadata.date,
        date_ajout: new Date().toISOString().split('T')[0],
        fichier_type: file.type,
        fichier_taille: file.size,
        contenu_extrait: contenu,
        metadonnees: {
          langue: "français",
          version: "1.0",
          statut: "brouillon"
        },
        pertinence_score: 75,
        nombre_consultations: 0,
      };

      setDocuments(prev => [newDoc, ...prev]);
      return newDoc;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<KnowledgeDocument>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  }, []);

  const exportToJSON = useCallback(() => {
    const dataStr = JSON.stringify(sortedDocuments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `base-connaissance-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [sortedDocuments]);

  const stats = useMemo(() => {
    const byCategory = documents.reduce((acc, doc) => {
      acc[doc.categorie] = (acc[doc.categorie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSize = documents.reduce((sum, doc) => sum + (doc.fichier_taille || 0), 0);

    return {
      total: documents.length,
      byCategory,
      totalSize,
      totalConsultations: documents.reduce((sum, doc) => sum + doc.nombre_consultations, 0),
    };
  }, [documents]);

  return {
    documents: sortedDocuments,
    allDocuments: documents,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    uploadDocument,
    deleteDocument,
    updateDocument,
    exportToJSON,
    isUploading,
    stats,
  };
};

