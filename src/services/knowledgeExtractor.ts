import { ExtractedMetadata } from "@/types/knowledge";

export class KnowledgeExtractor {
  private static async analyzeTextContent(text: string): Promise<Partial<ExtractedMetadata>> {
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = new Map<string, number>();
    
    const stopWords = new Set([
      "le", "la", "les", "de", "du", "des", "un", "une", "et", "ou", "mais", 
      "donc", "car", "pour", "dans", "sur", "avec", "par", "est", "sont", "a"
    ]);

    words.forEach(word => {
      const cleanWord = word.replace(/[^\wàâäéèêëïîôùûüÿæœç]/gi, '');
      if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
        wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1);
      }
    });

    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})|(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g;
    const dates = text.match(dateRegex);

    const titreMatch = text.match(/^(.{1,150})/);
    const titre = titreMatch ? titreMatch[1].trim() : "Document sans titre";

    return {
      titre,
      date: dates ? dates[0] : new Date().toISOString().split('T')[0],
      mots_cles: sortedWords,
      resume: text.slice(0, 300).trim() + "...",
    };
  }

  private static detectCategory(text: string, filename: string): string {
    const lowerText = text.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    if (lowerText.includes("loi n°") || lowerText.includes("ordonnance") || lowerFilename.includes("loi")) {
      return "loi";
    }
    if (lowerText.includes("décret") || lowerText.includes("arrete") || lowerFilename.includes("decret")) {
      return "decret";
    }
    if (lowerText.includes("rapport") || lowerFilename.includes("rapport")) {
      return "rapport";
    }
    if (lowerText.includes("étude") || lowerText.includes("analyse") || lowerFilename.includes("etude")) {
      return "etude";
    }
    if (lowerText.includes("guide") || lowerText.includes("manuel") || lowerFilename.includes("guide")) {
      return "guide";
    }
    if (lowerText.includes("stratégie") || lowerText.includes("plan") || lowerFilename.includes("pnds")) {
      return "strategie";
    }
    return "autre";
  }

  private static detectAuthor(text: string): string {
    const authorPatterns = [
      /(?:par|de|auteur[:\s]+)([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+){1,3})/,
      /(?:ministre|dr\.|pr\.|professeur)\s+([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+){1,3})/i,
    ];

    for (const pattern of authorPatterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }

    return "Ministère de la Santé";
  }

  private static async extractPDFText(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        try {
          const text = new TextDecoder().decode(arrayBuffer);
          const cleanText = text.replace(/[^\x20-\x7E\u00C0-\u024F\u1E00-\u1EFF]/g, ' ');
          resolve(cleanText.slice(0, 5000));
        } catch {
          resolve(file.name);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private static async extractTextFromFile(file: File): Promise<string> {
    if (file.type === "application/pdf") {
      return await this.extractPDFText(file);
    }
    
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      return await file.text();
    }

    return file.name;
  }

  static async extractMetadata(file: File): Promise<ExtractedMetadata> {
    const textContent = await this.extractTextFromFile(file);
    const analyzed = await this.analyzeTextContent(textContent);
    const categorie = this.detectCategory(textContent, file.name);
    const auteur = this.detectAuthor(textContent);

    const tags = [
      categorie,
      ...analyzed.mots_cles?.slice(0, 5) || [],
      "gabon",
      "santé"
    ].filter(Boolean);

    return {
      titre: analyzed.titre || file.name.replace(/\.[^/.]+$/, ""),
      auteur,
      date: analyzed.date || new Date().toISOString().split('T')[0],
      categorie,
      tags: Array.from(new Set(tags)),
      resume: analyzed.resume || `Document: ${file.name}`,
      mots_cles: analyzed.mots_cles || [],
    };
  }

  static async processDocument(file: File): Promise<{
    metadata: ExtractedMetadata;
    contenu: string;
  }> {
    const metadata = await this.extractMetadata(file);
    const contenu = await this.extractTextFromFile(file);
    
    return {
      metadata,
      contenu: contenu.slice(0, 10000),
    };
  }
}

