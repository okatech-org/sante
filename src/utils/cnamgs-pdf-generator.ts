import { jsPDF } from "jspdf";

/**
 * Génère un PDF A4 avec la carte CNAMGS à l'échelle exacte ID-1 (85.60 × 53.98 mm),
 * traits de coupe, sections d'informations et zones images (armoiries, logo, photo).
 *
 * — Vectoriel : rectangles, lignes, textes
 * — Images : intégrées depuis URLs / dataURL (logos, photo)
 * — Grille optionnelle pour calage
 */
export type CNAMGSData = {
  numero: string; // "001-012-198-2"
  nom: string; // "PELLEN-LAKOUMBA"
  prenoms: string; // "GUEYLORD ASTED"
  dateNaissance: string; // "01/12/1982"
  age?: string; // "42 ans"
  sexe?: "M" | "F";
  regime: string; // "Secteur Privé"
  qualite?: string; // "Assuré principal"
  employeur: string; // "ORGANÉUS GABON"
  couvertures: {
    type: string;
    taux: string; // "80%"
    ticket: string; // "20% ..."
  }[];
};

export type CNAMGSAssets = {
  armoiriesUrl?: string; // ex: "/emblem_gabon.png"
  cnamgsLogoUrl?: string; // ex: "/cnamgs_logo.png"
  photoUrl?: string; // ex: "/photo_titulaire.png"
};

export type CNAMGSPdfOptions = {
  showGrid?: boolean; // afficher une grille de calage subtile
  downloadFileName?: string; // si fourni, déclenche un téléchargement
};

// Constantes tailles
const A4 = { w: 210, h: 297 }; // mm
const CARD = { w: 85.6, h: 53.98, radius: 3 }; // ID-1 (ISO/IEC 7810)
const MARGIN = 15; // mm

// Placement carte (centrée sous en-tête)
const HEADER_H = 25; // mm
const CARD_Y = HEADER_H + 10; // mm – espacements sous l'en-tête
const CARD_X = (A4.w - CARD.w) / 2; // centré

// Utilitaires -----------------------------------------------------------------
const loadImageAsDataUrl = (src: string): Promise<string> =>
  new Promise((resolve) => {
    if (!src) return resolve("");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const data = canvas.toDataURL("image/png");
          resolve(data);
        } catch {
          resolve("");
        }
      } else {
        resolve("");
      }
    };
    img.onerror = () => resolve("");
    img.src = src;
  });

// Charge une image et la découpe en ellipse (comme dans l'application)
const loadEllipticalImageAsDataUrl = (src: string, width: number = 260, height: number = 320): Promise<string> =>
  new Promise((resolve) => {
    if (!src) return resolve("");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Activer l'anti-aliasing pour une ellipse lisse
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Créer un clip elliptique
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Dessiner l'image centrée et couvrant toute l'ellipse
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();
        
        try {
          const data = canvas.toDataURL("image/png");
          resolve(data);
        } catch {
          resolve("");
        }
      } else {
        resolve("");
      }
    };
    img.onerror = () => resolve("");
    img.src = src;
  });

const drawCutMarks = (
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  len = 3
) => {
  doc.setLineWidth(0.1);
  doc.setDrawColor(150, 150, 150);
  // Coins
  const corners = [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ];
  corners.forEach(([cx, cy]) => {
    doc.line(cx - len, cy, cx + len, cy);
    doc.line(cx, cy - len, cx, cy + len);
  });
};

const drawGrid = (doc: jsPDF, step = 10) => {
  doc.setLineWidth(0.05);
  doc.setDrawColor(200, 200, 200);
  for (let x = 0; x <= A4.w; x += step) {
    doc.line(x, 0, x, A4.h);
  }
  for (let y = 0; y <= A4.h; y += step) {
    doc.line(0, y, A4.w, y);
  }
};

// Fonction principale ---------------------------------------------------------
// Helper to capture SVG as high-res image, excluding emblem and photo
const captureSVGAsImage = async (): Promise<string> => {
  const svgContainer = document.querySelector('.cnamgs-card-svg');
  if (!svgContainer) return "";
  
  const svgElement = svgContainer.querySelector('svg');
  if (!svgElement) return "";
  
  // Clone the SVG to avoid modifying the original
  const clonedSvg = svgElement.cloneNode(true) as SVGElement;
  
  // Masquer l'emblème des armoiries (on le superposera après)
  const emblemImage = clonedSvg.querySelector('#img-coat-of-arms');
  if (emblemImage) {
    emblemImage.setAttribute('opacity', '0');
  }
  
  // Masquer le logo CNAMGS (on le superposera après pour meilleure qualité)
  const logoImage = clonedSvg.querySelector('#img-cnamgs-logo');
  if (logoImage) {
    logoImage.setAttribute('opacity', '0');
  }
  
  // Masquer la puce (on la superposera après pour meilleure qualité)
  const chipImage = clonedSvg.querySelector('#chip');
  if (chipImage) {
    chipImage.setAttribute('opacity', '0');
  }
  
  // Masquer la photo d'identité (on la superposera après avec clip ellipse)
  const photoPlaceholder = clonedSvg.querySelector('#photo-placeholder');
  if (photoPlaceholder) {
    photoPlaceholder.setAttribute('opacity', '0');
  }
  
  // NE PAS masquer l'image en filigrane - on veut la conserver
  const watermarkImage = clonedSvg.querySelector('image[href="/watermark_waves.jpg"]');
  
  // Masquer toutes les images dynamiques sauf le filigrane
  const allImages = clonedSvg.querySelectorAll('image');
  allImages.forEach(img => {
    // Ne pas masquer l'image en filigrane
    if (img === watermarkImage) return;
    
    const href = img.getAttribute('href') || img.getAttribute('xlink:href') || '';
    if (href.includes('http') || href.includes('blob:') || href.includes('data:')) {
      img.setAttribute('opacity', '0');
    }
  });
  
  // Set explicit width and height for high resolution
  const svgWidth = 1050; // Dimensions du template
  const svgHeight = 650;
  
  clonedSvg.setAttribute('width', svgWidth.toString());
  clonedSvg.setAttribute('height', svgHeight.toString());
  
  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Ultra high resolution: 600 DPI equivalent for crisp output
      const scale = 6;
      const targetWidth = 856; // Target width in pixels for 85.6mm
      const targetHeight = 540; // Target height in pixels for 53.98mm
      
      canvas.width = targetWidth * scale;
      canvas.height = targetHeight * scale;
      
      const ctx = canvas.getContext('2d', { 
        alpha: true,
        desynchronized: false,
        colorSpace: 'srgb'
      });
      
      if (ctx) {
        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Scale and draw with anti-aliasing
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Export as high-quality PNG
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } else {
        URL.revokeObjectURL(url);
        resolve("");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };
    img.src = url;
  });
};

export const generateCNAMGSPdf = async (
  data: CNAMGSData,
  assets?: CNAMGSAssets,
  opts?: CNAMGSPdfOptions
): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Grille optionnelle
  if (opts?.showGrid) {
    drawGrid(doc);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EN-TÊTE
  // ═══════════════════════════════════════════════════════════════════════════
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("RÉPUBLIQUE GABONAISE", A4.w / 2, 12, { align: "center" });

  doc.setFontSize(16);
  doc.text("ATTESTATION D'ASSURANCE MALADIE", A4.w / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("CNAMGS", A4.w / 2, 26, { align: "center" });

  // ═══════════════════════════════════════════════════════════════════════════
  // CARTE CNAMGS - Capture SVG haute résolution + images superposées
  // ═══════════════════════════════════════════════════════════════════════════

  // Traits de coupe
  drawCutMarks(doc, CARD_X, CARD_Y, CARD.w, CARD.h, 3);

  // Charger les images directement depuis les fichiers
  const armoiriesData = assets?.armoiriesUrl
    ? await loadImageAsDataUrl(assets.armoiriesUrl)
    : "";
  const logoData = assets?.cnamgsLogoUrl
    ? await loadImageAsDataUrl(assets.cnamgsLogoUrl)
    : "";
  const chipData = await loadImageAsDataUrl('/puce_cnamgs.png');
  
  // Charger la photo et la découper en ellipse (comme dans l'application - rx=130, ry=160)
  const photoData = assets?.photoUrl
    ? await loadEllipticalImageAsDataUrl(assets.photoUrl, 260, 320)
    : "";

  // Capturer le SVG de la carte comme image ultra haute résolution
  const cardImageData = await captureSVGAsImage();
  
  if (cardImageData) {
    // Ajouter l'image capturée de la carte en haute qualité
    doc.addImage(cardImageData, "PNG", CARD_X, CARD_Y, CARD.w, CARD.h, undefined, 'FAST');
    
    // Superposer les images sources pour une qualité optimale
    // Emblème des armoiries (haut gauche) - position exacte du SVG
    // SVG: x="37" y="15" width="138" height="138" sur canvas 1050x650
    if (armoiriesData) {
      const emblemW = CARD.w * 0.1314; // ~11.25mm
      const emblemH = emblemW; // carré
      const emblemX = CARD_X + CARD.w * 0.0352; // ~3mm du bord
      const emblemY = CARD_Y + CARD.h * 0.0231; // ~1.25mm du haut
      doc.addImage(armoiriesData, "PNG", emblemX, emblemY, emblemW, emblemH);
    }

    // Logo CNAMGS (haut droite) - position exacte du SVG
    // SVG: x="610" y="29" width="400" height="110" sur canvas 1050x650
    if (logoData) {
      const logoW = CARD.w * 0.3810; // ~32.6mm
      const logoH = logoW * 0.20; // Hauteur réduite pour fond gris carré
      const logoX = CARD_X + CARD.w * 0.5810; // ~49.7mm du bord gauche
      const logoY = CARD_Y + CARD.h * 0.0446 + 1; // ~2.4mm du haut + 1mm
      doc.addImage(logoData, "PNG", logoX, logoY, logoW, logoH);
    }

    // Puce SIM (gauche, après bande verte) - position exacte du SVG
    // SVG: x="93" y="223" width="162" height="125" sur canvas 1050x650
    if (chipData) {
      const chipW = CARD.w * 0.1543; // ~13.2mm
      const chipH = CARD.h * 0.1923; // ~10.4mm
      const chipX = CARD_X + CARD.w * 0.0886; // ~7.6mm du bord gauche
      const chipY = CARD_Y + CARD.h * 0.3431; // ~18.5mm du haut
      doc.addImage(chipData, "PNG", chipX, chipY, chipW, chipH);
    }

    // Photo du titulaire (bas droite) - ellipse verticale comme dans le SVG
    // SVG: ellipse cx="847" cy="447" rx="130" ry="160" sur canvas 1050x650
    // rx < ry = ellipse verticale (plus haute que large)
    if (photoData) {
      const photoRx = CARD.w * 0.1238; // ~10.6mm (rayon horizontal)
      const photoRy = CARD.h * 0.2462; // ~13.3mm (rayon vertical)
      const photoCx = CARD_X + CARD.w * 0.8067; // centre x
      const photoCy = CARD_Y + CARD.h * 0.6877; // centre y
      
      // Position pour image (coin haut-gauche)
      const photoX = photoCx - photoRx;
      const photoY = photoCy - photoRy;
      const photoW = photoRx * 2;
      const photoH = photoRy * 2;
      
      doc.addImage(photoData, "PNG", photoX, photoY, photoW, photoH);
    }
  } else {
    // Fallback: rendu vectoriel si la capture échoue
    // Fond carte (vert clair)
    doc.setFillColor(233, 242, 233);
    doc.roundedRect(CARD_X, CARD_Y, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");

    // Bande verte horizontale
    const bandY = CARD_Y + 19.5;
    doc.setFillColor(42, 168, 74);
    doc.rect(CARD_X, bandY, CARD.w, 2, "F");

    // Textes en-tête carte
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("RÉPUBLIQUE", CARD_X + 18, CARD_Y + 8);
    doc.text("GABONAISE", CARD_X + 18, CARD_Y + 13);

    // "Secteur Privé" centré
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Secteur Privé", CARD_X + CARD.w / 2, CARD_Y + 24.5, { align: "center" });
    
    // "Carte d'Assurance Maladie" centré
    doc.setFontSize(8);
    doc.text("Carte d'Assurance Maladie", CARD_X + CARD.w / 2, CARD_Y + 29, {
      align: "center",
    });

    // Numéro de carte
    doc.setFontSize(7);
    doc.setFont("courier", "bold");
    doc.text(data.numero, CARD_X + CARD.w / 2, CARD_Y + 34, { align: "center" });

    // Puce (chip)
    const chipX = CARD_X + 13;
    const chipY = CARD_Y + 23;
    const chipW = 15;
    const chipH = 11;
    doc.setFillColor(239, 211, 137);
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(0.2);
    doc.roundedRect(chipX, chipY, chipW, chipH, 2, 2, "FD");

    // Détails chip
    doc.setLineWidth(0.15);
    const innerMargin = 1.5;
    doc.roundedRect(chipX + innerMargin, chipY + innerMargin, chipW - 2*innerMargin, chipH - 2*innerMargin, 1, 1, "D");
    
    const cellW = (chipW - 2*innerMargin) / 3;
    const cellH = (chipH - 2*innerMargin) / 3;
    
    for (let i = 1; i < 3; i++) {
      doc.line(chipX + innerMargin + i * cellW, chipY + innerMargin, chipX + innerMargin + i * cellW, chipY + chipH - innerMargin);
      doc.line(chipX + innerMargin, chipY + innerMargin + i * cellH, chipX + chipW - innerMargin, chipY + innerMargin + i * cellH);
    }

    // Champs identité
    const labelStartX = CARD_X + 13;
    const labelStartY = CARD_Y + 38;

    doc.setFontSize(5);
    doc.setFont("helvetica", "bold");
    doc.text("Nom", labelStartX, labelStartY);
    doc.setFontSize(7);
    doc.text(data.nom, labelStartX, labelStartY + 3);

    doc.setFontSize(5);
    doc.text("Prénoms", labelStartX, labelStartY + 7);
    doc.setFontSize(7);
    doc.text(data.prenoms, labelStartX, labelStartY + 10);

    doc.setFontSize(5);
    doc.text("Date de naissance", labelStartX, labelStartY + 14);
    doc.setFontSize(7);
    doc.text(data.dateNaissance, labelStartX, labelStartY + 17);

    // Sexe
    const sexeX = CARD_X + 55;
    doc.setFontSize(5);
    doc.text("Sexe", sexeX, labelStartY + 7);
    doc.setFontSize(7);
    doc.text(data.sexe || "M", sexeX, labelStartY + 10);
    
    // Fallback: Superposer les images sources
    if (armoiriesData) {
      const emblemSize = 10;
      doc.addImage(armoiriesData, "PNG", CARD_X + 5.5, CARD_Y + 3, emblemSize, emblemSize);
    }

    if (logoData) {
      const logoWidth = 32;
      const logoHeight = logoWidth * 0.20; // Hauteur réduite pour fond gris carré
      doc.addImage(logoData, "PNG", CARD_X + 48, CARD_Y + 5, logoWidth, logoHeight);
    }

    if (chipData) {
      const chipW = CARD.w * 0.1543;
      const chipH = CARD.h * 0.1923;
      const chipX = CARD_X + CARD.w * 0.0886;
      const chipY = CARD_Y + CARD.h * 0.3431;
      doc.addImage(chipData, "PNG", chipX, chipY, chipW, chipH);
    }

    if (photoData) {
      const photoRx = CARD.w * 0.1238;
      const photoRy = CARD.h * 0.2462;
      const photoCx = CARD_X + CARD.w * 0.8067;
      const photoCy = CARD_Y + CARD.h * 0.6877;
      const photoX = photoCx - photoRx;
      const photoY = photoCy - photoRy;
      const photoW = photoRx * 2;
      const photoH = photoRy * 2;
      doc.addImage(photoData, "PNG", photoX, photoY, photoW, photoH);
    }
  }

  // Cadre carte
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(CARD_X, CARD_Y, CARD.w, CARD.h, CARD.radius, CARD.radius);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTIONS D'INFORMATIONS (sous la carte)
  // ═══════════════════════════════════════════════════════════════════════════
  let currentY = CARD_Y + CARD.h + 15;

  // Section Assuré
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Informations de l'assuré", MARGIN, currentY);
  currentY += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Qualité : ${data.qualite || "Assuré principal"}`, MARGIN, currentY);
  currentY += 5;
  doc.text(`Employeur : ${data.employeur}`, MARGIN, currentY);
  currentY += 5;
  if (data.age) {
    doc.text(`Âge : ${data.age}`, MARGIN, currentY);
    currentY += 5;
  }

  currentY += 5;

  // Section Couvertures
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Couvertures", MARGIN, currentY);
  currentY += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  data.couvertures.forEach((couv) => {
    doc.text(`• ${couv.type}`, MARGIN + 2, currentY);
    currentY += 4;
    doc.setFont("helvetica", "italic");
    doc.text(`  Taux : ${couv.taux} - ${couv.ticket}`, MARGIN + 4, currentY);
    doc.setFont("helvetica", "normal");
    currentY += 5;
  });

  currentY += 5;

  // Pied de page
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(0, 0, 0);
  doc.text(
    "Cette attestation certifie que le titulaire bénéficie d'une couverture",
    A4.w / 2,
    currentY,
    { align: "center" }
  );
  currentY += 5;
  doc.text(
    "d'assurance maladie auprès de la CNAMGS.",
    A4.w / 2,
    currentY,
    { align: "center" }
  );
  currentY += 10;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Document généré le ${new Date().toLocaleDateString("fr-FR")}`,
    A4.w / 2,
    currentY,
    { align: "center" }
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════════════════════════════════
  if (opts?.downloadFileName) {
    doc.save(opts.downloadFileName);
  }

  return doc.output("blob");
};
