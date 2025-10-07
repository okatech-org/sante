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
  numeroAttestation?: string; // "2025/CNAMGS/00001234"
  dateDebut?: string; // "01/01/2025"
  dateFin?: string; // "31/12/2025"
  statut?: "Actif" | "Inactif";
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

// Placement carte (haut droit de l'attestation)
const HEADER_H = 53; // mm - en-tête + titre
const CARD_Y = HEADER_H + 8; // mm
const CARD_X = A4.w - MARGIN - CARD.w; // aligné à droite

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

// Charge le filigrane en ultra haute résolution avec opacité
const loadWatermarkHighRes = (src: string, opacity: number = 0.25): Promise<string> =>
  new Promise((resolve) => {
    if (!src) return resolve("");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Ultra high resolution comme pour le SVG
      const scale = 6;
      const targetWidth = 856;
      const targetHeight = 477; // Hauteur de la partie basse (73.4% de 650px)
      
      canvas.width = targetWidth * scale;
      canvas.height = targetHeight * scale;
      
      const ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: false,
        colorSpace: 'srgb'
      });
      
      if (ctx) {
        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Appliquer l'opacité
        ctx.globalAlpha = opacity;
        
        // Scale and draw with anti-aliasing
        ctx.scale(scale, scale);
        
        // Dessiner l'image en couvrant toute la zone
        const scaleX = targetWidth / img.width;
        const scaleY = targetHeight / img.height;
        const imgScale = Math.max(scaleX, scaleY);
        const imgW = img.width * imgScale;
        const imgH = img.height * imgScale;
        const imgX = (targetWidth - imgW) / 2;
        const imgY = (targetHeight - imgH) / 2;
        
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
        
        try {
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          resolve(dataUrl);
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
  
  // Masquer toutes les images dynamiques
  const allImages = clonedSvg.querySelectorAll('image');
  allImages.forEach(img => {
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
  // EN-TÊTE OFFICIEL
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Bande bleue supérieure avec dégradé simulé
  doc.setFillColor(30, 58, 138); // Bleu foncé
  doc.rect(0, 0, A4.w, 35, "F");
  
  // Ligne verte accent en haut
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, A4.w, 1, "F");
  
  // Logo CNAMGS
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("CNAMGS", A4.w / 2, 15, { align: "center" });
  
  // Sous-titre
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("CAISSE NATIONALE D'ASSURANCE MALADIE", A4.w / 2, 22, { align: "center" });
  doc.text("ET DE GARANTIE SOCIALE", A4.w / 2, 27, { align: "center" });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TITRE DU DOCUMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Fond gris clair
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 35, A4.w, 18, "F");
  
  // Bordure gauche verte
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 35, 1.2, 18, "F");
  
  // Titre
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138);
  doc.text("ATTESTATION DE DROITS", MARGIN, 44);
  
  // Numéro d'attestation
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  const numAttestation = data.numeroAttestation || `2025/CNAMGS/${data.numero.replace(/-/g, '')}`;
  doc.text(`N° ATTESTATION : ${numAttestation}`, MARGIN, 50);

  // ═══════════════════════════════════════════════════════════════════════════
  // CARTE CNAMGS - Capture SVG haute résolution + images superposées
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFET D'OMBRE (EN ARRIÈRE-PLAN - AVANT LE CONTENU)
  // ═══════════════════════════════════════════════════════════════════════════
  const shadowOffset = 0.15; // mm - décalage subtil
  
  // Ombre diffuse (6 couches pour un dégradé réaliste)
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(CARD_X + 0.5, CARD_Y + 0.5, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");
  
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(CARD_X + 0.4, CARD_Y + 0.4, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");
  
  doc.setFillColor(235, 235, 235);
  doc.roundedRect(CARD_X + 0.3, CARD_Y + 0.3, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");
  
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(CARD_X + 0.25, CARD_Y + 0.25, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");
  
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(CARD_X + 0.2, CARD_Y + 0.2, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");
  
  doc.setFillColor(210, 210, 210);
  doc.roundedRect(CARD_X + shadowOffset, CARD_Y + shadowOffset, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENU DE LA CARTE (PAR-DESSUS LES OMBRES)
  // ═══════════════════════════════════════════════════════════════════════════

  // Charger les images directement depuis les fichiers
  const armoiriesData = assets?.armoiriesUrl
    ? await loadImageAsDataUrl(assets.armoiriesUrl)
    : "";
  const logoData = assets?.cnamgsLogoUrl
    ? await loadImageAsDataUrl(assets.cnamgsLogoUrl)
    : "";
  const chipData = await loadImageAsDataUrl('/puce_cnamgs.png');
  
  // Charger le filigrane en ultra haute résolution avec opacité
  const watermarkData = await loadWatermarkHighRes('/fili_cnamgs.png', 0.25);
  
  // Charger la photo et la découper en ellipse (comme dans l'application - rx=130, ry=160)
  const photoData = assets?.photoUrl
    ? await loadEllipticalImageAsDataUrl(assets.photoUrl, 260, 320)
    : "";

  // Capturer le SVG de la carte comme image ultra haute résolution
  const cardImageData = await captureSVGAsImage();
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FOND BLANC AVEC COINS ARRONDIS (MASQUE DE BASE)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Dessiner un fond blanc avec coins arrondis pour créer la zone de la carte
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(CARD_X, CARD_Y, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");
  
  if (cardImageData) {
    // Réduire légèrement les images pour éviter tout débordement
    const imgMargin = 0.1; // marge de sécurité
    const imgX = CARD_X + imgMargin;
    const imgY = CARD_Y + imgMargin;
    const imgW = CARD.w - 2 * imgMargin;
    const imgH = CARD.h - 2 * imgMargin;
    
    // Ajouter l'image capturée de la carte en haute qualité (légèrement réduite)
    doc.addImage(cardImageData, "PNG", imgX, imgY, imgW, imgH, undefined, 'FAST');
    
    // Ajouter le filigrane dans la partie basse APRÈS le SVG mais AVANT les autres images (réduit)
    if (watermarkData) {
      const watermarkY = CARD_Y + CARD.h * 0.266 + imgMargin;
      const watermarkH = CARD.h * 0.734 - 2 * imgMargin;
      doc.addImage(watermarkData, "PNG", imgX, watermarkY, imgW, watermarkH, undefined, 'FAST');
    }
    
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

    // Photo du titulaire (bas droite) - ellipse verticale comme dans le SVG (confinée)
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
      
      // Vérifier que la photo ne dépasse pas les bords de la carte
      const maxPhotoX = CARD_X + CARD.w - photoW - 0.5;
      const maxPhotoY = CARD_Y + CARD.h - photoH - 0.5;
      const finalPhotoX = Math.min(photoX, maxPhotoX);
      const finalPhotoY = Math.min(photoY, maxPhotoY);
      
      doc.addImage(photoData, "PNG", finalPhotoX, finalPhotoY, photoW, photoH);
    }
  } else {
    // Fallback: rendu vectoriel si la capture échoue
    
    // Fond blanc pour la partie haute
    doc.setFillColor(255, 255, 255);
    doc.rect(CARD_X, CARD_Y, CARD.w, CARD.h * 0.254, "F");
    
    // Fond vert clair pour la partie basse
    doc.setFillColor(233, 242, 233);
    const basseY = CARD_Y + CARD.h * 0.254;
    doc.rect(CARD_X, basseY, CARD.w, CARD.h * 0.746, "F");
    
    // Ajouter le filigrane dans la partie basse avec opacité
    if (watermarkData) {
      const watermarkY = CARD_Y + CARD.h * 0.266;
      const watermarkH = CARD.h * 0.734;
      doc.addImage(watermarkData, "PNG", CARD_X, watermarkY, CARD.w, watermarkH, undefined, 'FAST');
    }

    // Bande verte horizontale
    const bandY = CARD_Y + CARD.h * 0.254;
    doc.setFillColor(42, 168, 74);
    doc.rect(CARD_X, bandY, CARD.w, CARD.h * 0.012, "F"); // 8px sur 650px = 1.2%

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

  // ═══════════════════════════════════════════════════════════════════════════
  // MASQUE FINAL : Rectangle blanc par-dessus pour couper les débordements
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Dessiner 4 rectangles blancs autour de la carte pour masquer tout débordement
  // Haut
  doc.setFillColor(255, 255, 255);
  doc.rect(CARD_X - 5, CARD_Y - 5, CARD.w + 10, 5, "F");
  // Bas
  doc.rect(CARD_X - 5, CARD_Y + CARD.h, CARD.w + 10, 5, "F");
  // Gauche
  doc.rect(CARD_X - 5, CARD_Y - 5, 5, CARD.h + 10, "F");
  // Droite
  doc.rect(CARD_X + CARD.w, CARD_Y - 5, 5, CARD.h + 10, "F");
  
  // Redessiner le cadre de la carte par-dessus pour des bords nets
  doc.setLineWidth(0.08);
  doc.setDrawColor(180, 180, 180);
  doc.roundedRect(CARD_X, CARD_Y, CARD.w, CARD.h, CARD.radius, CARD.radius);
  
  // Bordure intérieure subtile pour effet de profondeur
  doc.setLineWidth(0.05);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(CARD_X + 0.1, CARD_Y + 0.1, CARD.w - 0.2, CARD.h - 0.2, CARD.radius - 0.05, CARD.radius - 0.05);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTIONS D'INFORMATIONS (à gauche de la carte)
  // ═══════════════════════════════════════════════════════════════════════════
  
  let currentY = HEADER_H + 8;
  const leftColumnW = A4.w - CARD.w - 3 * MARGIN - 5;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1 : Informations de l'Assuré
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Titre de section
  doc.setFillColor(239, 246, 255);
  doc.rect(MARGIN, currentY, leftColumnW, 7, "F");
  doc.setFillColor(59, 130, 246);
  doc.rect(MARGIN, currentY, 0.8, 7, "F");
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("📋 INFORMATIONS DE L'ASSURÉ", MARGIN + 3, currentY + 4.5);
  currentY += 10;
  
  // Grille d'informations (2 colonnes)
  const gridStartY = currentY;
  const colWidth = leftColumnW / 2;
  
  const drawInfoBox = (label: string, value: string, x: number, y: number, w: number) => {
    // Fond
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.1);
    doc.roundedRect(x, y, w, 10, 1, 1, "FD");
    
    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(label, x + 2, y + 3.5);
    
    // Valeur
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text(value, x + 2, y + 7.5);
  };
  
  // Ligne 1
  drawInfoBox("NUMÉRO D'ASSURÉ", data.numero, MARGIN, currentY, colWidth - 2);
  drawInfoBox("NOM ET PRÉNOMS", `${data.nom} ${data.prenoms}`, MARGIN + colWidth, currentY, colWidth - 2);
  currentY += 12;
  
  // Ligne 2
  drawInfoBox("DATE DE NAISSANCE", data.dateNaissance, MARGIN, currentY, colWidth - 2);
  drawInfoBox("QUALITÉ", data.qualite || "Assuré Principal", MARGIN + colWidth, currentY, colWidth - 2);
  currentY += 12;
  
  // Ligne 3
  drawInfoBox("RÉGIME", data.regime, MARGIN, currentY, colWidth - 2);
  
  // Statut badge
  const statutX = MARGIN + colWidth;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.1);
  doc.roundedRect(statutX, currentY, colWidth - 2, 10, 1, 1, "FD");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("STATUT", statutX + 2, currentY + 3.5);
  
  // Badge statut
  const isActif = data.statut !== "Inactif";
  doc.setFillColor(isActif ? 16 : 239, isActif ? 185 : 68, isActif ? 129 : 68);
  doc.roundedRect(statutX + 2, currentY + 5, 18, 4, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(data.statut || "ACTIF", statutX + 11, currentY + 8, { align: "center" });
  
  currentY += 15;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2 : Droits et Taux de Couverture (sous la carte, pleine largeur)
  // ═══════════════════════════════════════════════════════════════════════════
  
  currentY = Math.max(currentY, CARD_Y + CARD.h + 10);
  
  // Titre de section
  doc.setFillColor(239, 246, 255);
  doc.rect(MARGIN, currentY, A4.w - 2 * MARGIN, 7, "F");
  doc.setFillColor(59, 130, 246);
  doc.rect(MARGIN, currentY, 0.8, 7, "F");
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("✅ DROITS ET TAUX DE COUVERTURE", MARGIN + 3, currentY + 4.5);
  currentY += 10;
  
  // Tableau des couvertures
  const tableX = MARGIN;
  const tableW = A4.w - 2 * MARGIN;
  const col1W = tableW * 0.5;
  const col2W = tableW * 0.25;
  const col3W = tableW * 0.25;
  const rowH = 8;
  
  // En-tête du tableau
  doc.setFillColor(30, 64, 175);
  doc.rect(tableX, currentY, tableW, rowH, "F");
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Type de Prestation", tableX + 3, currentY + 5.5);
  doc.text("Taux de Couverture", tableX + col1W + 3, currentY + 5.5);
  doc.text("Ticket Modérateur", tableX + col1W + col2W + 3, currentY + 5.5);
  currentY += rowH;
  
  // Lignes du tableau
  data.couvertures.forEach((couv, idx) => {
    // Fond alterné
    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(tableX, currentY, tableW, rowH, "F");
    }
    
    // Bordures
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.1);
    doc.line(tableX, currentY + rowH, tableX + tableW, currentY + rowH);
    
    // Contenu
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text(couv.type, tableX + 3, currentY + 5.5);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(10);
    doc.text(couv.taux, tableX + col1W + 3, currentY + 5.5);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(8);
    doc.text(couv.ticket, tableX + col1W + col2W + 3, currentY + 5.5);
    
    currentY += rowH;
  });
  
  currentY += 8;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3 : Période de Validité
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Titre de section
  doc.setFillColor(239, 246, 255);
  doc.rect(MARGIN, currentY, A4.w - 2 * MARGIN, 7, "F");
  doc.setFillColor(59, 130, 246);
  doc.rect(MARGIN, currentY, 0.8, 7, "F");
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("📅 PÉRIODE DE VALIDITÉ", MARGIN + 3, currentY + 4.5);
  currentY += 10;
  
  // Grille validité (4 colonnes)
  const validiteColW = (A4.w - 2 * MARGIN) / 4;
  drawInfoBox("DATE DE DÉBUT", data.dateDebut || "01/01/2025", MARGIN, currentY, validiteColW - 2);
  drawInfoBox("DATE DE FIN", data.dateFin || "31/12/2025", MARGIN + validiteColW, currentY, validiteColW - 2);
  drawInfoBox("DATE D'ÉDITION", new Date().toLocaleDateString("fr-FR"), MARGIN + 2 * validiteColW, currentY, validiteColW - 2);
  drawInfoBox("EMPLOYEUR", data.employeur, MARGIN + 3 * validiteColW, currentY, validiteColW - 2);
  
  currentY += 15;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AVERTISSEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  doc.roundedRect(MARGIN, currentY, A4.w - 2 * MARGIN, 18, 1, 1, "FD");
  
  doc.setFillColor(245, 158, 11);
  doc.rect(MARGIN, currentY, 1, 18, "F");
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(146, 64, 14);
  doc.text("⚠️ IMPORTANT", MARGIN + 3, currentY + 5);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const warningText = "Cette attestation est valable uniquement auprès des prestataires conventionnés CNAMGS.";
  const warningText2 = "Le système de tiers-payant s'applique selon les tarifs conventionnés. Tout dépassement (GAP)";
  const warningText3 = "reste à votre charge. Présentez cette attestation lors de chaque consultation.";
  doc.text(warningText, MARGIN + 3, currentY + 9);
  doc.text(warningText2, MARGIN + 3, currentY + 12.5);
  doc.text(warningText3, MARGIN + 3, currentY + 16);
  
  currentY += 22;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNATURE
  // ═══════════════════════════════════════════════════════════════════════════
  
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(`Fait à Libreville, le ${new Date().toLocaleDateString("fr-FR")}`, A4.w - MARGIN, currentY, { align: "right" });
  currentY += 15;
  
  // Ligne de signature
  const signatureX = A4.w - MARGIN - 50;
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.4);
  doc.line(signatureX, currentY, A4.w - MARGIN, currentY);
  
  currentY += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("Le Directeur Général", (signatureX + A4.w - MARGIN) / 2, currentY, { align: "center" });
  currentY += 3.5;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("CNAMGS", (signatureX + A4.w - MARGIN) / 2, currentY, { align: "center" });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PIED DE PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const footerY = A4.h - 25;
  
  doc.setFillColor(243, 244, 246);
  doc.rect(0, footerY, A4.w, 25, "F");
  
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(0, footerY, A4.w, footerY);
  
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("CNAMGS - Siège Social :", MARGIN, footerY + 5);
  doc.setFont("helvetica", "normal");
  doc.text("Libreville, Gabon", MARGIN + 35, footerY + 5);
  
  doc.setFont("helvetica", "bold");
  doc.text("Téléphone :", MARGIN, footerY + 9);
  doc.setFont("helvetica", "normal");
  doc.text("+241 01 XX XX XX", MARGIN + 20, footerY + 9);
  
  doc.setFont("helvetica", "bold");
  doc.text("Email :", MARGIN + 60, footerY + 9);
  doc.setFont("helvetica", "normal");
  doc.text("contact@cnamgs.ga", MARGIN + 70, footerY + 9);
  
  doc.setFont("helvetica", "bold");
  doc.text("Site web :", MARGIN, footerY + 13);
  doc.setFont("helvetica", "normal");
  doc.text("www.cnamgs.ga", MARGIN + 16, footerY + 13);
  
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(107, 114, 128);
  const footerNote = "Ce document est une attestation officielle de droits. Il doit être présenté à chaque consultation médicale auprès des prestataires";
  const footerNote2 = "conventionnés. Pour toute réclamation ou vérification, contactez le service assuré de la CNAMGS.";
  doc.text(footerNote, MARGIN, footerY + 18);
  doc.text(footerNote2, MARGIN, footerY + 21);

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════════════════════════════════
  if (opts?.downloadFileName) {
    doc.save(opts.downloadFileName);
  }

  return doc.output("blob");
};
