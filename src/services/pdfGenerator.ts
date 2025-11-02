import jsPDF from 'jspdf';

export interface PDFReportData {
  title: string;
  type: string;
  date: Date;
  minister: {
    name: string;
    title: string;
  };
  content: string;
  sections?: Array<{
    title: string;
    content: string;
  }>;
  kpis?: Array<{
    label: string;
    value: string | number;
    delta?: string;
  }>;
  recommendations?: string[];
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageHeight = 297; // A4 en mm
  private pageWidth = 210;
  private currentY = 20;
  private margin = 20;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  }

  private addHeader(title: string, date: Date) {
    // En-tête République Gabonaise
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RÉPUBLIQUE GABONAISE', this.pageWidth / 2, 15, { align: 'center' });
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Ministère de la Santé publique et de la Population', this.pageWidth / 2, 20, { align: 'center' });
    
    // Ligne séparatrice
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 25, this.pageWidth - this.margin, 25);
    
    // Titre du document
    this.currentY = 35;
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    const titleLines = this.doc.splitTextToSize(title, this.pageWidth - 2 * this.margin);
    this.doc.text(titleLines, this.pageWidth / 2, this.currentY, { align: 'center' });
    
    this.currentY += titleLines.length * 7 + 5;
    
    // Date
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text(
      `Libreville, le ${date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })}`,
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    
    this.currentY += 15;
  }

  private addSection(title: string, content: string) {
    this.checkNewPage();
    
    // Titre de section
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 7;
    
    // Contenu
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const lines = this.doc.splitTextToSize(content, this.pageWidth - 2 * this.margin);
    
    lines.forEach((line: string) => {
      this.checkNewPage();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 5;
  }

  private addKPIs(kpis: Array<{ label: string; value: string | number; delta?: string }>) {
    this.checkNewPage();
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Indicateurs Clés', this.margin, this.currentY);
    this.currentY += 8;
    
    kpis.forEach(kpi => {
      this.checkNewPage();
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`• ${kpi.label}`, this.margin + 5, this.currentY);
      
      this.doc.setFont('helvetica', 'normal');
      const valueText = `${kpi.value}${kpi.delta ? ` (${kpi.delta})` : ''}`;
      this.doc.text(valueText, this.margin + 15, this.currentY + 5);
      
      this.currentY += 10;
    });
    
    this.currentY += 5;
  }

  private addRecommendations(recommendations: string[]) {
    this.checkNewPage();
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Recommandations Stratégiques', this.margin, this.currentY);
    this.currentY += 8;
    
    recommendations.forEach((rec, index) => {
      this.checkNewPage();
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}.`, this.margin + 5, this.currentY);
      
      this.doc.setFont('helvetica', 'normal');
      const lines = this.doc.splitTextToSize(rec, this.pageWidth - 2 * this.margin - 10);
      
      lines.forEach((line: string, i: number) => {
        this.checkNewPage();
        this.doc.text(line, this.margin + 10, this.currentY + (i * 5));
      });
      
      this.currentY += lines.length * 5 + 5;
    });
    
    this.currentY += 5;
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'italic');
      
      // Ligne séparatrice
      this.doc.setLineWidth(0.3);
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
      
      // Texte pied de page
      this.doc.text(
        'Document confidentiel - Usage interne Ministère de la Santé',
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
      
      // Numéro de page
      this.doc.text(
        `Page ${i} / ${pageCount}`,
        this.pageWidth - this.margin,
        this.pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  private checkNewPage() {
    if (this.currentY > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  generateReport(data: PDFReportData): Blob {
    // En-tête
    this.addHeader(data.title, data.date);
    
    // Introduction
    this.addSection(
      'Introduction',
      `Ce ${data.type} présente une synthèse de la situation sanitaire nationale et des actions prioritaires pour le Ministère de la Santé publique et de la Population.`
    );
    
    // KPIs si fournis
    if (data.kpis && data.kpis.length > 0) {
      this.addKPIs(data.kpis);
    }
    
    // Sections personnalisées
    if (data.sections) {
      data.sections.forEach(section => {
        this.addSection(section.title, section.content);
      });
    }
    
    // Contenu principal si fourni
    if (data.content) {
      const paragraphs = data.content.split('\n\n');
      paragraphs.forEach(para => {
        if (para.trim()) {
          this.checkNewPage();
          this.doc.setFontSize(10);
          this.doc.setFont('helvetica', 'normal');
          const lines = this.doc.splitTextToSize(para.trim(), this.pageWidth - 2 * this.margin);
          lines.forEach((line: string) => {
            this.checkNewPage();
            this.doc.text(line, this.margin, this.currentY);
            this.currentY += 5;
          });
          this.currentY += 3;
        }
      });
    }
    
    // Recommandations
    if (data.recommendations && data.recommendations.length > 0) {
      this.addRecommendations(data.recommendations);
    }
    
    // Signature
    this.checkNewPage();
    this.currentY += 10;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text('Pour le Ministre de la Santé,', this.margin, this.currentY);
    this.currentY += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(data.minister.name, this.margin, this.currentY);
    this.currentY += 5;
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.minister.title, this.margin, this.currentY);
    
    // Pied de page
    this.addFooter();
    
    // Retourner le PDF en Blob
    return this.doc.output('blob');
  }

  generateDecree(data: {
    numero: string;
    titre: string;
    date: Date;
    preambule: string;
    articles: Array<{ numero: string; contenu: string }>;
    minister: { name: string; title: string };
  }): Blob {
    // En-tête
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RÉPUBLIQUE GABONAISE', this.pageWidth / 2, 15, { align: 'center' });
    this.doc.text('Unité - Travail - Justice', this.pageWidth / 2, 20, { align: 'center' });
    
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 25, this.pageWidth - this.margin, 25);
    
    this.currentY = 35;
    
    // Numéro du décret
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`DÉCRET ${data.numero}`, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 10;
    
    // Titre
    this.doc.setFontSize(11);
    const titleLines = this.doc.splitTextToSize(data.titre, this.pageWidth - 2 * this.margin);
    this.doc.text(titleLines, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += titleLines.length * 6 + 10;
    
    // Date
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text(
      `Libreville, le ${data.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );
    this.currentY += 15;
    
    // Préambule
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const preambuleLines = this.doc.splitTextToSize(data.preambule, this.pageWidth - 2 * this.margin);
    preambuleLines.forEach((line: string) => {
      this.checkNewPage();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 10;
    
    // Articles
    data.articles.forEach(article => {
      this.checkNewPage();
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Article ${article.numero}`, this.margin, this.currentY);
      this.currentY += 6;
      
      this.doc.setFont('helvetica', 'normal');
      const articleLines = this.doc.splitTextToSize(article.contenu, this.pageWidth - 2 * this.margin - 5);
      articleLines.forEach((line: string) => {
        this.checkNewPage();
        this.doc.text(line, this.margin + 5, this.currentY);
        this.currentY += 5;
      });
      
      this.currentY += 8;
    });
    
    // Signature
    this.checkNewPage();
    this.currentY += 10;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Le Ministre de la Santé publique et de la Population,', this.margin, this.currentY);
    this.currentY += 15;
    this.doc.text(data.minister.name, this.margin, this.currentY);
    
    // Pied de page
    this.addFooter();
    
    return this.doc.output('blob');
  }
}

export const generateMinisterReport = async (reportType: string, context: any): Promise<Blob> => {
  const generator = new PDFGenerator();
  
  const reportData: PDFReportData = {
    title: reportType,
    type: 'rapport',
    date: new Date(),
    minister: {
      name: 'Pr. Adrien MOUGOUGOU',
      title: 'Ministre de la Santé publique et de la Population',
    },
    content: `Synthèse exécutive du ${reportType.toLowerCase()}.`,
    sections: [
      {
        title: 'Contexte',
        content: 'Situation sanitaire nationale au ' + new Date().toLocaleDateString('fr-FR'),
      },
      {
        title: 'Faits Clés',
        content: context?.summary || 'Analyse des données disponibles...',
      },
      {
        title: 'Risques et Écarts',
        content: context?.risks || 'Identification des zones à risque...',
      },
    ],
    kpis: context?.kpis || [
      { label: 'Couverture nationale', value: '78%', delta: '+2.1%' },
      { label: 'Structures opérationnelles', value: '238', delta: '+5' },
      { label: 'Budget exécuté', value: '65%', delta: '+3.1%' },
    ],
    recommendations: context?.recommendations || [
      'Renforcer la couverture dans les provinces à faible taux',
      'Accélérer le déploiement des plateaux techniques',
      'Optimiser la répartition du budget entre les provinces',
    ],
  };
  
  return generator.generateReport(reportData);
};

export const generateMinisterDecree = async (
  subject: string,
  articles: string[]
): Promise<Blob> => {
  const generator = new PDFGenerator();
  
  const year = new Date().getFullYear();
  const nextNumber = Math.floor(Math.random() * 100) + 1;
  
  const decreeData = {
    numero: `N°${String(nextNumber).padStart(3, '0')}/PR/MSP/${year}`,
    titre: subject,
    date: new Date(),
    preambule: `Le Président de la République, Chef de l'État ;\n\nVu la Constitution ;\nVu la loi organique relative aux attributions du Ministre de la Santé ;\nSur proposition du Ministre de la Santé publique et de la Population ;\n\nDÉCRÈTE :`,
    articles: articles.map((content, index) => ({
      numero: String(index + 1),
      contenu: content,
    })),
    minister: {
      name: 'Pr. Adrien MOUGOUGOU',
      title: 'Ministre de la Santé publique et de la Population',
    },
  };
  
  return generator.generateDecree(decreeData);
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

