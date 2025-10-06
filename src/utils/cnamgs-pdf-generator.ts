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
  // CARTE CNAMGS (vectorielle + images)
  // ═══════════════════════════════════════════════════════════════════════════

  // Traits de coupe
  drawCutMarks(doc, CARD_X, CARD_Y, CARD.w, CARD.h, 3);

  // Fond carte (vert clair)
  doc.setFillColor(233, 242, 233);
  doc.roundedRect(CARD_X, CARD_Y, CARD.w, CARD.h, CARD.radius, CARD.radius, "F");

  // Bande verte horizontale
  const bandY = CARD_Y + 13.4;
  doc.setFillColor(42, 168, 74);
  doc.rect(CARD_X, bandY, CARD.w, 0.65, "F");

  // ─────────────────────────────────────────────────────────────────────────
  // Images (armoiries, logo CNAMGS, photo)
  // ─────────────────────────────────────────────────────────────────────────
  const armoiriesData = assets?.armoiriesUrl
    ? await loadImageAsDataUrl(assets.armoiriesUrl)
    : "";
  const logoData = assets?.cnamgsLogoUrl
    ? await loadImageAsDataUrl(assets.cnamgsLogoUrl)
    : "";
  const photoData = assets?.photoUrl
    ? await loadImageAsDataUrl(assets.photoUrl)
    : "";

  // Armoiries (haut gauche)
  if (armoiriesData) {
    doc.addImage(armoiriesData, "PNG", CARD_X + 4.9, CARD_Y + 2.8, 9.8, 9.8);
  }

  // Logo CNAMGS (centre haut)
  if (logoData) {
    doc.addImage(logoData, "PNG", CARD_X + 32, CARD_Y + 3.7, 32.6, 9);
  }

  // Textes en-tête carte
  doc.setFontSize(3);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 17, 17);
  doc.text("RÉPUBLIQUE", CARD_X + 15.5, CARD_Y + 7.3);
  doc.text("GABONAISE", CARD_X + 15.5, CARD_Y + 10.6);

  doc.setFontSize(2.8);
  doc.text(data.regime, CARD_X + CARD.w / 2, CARD_Y + 17.1, { align: "center" });
  doc.text("Carte d'Assurance Maladie", CARD_X + CARD.w / 2, CARD_Y + 20.5, {
    align: "center",
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Puce (chip) vectorielle
  // ─────────────────────────────────────────────────────────────────────────
  const chipX = CARD_X + 9.9;
  const chipY = CARD_Y + 19.1;
  doc.setFillColor(239, 211, 137);
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.12);
  doc.roundedRect(chipX, chipY, 13.2, 10.2, 1.5, 1.5, "FD");

  // Lignes internes puce
  doc.setLineWidth(0.08);
  doc.setDrawColor(26, 26, 26);
  const chipLines = [
    [chipX + 2, chipY + 2.5, chipX + 11.2, chipY + 2.5],
    [chipX + 2, chipY + 5, chipX + 11.2, chipY + 5],
    [chipX + 2, chipY + 7.5, chipX + 11.2, chipY + 7.5],
    [chipX + 6.6, chipY + 2.5, chipX + 6.6, chipY + 7.7],
  ];
  chipLines.forEach(([x1, y1, x2, y2]) => doc.line(x1, y1, x2, y2));

  // ─────────────────────────────────────────────────────────────────────────
  // Numéro de carte
  // ─────────────────────────────────────────────────────────────────────────
  doc.setFontSize(3.2);
  doc.setFont("courier", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(data.numero, CARD_X + 39.5, CARD_Y + 24.4);

  // ─────────────────────────────────────────────────────────────────────────
  // Champs identité (labels + valeurs)
  // ─────────────────────────────────────────────────────────────────────────
  doc.setFontSize(2.1);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 17, 17);
  doc.text("Nom", CARD_X + 8.1, CARD_Y + 35.2);
  doc.text("Prénoms", CARD_X + 8.1, CARD_Y + 41.9);
  doc.text("Date de naissance", CARD_X + 8, CARD_Y + 48.6);
  doc.text("Sexe", CARD_X + 44.7, CARD_Y + 43.5);

  // Valeurs
  doc.setFontSize(2.4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(data.nom, CARD_X + 8.1, CARD_Y + 38.1);
  doc.text(data.prenoms, CARD_X + 8.1, CARD_Y + 44.8);
  doc.text(data.dateNaissance, CARD_X + 8.1, CARD_Y + 51.5);
  doc.text(data.sexe || "M", CARD_X + 44.7, CARD_Y + 46.4);

  // ─────────────────────────────────────────────────────────────────────────
  // Photo titulaire (cercle)
  // ─────────────────────────────────────────────────────────────────────────
  if (photoData) {
    const photoSize = 11.8;
    const photoX = CARD_X + 59.5;
    const photoY = CARD_Y + 26.6;
    doc.addImage(photoData, "PNG", photoX, photoY, photoSize, photoSize);
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
